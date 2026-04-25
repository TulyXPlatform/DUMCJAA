using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public bool IsEmailVerified { get; set; }
    public DateTime? LastLoginAt { get; set; }

    public string FullName => $"{FirstName} {LastName}".Trim();

    // RBAC relationships
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    
    // OTP relationship
    public ICollection<OTPVerification> OTPVerifications { get; set; } = new List<OTPVerification>();
}

