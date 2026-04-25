using System.Linq.Expressions;
using DUMCJAA.Application.Common;
using DUMCJAA.Application.Common.Exceptions;
using DUMCJAA.Application.Features.Events.DTOs;
using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace DUMCJAA.Application.Features.Events;

public class EventService : IEventService
{
    private readonly IRepository<Event> _eventRepository;
    private readonly IRepository<EventRegistration> _registrationRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<EventService> _logger;

    public EventService(
        IRepository<Event> eventRepository,
        IRepository<EventRegistration> registrationRepository,
        IRepository<User> userRepository,
        IUnitOfWork unitOfWork,
        ILogger<EventService> logger)
    {
        _eventRepository = eventRepository;
        _registrationRepository = registrationRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PagedResult<EventDto>> GetAllAsync(PaginationParams parameters, CancellationToken ct = default)
    {
        Expression<Func<Event, bool>> filter = x => true;

        if (!string.IsNullOrWhiteSpace(parameters.Search))
        {
            var search = parameters.Search.ToLower();
            filter = x => x.Title.ToLower().Contains(search) || x.Location.ToLower().Contains(search);
        }

        Expression<Func<Event, object>>? orderBy = null;
        if (!string.IsNullOrWhiteSpace(parameters.SortBy))
        {
            var sortBy = parameters.SortBy.ToLower();
            if (sortBy == "date") orderBy = x => x.EventDate;
            else if (sortBy == "title") orderBy = x => x.Title;
            else orderBy = x => x.CreatedAt;
        }
        else
        {
            orderBy = x => x.EventDate; // Default sort by date
        }

        var (items, totalCount) = await _eventRepository.GetPagedAsync(
            parameters.Page, 
            parameters.PageSize,
            filter: filter,
            orderBy: orderBy,
            ascending: !parameters.SortDescending,
            ct: ct);

        // N+1 problem potential here, but for simplicity we'll fetch registrations per event
        // In a real production scenario, we'd use Include() in the repository or a specialized query.
        var dtos = new List<EventDto>();
        foreach (var item in items)
        {
            dtos.Add(await MapToDtoAsync(item, ct));
        }

        return new PagedResult<EventDto>
        {
            Items = dtos,
            Page = parameters.Page,
            PageSize = parameters.PageSize,
            TotalCount = totalCount
        };
    }

    public async Task<EventDto> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await _eventRepository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException(nameof(Event), id);

        return await MapToDtoAsync(entity, ct);
    }

    public async Task<EventDto> CreateAsync(CreateEventDto dto, CancellationToken ct = default)
    {
        var entity = new Event
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            EventDate = dto.EventDate,
            Location = dto.Location,
            ImageUrl = dto.ImageUrl,
            MaxAttendees = dto.MaxAttendees
        };

        await _eventRepository.AddAsync(entity, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        _logger.LogInformation("Created new event {Id}", entity.Id);

        return await MapToDtoAsync(entity, ct);
    }

