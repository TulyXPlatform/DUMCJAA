using DUMCJAA.Application.Features.RBAC.DTOs;

namespace DUMCJAA.Application.Features.RBAC;

public interface IRoleService
{
    Task<List<RoleDto>> GetRolesAsync();
    Task<RoleDto> GetRoleByIdAsync(Guid id);
    Task<RoleDto> CreateRoleAsync(CreateRoleDto dto);
    Task<RoleDto> UpdateRoleAsync(Guid id, UpdateRoleDto dto);
    Task DeleteRoleAsync(Guid id);

    Task<List<PermissionDto>> GetRolePermissionsAsync(Guid roleId);
    Task UpdateRolePermissionsAsync(Guid roleId, RolePermissionAssignmentDto dto);

    Task<List<RoleDto>> GetUserRolesAsync(Guid userId);
    Task UpdateUserRolesAsync(Guid userId, UserRoleAssignmentDto dto);
    Task<List<string>> GetUserPermissionsAsync(Guid userId);
}

public interface IPermissionService
{
    Task<List<PermissionDto>> GetAllPermissionsAsync();
}
