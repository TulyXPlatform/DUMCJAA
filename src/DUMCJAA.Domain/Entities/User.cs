using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = Roles.Editor;
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }

    public string FullName => $"{FirstName} {LastName}".Trim();
}

/// <summary>
/// Centralized role constants — avoids magic strings in [Authorize] attributes and claims.
/// </summary>
public static class Roles
{
    public const string Admin = "Admin";
    public const string Editor = "Editor";

    public static readonly string[] All = [Admin, Editor];

    public static bool IsValid(string role) => All.Contains(role, StringComparer.OrdinalIgnoreCase);
}
