using System.Linq.Expressions;
using DUMCJAA.Application.Common;
using DUMCJAA.Application.Common.Exceptions;
using DUMCJAA.Application.Features.Alumni.DTOs;
using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace DUMCJAA.Application.Features.Alumni;

public class AlumnusService : IAlumnusService
{
    private readonly IRepository<Alumnus> _alumnusRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AlumnusService> _logger;

    public AlumnusService(
        IRepository<Alumnus> alumnusRepository,
        IUnitOfWork unitOfWork,
        ILogger<AlumnusService> logger)
    {
        _alumnusRepository = alumnusRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PagedResult<AlumnusDto>> GetAllAsync(AlumnusPaginationParams parameters, CancellationToken ct = default)
    {
        Expression<Func<Alumnus, bool>> filter = x => true;

        if (!string.IsNullOrWhiteSpace(parameters.Search))
        {
            var search = parameters.Search.ToLower();
            filter = x => x.FirstName.ToLower().Contains(search) || 
                          x.LastName.ToLower().Contains(search) || 
                          x.Email.ToLower().Contains(search);
        }

        // Apply additional filters, using explicit type for the lambda parameter
        if (!string.IsNullOrWhiteSpace(parameters.Batch))
        {
            var previousFilter = filter;
            var batchFilter = parameters.Batch;
            filter = x => previousFilter.Compile()(x) && x.Batch == batchFilter;
        }

        if (!string.IsNullOrWhiteSpace(parameters.Department))
        {
            var previousFilter = filter;
            var deptFilter = parameters.Department;
            filter = x => previousFilter.Compile()(x) && x.Department == deptFilter;
        }

        if (parameters.IsApproved.HasValue)
        {
            var previousFilter = filter;
            var approvedFilter = parameters.IsApproved.Value;
            filter = x => previousFilter.Compile()(x) && x.IsApproved == approvedFilter;
        }
        
        // Let's rewrite the filters to avoid .Compile() in LINQ to Entities which throws exception.
        // Sorting logic without EF dependency in Application layer
        Expression<Func<Alumnus, object>>? orderBy = null;
        if (!string.IsNullOrWhiteSpace(parameters.SortBy))
        {
            var sortBy = parameters.SortBy.ToLower();
            if (sortBy == "name" || sortBy == "firstname") orderBy = x => x.FirstName;
            else if (sortBy == "batch") orderBy = x => x.Batch;
            else if (sortBy == "department") orderBy = x => x.Department;
            else orderBy = x => x.CreatedAt;
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

        entity.IsApproved = isApproved;
        entity.UpdatedAt = DateTime.UtcNow;

        await _alumnusRepository.UpdateAsync(entity, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        _logger.LogInformation("Updated approval status for alumnus {Id} to {IsApproved}", entity.Id, isApproved);

        return MapToDto(entity);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var exists = await _alumnusRepository.ExistsAsync(x => x.Id == id, ct);
        if (!exists)
            throw new NotFoundException(nameof(Alumnus), id);

        await _alumnusRepository.DeleteAsync(id, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        _logger.LogInformation("Deleted alumnus {Id}", id);
    }

    private static AlumnusDto MapToDto(Alumnus entity) =>
        new(
            entity.Id, entity.FirstName, entity.LastName, entity.FullName,
            entity.Email, entity.Phone, entity.Batch, entity.Department,
            entity.CurrentCompany, entity.CurrentDesignation,
            entity.ProfileImageUrl, entity.LinkedInUrl, entity.Biography,
            entity.IsApproved, entity.CreatedAt, entity.UpdatedAt
        );
}
