using DUMCJAA.Application.Common.Exceptions;
using DUMCJAA.Application.Features.RBAC.DTOs;
using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DUMCJAA.Application.Features.RBAC;

public class RoleService : IRoleService
{
    private readonly IRepository<Role> _roleRepository;
    private readonly IRepository<Permission> _permissionRepository;
    private readonly IRepository<UserRole> _userRoleRepository;
    private readonly IRepository<RolePermission> _rolePermissionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RoleService> _logger;

    public RoleService(
        IRepository<Role> roleRepository,
        IRepository<Permission> permissionRepository,
        IRepository<UserRole> userRoleRepository,
        IRepository<RolePermission> rolePermissionRepository,
        IUnitOfWork unitOfWork,
        ILogger<RoleService> logger)
    {
        _roleRepository = roleRepository;
        _permissionRepository = permissionRepository;
        _userRoleRepository = userRoleRepository;
        _rolePermissionRepository = rolePermissionRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<List<RoleDto>> GetRolesAsync()
    {
        var roles = await _roleRepository.GetAllAsync();
        return roles.Select(r => new RoleDto(r.Id, r.Name, r.Description, r.CreatedAt)).ToList();
    }

    public async Task<RoleDto> GetRoleByIdAsync(Guid id)
    {
        var role = await _roleRepository.GetByIdAsync(id) 
            ?? throw new NotFoundException(nameof(Role), id);
        return new RoleDto(role.Id, role.Name, role.Description, role.CreatedAt);
    }

    public async Task<RoleDto> CreateRoleAsync(CreateRoleDto dto)
    {
        var exists = await _roleRepository.ExistsAsync(r => r.Name == dto.Name);
        if (exists) throw new ConflictException($"Role with name '{dto.Name}' already exists.");

        var role = new Role { Id = Guid.NewGuid(), Name = dto.Name, Description = dto.Description };
        await _roleRepository.AddAsync(role);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Role created: {RoleName}", role.Name);
        return new RoleDto(role.Id, role.Name, role.Description, role.CreatedAt);
    }

    public async Task<RoleDto> UpdateRoleAsync(Guid id, UpdateRoleDto dto)
    {
        var role = await _roleRepository.GetByIdAsync(id) 
            ?? throw new NotFoundException(nameof(Role), id);

        var exists = await _roleRepository.ExistsAsync(r => r.Name == dto.Name && r.Id != id);
        if (exists) throw new ConflictException($"Role with name '{dto.Name}' already exists.");

        role.Name = dto.Name;
        role.Description = dto.Description;
        role.UpdatedAt = DateTime.UtcNow;

        await _roleRepository.UpdateAsync(role);
        await _unitOfWork.SaveChangesAsync();

        return new RoleDto(role.Id, role.Name, role.Description, role.CreatedAt);
    }

    public async Task DeleteRoleAsync(Guid id)
    {
        var role = await _roleRepository.GetByIdAsync(id) 
            ?? throw new NotFoundException(nameof(Role), id);

        // Prevent deleting roles in use
        var inUse = await _userRoleRepository.ExistsAsync(ur => ur.RoleId == id);
        if (inUse) throw new BadRequestException("Cannot delete role because it is assigned to users.");

        await _roleRepository.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation("Role deleted: {RoleId}", id);
    }

    public async Task<List<PermissionDto>> GetRolePermissionsAsync(Guid roleId)
    {
        var rolePermissions = await _rolePermissionRepository.GetWhere(rp => rp.RoleId == roleId)
            .Include(rp => rp.Permission)
            .ToListAsync();

        return rolePermissions.Select(rp => new PermissionDto(rp.Permission.Id, rp.Permission.Name, rp.Permission.Description)).ToList();
    }

    public async Task UpdateRolePermissionsAsync(Guid roleId, RolePermissionAssignmentDto dto)
    {
        var role = await _roleRepository.GetByIdAsync(roleId) 
            ?? throw new NotFoundException(nameof(Role), roleId);

        // Validate permissions exist
        var permissionsCount = await _permissionRepository.GetWhere(p => dto.PermissionIds.Contains(p.Id)).CountAsync();
        if (permissionsCount != dto.PermissionIds.Count)
            throw new BadRequestException("One or more permission IDs are invalid.");

        // Replace full set
        var existing = await _rolePermissionRepository.GetWhere(rp => rp.RoleId == roleId).ToListAsync();
        foreach (var rp in existing) await _rolePermissionRepository.DeleteAsync(rp.Id);

        foreach (var pId in dto.PermissionIds)
        {
            await _rolePermissionRepository.AddAsync(new RolePermission { RoleId = roleId, PermissionId = pId });
        }

        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation("Permissions updated for role: {RoleName}", role.Name);
    }

    public async Task<List<RoleDto>> GetUserRolesAsync(Guid userId)
    {
        var userRoles = await _userRoleRepository.GetWhere(ur => ur.UserId == userId)
            .Include(ur => ur.Role)
            .ToListAsync();

        return userRoles.Select(ur => new RoleDto(ur.Role.Id, ur.Role.Name, ur.Role.Description, ur.Role.CreatedAt)).ToList();
    }

    public async Task UpdateUserRolesAsync(Guid userId, UserRoleAssignmentDto dto)
    {
        // Replace full set
        var existing = await _userRoleRepository.GetWhere(ur => ur.UserId == userId).ToListAsync();
        foreach (var ur in existing) await _userRoleRepository.DeleteAsync(ur.Id);

        foreach (var rId in dto.RoleIds)
        {
            await _userRoleRepository.AddAsync(new UserRole { UserId = userId, RoleId = rId });
        }

        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation("Roles updated for user: {UserId}", userId);
    }

    public async Task<List<string>> GetUserPermissionsAsync(Guid userId)
    {
        var permissions = await _userRoleRepository.GetWhere(ur => ur.UserId == userId)
            .SelectMany(ur => ur.Role.RolePermissions)
            .Select(rp => rp.Permission.Name)
            .Distinct()
            .ToListAsync();

        return permissions;
    }
}
