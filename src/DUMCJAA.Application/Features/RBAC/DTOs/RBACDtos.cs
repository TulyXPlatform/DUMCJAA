using System.ComponentModel.DataAnnotations;

namespace DUMCJAA.Application.Features.RBAC.DTOs;

public record RoleDto(Guid Id, string Name, string Description, DateTime CreatedAt);

public record PermissionDto(Guid Id, string Name, string Description);

public record CreateRoleDto(
    [Required] [StringLength(50)] string Name,
    [StringLength(200)] string Description
);

public record UpdateRoleDto(
    [Required] [StringLength(50)] string Name,
    [StringLength(200)] string Description
);

public record UserRoleAssignmentDto(
    [Required] List<Guid> RoleIds
);

public record RolePermissionAssignmentDto(
    [Required] List<Guid> PermissionIds
);

public record UserRolesResponseDto(
    Guid UserId,
    List<RoleDto> Roles
);

public record RolePermissionsResponseDto(
    Guid RoleId,
    List<PermissionDto> Permissions
);

public record CreatePermissionDto(
    [Required] [StringLength(100)] string Name,
    [StringLength(300)] string Description
);

public record UpdatePermissionDto(
    [Required] [StringLength(100)] string Name,
    [StringLength(300)] string Description
);
