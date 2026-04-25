using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Entities;

public class Permission : BaseEntity
{
    public string Name { get; set; } = string.Empty; // e.g., "alumni.read", "users.manage"
    public string Description { get; set; } = string.Empty;

    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
