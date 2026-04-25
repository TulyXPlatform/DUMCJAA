using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Interfaces;

public interface IOTPService
{
    Task<string> GenerateOTPAsync(Guid userId, OTPType type);
    Task<bool> VerifyOTPAsync(Guid userId, string code, OTPType type);
}
