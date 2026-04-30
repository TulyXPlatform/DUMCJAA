using DUMCJAA.Application.Common.Exceptions;
using DUMCJAA.Application.Features.RBAC.DTOs;
using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;

namespace DUMCJAA.Application.Features.RBAC;

public class PermissionService : IPermissionService
{
    private readonly IRepository<Permission> _permissionRepository;
    private readonly IRepository<RolePermission> _rolePermissionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public PermissionService(
        IRepository<Permission> permissionRepository,
        IRepository<RolePermission> rolePermissionRepository,
        IUnitOfWork unitOfWork)
    {
        _permissionRepository = permissionRepository;
        _rolePermissionRepository = rolePermissionRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<List<PermissionDto>> GetAllPermissionsAsync()
    {
        var permissions = await _permissionRepository.GetAllAsync();
        return permissions.Select(p => new PermissionDto(p.Id, p.Name, p.Description)).ToList();
    }

    public async Task<PermissionDto> GetPermissionByIdAsync(Guid id)
    {
        var permission = await _permissionRepository.GetByIdAsync(id)
            ?? throw new NotFoundException(nameof(Permission), id);

        return new PermissionDto(permission.Id, permission.Name, permission.Description);
    }

    public async Task<PermissionDto> CreatePermissionAsync(CreatePermissionDto dto)
    {
        var exists = await _permissionRepository.ExistsAsync(p => p.Name == dto.Name);
        if (exists) throw new ConflictException($"Permission '{dto.Name}' already exists.");

        var permission = new Permission { Id = Guid.NewGuid(), Name = dto.Name.Trim(), Description = dto.Description.Trim() };
        await _permissionRepository.AddAsync(permission);
        await _unitOfWork.SaveChangesAsync();

        return new PermissionDto(permission.Id, permission.Name, permission.Description);
    }

    public async Task<PermissionDto> UpdatePermissionAsync(Guid id, UpdatePermissionDto dto)
    {
        var permission = await _permissionRepository.GetByIdAsync(id)
            ?? throw new NotFoundException(nameof(Permission), id);

        var exists = await _permissionRepository.ExistsAsync(p => p.Name == dto.Name && p.Id != id);
        if (exists) throw new ConflictException($"Permission '{dto.Name}' already exists.");

        permission.Name = dto.Name.Trim();
        permission.Description = dto.Description.Trim();
        permission.UpdatedAt = DateTime.UtcNow;

        await _permissionRepository.UpdateAsync(permission);
        await _unitOfWork.SaveChangesAsync();

        return new PermissionDto(permission.Id, permission.Name, permission.Description);
    }

    public async Task DeletePermissionAsync(Guid id)
    {
        var permission = await _permissionRepository.GetByIdAsync(id)
            ?? throw new NotFoundException(nameof(Permission), id);

        var assigned = await _rolePermissionRepository.ExistsAsync(rp => rp.PermissionId == id);
        if (assigned) throw new BadRequestException("Cannot delete permission assigned to one or more roles.");

        await _permissionRepository.DeleteAsync(permission.Id);
        await _unitOfWork.SaveChangesAsync();
    }
}
