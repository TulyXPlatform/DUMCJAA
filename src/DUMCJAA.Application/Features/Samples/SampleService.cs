using DUMCJAA.Application.Common;
using DUMCJAA.Application.Common.Exceptions;
using DUMCJAA.Application.Features.Samples.DTOs;
using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace DUMCJAA.Application.Features.Samples;

public class SampleService : ISampleService
{
    private readonly IRepository<SampleEntity> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<SampleService> _logger;

    public SampleService(
        IRepository<SampleEntity> repository,
        IUnitOfWork unitOfWork,
        ILogger<SampleService> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<SampleDto> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await _repository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException(nameof(SampleEntity), id);

        return MapToDto(entity);
    }

    public async Task<PagedResult<SampleDto>> GetAllAsync(PaginationParams paging, CancellationToken ct = default)
    {
        var (items, totalCount) = await _repository.GetPagedAsync(
            paging.Page, paging.PageSize,
            filter: string.IsNullOrWhiteSpace(paging.Search)
                ? null
                : x => x.Name.Contains(paging.Search),
            ct: ct);

        return new PagedResult<SampleDto>
        {
            Items = items.Select(MapToDto).ToList(),
            Page = paging.Page,
            PageSize = paging.PageSize,
            TotalCount = totalCount
        };
    }

    public async Task<SampleDto> CreateAsync(CreateSampleDto dto, CancellationToken ct = default)
    {
        var entity = new SampleEntity
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            IsActive = dto.IsActive
        };

        await _repository.AddAsync(entity, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        _logger.LogInformation("Created sample entity {Id}", entity.Id);

        return MapToDto(entity);
    }

    public async Task<SampleDto> UpdateAsync(Guid id, UpdateSampleDto dto, CancellationToken ct = default)
    {
        var entity = await _repository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException(nameof(SampleEntity), id);

        entity.Name = dto.Name;
        entity.Description = dto.Description;
        entity.IsActive = dto.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(entity, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        _logger.LogInformation("Updated sample entity {Id}", entity.Id);

        return MapToDto(entity);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var exists = await _repository.ExistsAsync(x => x.Id == id, ct);
        if (!exists)
            throw new NotFoundException(nameof(SampleEntity), id);

        await _repository.DeleteAsync(id, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        _logger.LogInformation("Deleted sample entity {Id}", id);
    }

    private static SampleDto MapToDto(SampleEntity entity) =>
        new(entity.Id, entity.Name, entity.Description, entity.IsActive, entity.CreatedAt, entity.UpdatedAt);
}