    public async Task<EventDto> UpdateAsync(Guid id, UpdateEventDto dto, CancellationToken ct = default)
    {
        var entity = await _eventRepository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException(nameof(Event), id);

        // Business Rule: Can't update dates of past events
        if (entity.EventDate < DateTime.UtcNow)
            throw new ConflictException("Cannot update a past event.");

        // Business Rule: If reducing capacity, ensure it's not below current registrations
        var currentRegistrations = (await _registrationRepository.GetPagedAsync(1, 1, x => x.EventId == id, ct: ct)).TotalCount;
        if (dto.MaxAttendees.HasValue && dto.MaxAttendees.Value < currentRegistrations)
            throw new ConflictException($"Cannot reduce capacity below current registrations ({currentRegistrations}).");

        entity.Title = dto.Title;
        entity.Description = dto.Description;
        entity.EventDate = dto.EventDate;
        entity.Location = dto.Location;
        entity.ImageUrl = dto.ImageUrl;
        entity.MaxAttendees = dto.MaxAttendees;
        entity.UpdatedAt = DateTime.UtcNow;

        await _eventRepository.UpdateAsync(entity, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        _logger.LogInformation("Updated event {Id}", entity.Id);

        return await MapToDtoAsync(entity, ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var exists = await _eventRepository.ExistsAsync(x => x.Id == id, ct);
        if (!exists)
            throw new NotFoundException(nameof(Event), id);

        await _eventRepository.DeleteAsync(id, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        _logger.LogInformation("Deleted event {Id}", id);
    }

    public async Task<EventRegistrationDto> RegisterUserAsync(Guid eventId, Guid userId, CancellationToken ct = default)
    {
        var ev = await _eventRepository.GetByIdAsync(eventId, ct)
            ?? throw new NotFoundException(nameof(Event), eventId);

        // Business Rule: Cannot register for past events
        if (ev.EventDate < DateTime.UtcNow)
            throw new ConflictException("Cannot register for a past event.");

        // Business Rule: Check if already registered
        var alreadyRegistered = await _registrationRepository.ExistsAsync(x => x.EventId == eventId && x.UserId == userId, ct);
        if (alreadyRegistered)
            throw new ConflictException("User is already registered for this event.");

        // Business Rule: Check capacity
        var currentRegistrations = (await _registrationRepository.GetPagedAsync(1, 1, x => x.EventId == eventId, ct: ct)).TotalCount;
        if (ev.MaxAttendees.HasValue && currentRegistrations >= ev.MaxAttendees.Value)
            throw new ConflictException("Event is at maximum capacity.");

        var user = await _userRepository.GetByIdAsync(userId, ct)
            ?? throw new NotFoundException(nameof(User), userId);

        var registration = new EventRegistration
        {
            Id = Guid.NewGuid(),
            EventId = eventId,
            UserId = userId,
            RegisteredAt = DateTime.UtcNow
        };

        await _registrationRepository.AddAsync(registration, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        _logger.LogInformation("User {UserId} registered for Event {EventId}", userId, eventId);

        return new EventRegistrationDto(registration.Id, eventId, userId, user.FullName, user.Email, registration.RegisteredAt);
    }

    public async Task UnregisterUserAsync(Guid eventId, Guid userId, CancellationToken ct = default)
    {
        var ev = await _eventRepository.GetByIdAsync(eventId, ct)
            ?? throw new NotFoundException(nameof(Event), eventId);

        if (ev.EventDate < DateTime.UtcNow)
            throw new ConflictException("Cannot unregister from a past event.");

        var (registrations, _) = await _registrationRepository.GetPagedAsync(1, 1, x => x.EventId == eventId && x.UserId == userId, ct: ct);
        var registration = registrations.FirstOrDefault();
        
        if (registration == null)
            throw new NotFoundException(nameof(EventRegistration), $"Event: {eventId}, User: {userId}");

        await _registrationRepository.DeleteAsync(registration.Id, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        _logger.LogInformation("User {UserId} unregistered from Event {EventId}", userId, eventId);
    }

    public async Task<IReadOnlyList<EventRegistrationDto>> GetEventRegistrationsAsync(Guid eventId, CancellationToken ct = default)
    {
        var exists = await _eventRepository.ExistsAsync(x => x.Id == eventId, ct);
        if (!exists)
            throw new NotFoundException(nameof(Event), eventId);

        // Note: For a real app, use a specialized query to join Users instead of N+1
        var (registrations, _) = await _registrationRepository.GetPagedAsync(1, 1000, x => x.EventId == eventId, ct: ct);
        
        var dtos = new List<EventRegistrationDto>();
        foreach (var reg in registrations)
        {
            var user = await _userRepository.GetByIdAsync(reg.UserId, ct);
            if (user != null)
            {
                dtos.Add(new EventRegistrationDto(reg.Id, eventId, user.Id, user.FullName, user.Email, reg.RegisteredAt));
            }
        }

        return dtos;
    }

    private async Task<EventDto> MapToDtoAsync(Event entity, CancellationToken ct)
    {
        var currentRegistrations = (await _registrationRepository.GetPagedAsync(1, 1, x => x.EventId == entity.Id, ct: ct)).TotalCount;
        var isFull = entity.MaxAttendees.HasValue && currentRegistrations >= entity.MaxAttendees.Value;
        var isPast = entity.EventDate < DateTime.UtcNow;

        return new EventDto(
            entity.Id, entity.Title, entity.Description, entity.EventDate,
            entity.Location, entity.ImageUrl, entity.MaxAttendees,
            currentRegistrations, isFull, isPast
        );
    }
}
