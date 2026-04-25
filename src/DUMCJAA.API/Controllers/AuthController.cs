using System.Security.Claims;
using DUMCJAA.Application.Common;
using DUMCJAA.Application.Features.Auth;
using DUMCJAA.Application.Features.Auth.DTOs;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DUMCJAA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IValidator<LoginDto> _loginValidator;
    private readonly IValidator<RegisterDto> _registerValidator;

    public AuthController(
        IAuthService authService,
        IValidator<LoginDto> loginValidator,
        IValidator<RegisterDto> registerValidator)
    {
        _authService = authService;
        _loginValidator = loginValidator;
        _registerValidator = registerValidator;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginDto dto, CancellationToken ct)
    {
        var validationResult = await _loginValidator.ValidateAsync(dto, ct);
        if (!validationResult.IsValid)
            throw new Application.Common.Exceptions.ValidationException(
                validationResult.Errors.Select(e => e.ErrorMessage).ToList());

        var result = await _authService.LoginAsync(dto, ct);
        return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result, "Logged in successfully."));
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto, CancellationToken ct)
    {
        var validationResult = await _registerValidator.ValidateAsync(dto, ct);
        if (!validationResult.IsValid)
            throw new Application.Common.Exceptions.ValidationException(
                validationResult.Errors.Select(e => e.ErrorMessage).ToList());

        var result = await _authService.RegisterAsync(dto, ct);
        return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result, "Registered successfully. Please verify your email."));
    }

    [HttpPost("verify-email")]
    [AllowAnonymous]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyOTPDto dto, CancellationToken ct)
    {
        await _authService.VerifyEmailAsync(dto, ct);
        return Ok(ApiResponse<object>.SuccessResponse(null, "Email verified successfully. You can now login."));
    }

    [HttpPost("request-email-verification-otp")]
    [AllowAnonymous]
    public async Task<IActionResult> RequestEmailVerificationOTP([FromBody] RequestOTPDto dto, CancellationToken ct)
    {
        await _authService.RequestEmailVerificationOTPAsync(dto, ct);
        return Ok(ApiResponse<object>.SuccessResponse(null, "A new verification code has been sent."));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser(CancellationToken ct)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid token claims.", 401));

        var result = await _authService.GetCurrentUserAsync(userId, ct);
        return Ok(ApiResponse<UserDto>.SuccessResponse(result));
    }

    [HttpPost("request-password-change-otp")]
    [AllowAnonymous]
    public async Task<IActionResult> RequestOTP([FromBody] RequestOTPDto dto, CancellationToken ct)
    {
        await _authService.RequestPasswordChangeOTPAsync(dto, ct);
        return Ok(ApiResponse<object>.SuccessResponse(null, "If an account exists, a verification code has been sent."));
    }

    [HttpPost("verify-otp")]
    [AllowAnonymous]
    public async Task<IActionResult> VerifyOTP([FromBody] VerifyOTPDto dto, CancellationToken ct)
    {
        var isValid = await _authService.VerifyOTPAsync(dto, ct);
        if (!isValid) return BadRequest(ApiResponse<object>.ErrorResponse("Invalid or expired code.", 400));
        
        return Ok(ApiResponse<object>.SuccessResponse(null, "Code verified successfully."));
    }

    [HttpPost("change-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto, CancellationToken ct)
    {
        await _authService.ChangePasswordAsync(dto, ct);
        return Ok(ApiResponse<object>.SuccessResponse(null, "Password changed successfully."));
    }
}
