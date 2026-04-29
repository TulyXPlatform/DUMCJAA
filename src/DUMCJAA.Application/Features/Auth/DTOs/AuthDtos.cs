namespace DUMCJAA.Application.Features.Auth.DTOs;

public record LoginDto(
    string Identifier, // Can be Email, Phone, or Username
    string Password
);

public record RegisterDto(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? Phone = null,
    string? Username = null,
    string? StudentId = null,
    string? Role = null
);

public record AuthResponseDto(
    Guid UserId,
    string Email,
    string FullName,
    IEnumerable<string> Roles,
    IEnumerable<string> Permissions,
    string Token,
    DateTime ExpiresAt
);

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string FullName,
    IEnumerable<string> Roles,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? LastLoginAt
);

public record RequestOTPDto(string Email);

public record VerifyOTPDto(string Email, string Code);

public record VerifyEmailOtpDto(string Email, string Otp);

public record ChangePasswordDto(
    string Email,
    string Code, // The OTP verified previously
    string NewPassword
);
