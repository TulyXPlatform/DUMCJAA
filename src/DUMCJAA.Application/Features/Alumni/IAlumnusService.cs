using DUMCJAA.Application.Common;
using DUMCJAA.Application.Features.Alumni.DTOs;

namespace DUMCJAA.Application.Features.Alumni;

public interface IAlumnusService
{
    Task<PagedResult<AlumnusDto>> GetAllAsync(AlumnusPaginationParams parameters, CancellationToken ct = default);
    Task<AlumnusDto> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<AlumnusDto> CreateAsync(CreateAlumnusDto dto, CancellationToken ct = default);
    Task<AlumnusDto> UpdateAsync(Guid id, UpdateAlumnusDto dto, CancellationToken ct = default);
    Task<AlumnusDto> UpdateApprovalStatusAsync(Guid id, bool isApproved, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
