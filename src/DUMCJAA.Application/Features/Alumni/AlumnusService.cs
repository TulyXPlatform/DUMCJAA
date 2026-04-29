using System.Linq.Expressions;
using DUMCJAA.Application.Common;
using DUMCJAA.Application.Common.Exceptions;
using DUMCJAA.Application.Features.Alumni.DTOs;
using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;
using DUMCJAA.Domain.Common;
using Microsoft.Extensions.Logging;

namespace DUMCJAA.Application.Features.Alumni;

public class AlumnusService : IAlumnusService
{
    private readonly IRepository<Alumnus> _alumnusRepository;
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AlumnusService> _logger;

    public AlumnusService(
        IRepository<Alumnus> alumnusRepository,
        IUserRepository userRepository,
        IEmailService emailService,
        IUnitOfWork unitOfWork,
        ILogger<AlumnusService> logger)
    {
        _alumnusRepository = alumnusRepository;
        _userRepository = userRepository;
        _emailService = emailService;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PagedResult<AlumnusDto>> GetAllAsync(AlumnusPaginationParams parameters, CancellationToken ct = default)
    {
        // Sorting logic
        Expression<Func<Alumnus, object>>? orderBy = null;
        if (!string.IsNullOrWhiteSpace(parameters.SortBy))
        {
            var sortBy = parameters.SortBy.ToLower();
            orderBy = sortBy switch
            {
                "name" or "firstname" => x => x.FirstName!,
                "batch" => x => x.Batch!,
                "department" => x => x.Department!,
                _ => x => x.CreatedAt!
            };
        }

        var (items, totalCount) = await _alumnusRepository.GetPagedAsync(
            parameters.Page, 
            parameters.PageSize,
            filter: BuildFilter(parameters),
            orderBy: orderBy,
            ascending: !parameters.SortDescending,
            ct: ct);

        return new PagedResult<AlumnusDto>
        {
            Items = items.Select(MapToDto).ToList(),
            Page = parameters.Page,
            PageSize = parameters.PageSize,
            TotalCount = totalCount
        };
    }
    
    // Helper method to build filter expression cleanly
    private static Expression<Func<Alumnus, bool>> BuildFilter(AlumnusPaginationParams p)
    {
        var hasSearch = !string.IsNullOrWhiteSpace(p.Search);
        var search = p.Search?.ToLower() ?? "";
        
        return x => 
            (!hasSearch || x.FirstName.ToLower().Contains(search) || x.LastName.ToLower().Contains(search) || x.Email.ToLower().Contains(search)) &&
            (string.IsNullOrWhiteSpace(p.Batch) || x.Batch == p.Batch) &&
            (string.IsNullOrWhiteSpace(p.Department) || x.Department == p.Department) &&
            (!p.IsApproved.HasValue || x.IsApproved == p.IsApproved.Value);
    }

    public async Task<AlumnusDto> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await _alumnusRepository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException(nameof(Alumnus), id);

        return MapToDto(entity);
    }

