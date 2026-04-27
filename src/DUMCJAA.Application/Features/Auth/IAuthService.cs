using DUMCJAA.Application.Features.Auth.DTOs;

namespace DUMCJAA.Application.Features.Auth;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto dto, CancellationToken ct = default);
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto, CancellationToken ct = default);
    Task<UserDto> GetCurrentUserAsync(Guid userId, CancellationToken ct = default);
    Task RequestPasswordChangeOTPAsync(RequestOTPDto dto, CancellationToken ct = default);
    Task<bool> VerifyOTPAsync(VerifyOTPDto dto, CancellationToken ct = default);
    Task ChangePasswordAsync(ChangePasswordDto dto, CancellationToken ct = default);
    Task<AuthResponseDto> VerifyEmailAsync(VerifyOTPDto dto, CancellationToken ct = default);
    Task RequestEmailVerificationOTPAsync(RequestOTPDto dto, CancellationToken ct = default);
}
