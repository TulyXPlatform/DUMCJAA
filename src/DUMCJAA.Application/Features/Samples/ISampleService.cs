using DUMCJAA.Application.Common;
using DUMCJAA.Application.Features.Samples.DTOs;

namespace DUMCJAA.Application.Features.Samples;

public interface ISampleService
{
    Task<SampleDto> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<SampleDto>> GetAllAsync(PaginationParams paging, CancellationToken ct = default);
    Task<SampleDto> CreateAsync(CreateSampleDto dto, CancellationToken ct = default);
    Task<SampleDto> UpdateAsync(Guid id, UpdateSampleDto dto, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
