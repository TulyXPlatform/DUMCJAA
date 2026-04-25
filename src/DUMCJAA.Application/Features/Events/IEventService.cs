using DUMCJAA.Application.Common;
using DUMCJAA.Application.Features.Events.DTOs;

namespace DUMCJAA.Application.Features.Events;

public interface IEventService
{
    Task<PagedResult<EventDto>> GetAllAsync(PaginationParams parameters, CancellationToken ct = default);
    Task<EventDto> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<EventDto> CreateAsync(CreateEventDto dto, CancellationToken ct = default);
    Task<EventDto> UpdateAsync(Guid id, UpdateEventDto dto, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);

    Task<EventRegistrationDto> RegisterUserAsync(Guid eventId, Guid userId, CancellationToken ct = default);
    Task UnregisterUserAsync(Guid eventId, Guid userId, CancellationToken ct = default);
    Task<IReadOnlyList<EventRegistrationDto>> GetEventRegistrationsAsync(Guid eventId, CancellationToken ct = default);
}
