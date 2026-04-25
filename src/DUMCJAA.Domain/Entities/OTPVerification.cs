using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Entities;

public class OTPVerification : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string CodeHash { get; set; } = string.Empty; 
    public OTPType Type { get; set; } // EmailVerification or PasswordReset
    public DateTime ExpiryTime { get; set; }
    public bool IsUsed { get; set; }
    public int AttemptCount { get; set; }
}