    public async Task<AlumnusDto> CreateAsync(CreateAlumnusDto dto, CancellationToken ct = default)
    {
        var exists = await _alumnusRepository.ExistsAsync(x => x.Email == dto.Email, ct);
        if (exists)
            throw new ConflictException($"An alumnus with email '{dto.Email}' already exists.");

        var entity = new Alumnus
        {
            Id = Guid.NewGuid(),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            StudentId = dto.StudentId,
            Phone = dto.Phone,
            Batch = dto.Batch,
            Department = dto.Department,
            CurrentCompany = dto.CurrentCompany,
            CurrentDesignation = dto.CurrentDesignation,
            ProfileImageUrl = dto.ProfileImageUrl,
            LinkedInUrl = dto.LinkedInUrl,
            Biography = dto.Biography,
            IsApproved = false // Require approval by default
        };

        await _alumnusRepository.AddAsync(entity, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        _logger.LogInformation("Created new alumnus {Id}", entity.Id);

        // Notify Admins
        var adminEmails = await _userRepository.GetAdminEmailsAsync(ct);
        if (adminEmails.Any())
        {
            await _emailService.SendAsync(new EmailMessage
            {
                To = string.Join(",", adminEmails),
                Subject = "New Alumni Registration Request",
                HtmlBody = $@"
                    <h3>New Registration Request</h3>
                    <p><strong>Name:</strong> {entity.FullName}</p>
                    <p><strong>Email:</strong> {entity.Email}</p>
                    <p><strong>Student ID:</strong> {entity.StudentId}</p>
                    <p><strong>Batch:</strong> {entity.Batch}</p>
                    <p>Please log in to the admin panel to review this request.</p>"
            });
        }

        return MapToDto(entity);
    }

    public async Task<AlumnusDto> UpdateAsync(Guid id, UpdateAlumnusDto dto, CancellationToken ct = default)
    {
        var entity = await _alumnusRepository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException(nameof(Alumnus), id);

        entity.FirstName = dto.FirstName;
        entity.LastName = dto.LastName;
        entity.Phone = dto.Phone;
        entity.Batch = dto.Batch;
        entity.Department = dto.Department;
        entity.CurrentCompany = dto.CurrentCompany;
        entity.CurrentDesignation = dto.CurrentDesignation;
        entity.ProfileImageUrl = dto.ProfileImageUrl;
        entity.LinkedInUrl = dto.LinkedInUrl;
        entity.Biography = dto.Biography;
        entity.UpdatedAt = DateTime.UtcNow;

        await _alumnusRepository.UpdateAsync(entity, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        _logger.LogInformation("Updated alumnus {Id}", entity.Id);

        return MapToDto(entity);
    }
    
    public async Task<AlumnusDto> UpdateApprovalStatusAsync(Guid id, bool isApproved, CancellationToken ct = default)
    {
        var entity = await _alumnusRepository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException(nameof(Alumnus), id);

        var previouslyApproved = entity.IsApproved;
        entity.IsApproved = isApproved;
        entity.UpdatedAt = DateTime.UtcNow;

        await _alumnusRepository.UpdateAsync(entity, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        _logger.LogInformation("Updated approval status for alumnus {Id} to {IsApproved}", entity.Id, isApproved);

        // Notify Alumnus if approved
        if (isApproved && !previouslyApproved)
        {
            await _emailService.SendAsync(new EmailMessage
            {
                To = entity.Email,
                Subject = "Alumni Membership Approved",
                HtmlBody = $@"
                    <h3>Congratulations {entity.FirstName}!</h3>
                    <p>Your request to join the alumni association has been approved.</p>
                    <p>You can now log in and access all features.</p>"
            });
        }

        return MapToDto(entity);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await _alumnusRepository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException(nameof(Alumnus), id);

        var wasPending = !entity.IsApproved;

        await _alumnusRepository.DeleteAsync(id, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        _logger.LogInformation("Deleted alumnus {Id}", id);

        // Notify Alumnus of rejection if it was a pending request
        if (wasPending)
        {
            await _emailService.SendAsync(new EmailMessage
            {
                To = entity.Email,
                Subject = "Alumni Membership Request Update",
                HtmlBody = $@"
                    <p>Dear {entity.FirstName},</p>
                    <p>Thank you for your interest in joining the alumni association.</p>
                    <p>Unfortunately, your request could not be approved at this time. If you believe this is an error, please contact support.</p>"
            });
        }
    }

    private static AlumnusDto MapToDto(Alumnus entity) =>
        new(
            entity.Id, entity.FirstName, entity.LastName, entity.FullName,
            entity.Email, entity.StudentId, entity.Phone, entity.Batch, entity.Department,
            entity.CurrentCompany, entity.CurrentDesignation,
            entity.ProfileImageUrl, entity.LinkedInUrl, entity.Biography,
            entity.IsApproved, entity.CreatedAt, entity.UpdatedAt
        );
}
