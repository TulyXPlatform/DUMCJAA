using DUMCJAA.Application.Common.Exceptions;
using DUMCJAA.Application.Features.Auth.DTOs;
using DUMCJAA.Domain.Common;
using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace DUMCJAA.Application.Features.Auth;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IRepository<Role> _roleRepository;
    private readonly IRepository<UserRole> _userRoleRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IOTPService _otpService;
    private readonly IEmailService _emailService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepository,
        IRepository<Role> roleRepository,
        IRepository<UserRole> userRoleRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IOTPService otpService,
        IEmailService emailService,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _userRoleRepository = userRoleRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _otpService = otpService;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByEmailWithSecurityAsync(dto.Email, ct);

        if (user is null || !_passwordHasher.Verify(dto.Password, user.PasswordHash))
        {
            _logger.LogWarning("Failed login attempt for {Email}", dto.Email);
            throw new UnauthorizedException("Invalid email or password.");
        }

        if (!user.IsActive)
            throw new ForbiddenException("Account is deactivated.");

        if (!user.IsEmailVerified)
            throw new ForbiddenException("Email not verified. Please verify your email to login.");

        var permissions = await _userRepository.GetUserPermissionsAsync(user.Id, ct);
        var (token, expiresAt) = _tokenService.GenerateToken(user, permissions);

        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return new AuthResponseDto(
            user.Id, 
            user.Email, 
            user.FullName, 
            user.UserRoles.Select(ur => ur.Role.Name),
            permissions,
            token, 
            expiresAt);
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto, CancellationToken ct = default)
    {
        if (await _userRepository.ExistsAsync(u => u.Email == dto.Email, ct))
            throw new ConflictException("Email already exists.");

        var user = new User
        {
            Email = dto.Email.ToLowerInvariant(),
            PasswordHash = _passwordHasher.Hash(dto.Password),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            IsActive = true,
            IsEmailVerified = false
        };

        await _userRepository.AddAsync(user, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var roleName = string.IsNullOrWhiteSpace(dto.Role) ? Roles.Editor : dto.Role;
        var role = (await _roleRepository.GetPagedAsync(1, 1, r => r.Name == roleName, ct: ct)).Items.FirstOrDefault()
            ?? throw new NotFoundException(nameof(Role), roleName);

        await _userRoleRepository.AddAsync(new UserRole
        {
            UserId = user.Id,
            RoleId = role.Id
        }, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        // Generate and send Email Verification OTP
        var otp = await _otpService.GenerateOTPAsync(user.Id, OTPType.EmailVerification);
        await _emailService.SendAsync(new EmailMessage
        {
            To = user.Email,
            Subject = "Verify Your Email",
            HtmlBody = $"Welcome! Your verification code is: <strong>{otp}</strong>. It expires in 5 minutes."
        });

        // We don't return a token yet because they need to verify first
        return new AuthResponseDto(
            user.Id, user.Email, user.FullName, new List<string>(), new List<string>(), string.Empty, DateTime.MinValue);
    }

    public async Task<UserDto> GetCurrentUserAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByIdWithSecurityAsync(userId, ct)
            ?? throw new NotFoundException(nameof(User), userId);

        return new UserDto(
            user.Id, user.Email, user.FirstName, user.LastName, user.FullName,
            user.UserRoles.Select(ur => ur.Role.Name),
            user.IsActive, user.CreatedAt, user.LastLoginAt);
    }

    public async Task RequestPasswordChangeOTPAsync(RequestOTPDto dto, CancellationToken ct = default)
    {
        var (items, _) = await _userRepository.GetPagedAsync(1, 1, u => u.Email == dto.Email, ct: ct);
        var user = items.FirstOrDefault();

        if (user == null) return; 

        var otp = await _otpService.GenerateOTPAsync(user.Id, OTPType.PasswordReset);
        
        await _emailService.SendAsync(new EmailMessage
        {
            To = user.Email,
            Subject = "Password Change Verification",
            HtmlBody = $"Your verification code is: <strong>{otp}</strong>. It expires in 5 minutes."
        });
    }

    public async Task<bool> VerifyOTPAsync(VerifyOTPDto dto, CancellationToken ct = default)
    {
        var (items, _) = await _userRepository.GetPagedAsync(1, 1, u => u.Email == dto.Email, ct: ct);
        var user = items.FirstOrDefault();
        
        if (user == null) return false;

        return await _otpService.VerifyOTPAsync(user.Id, dto.Code, OTPType.PasswordReset);
    }

    public async Task ChangePasswordAsync(ChangePasswordDto dto, CancellationToken ct = default)
    {
        var (items, _) = await _userRepository.GetPagedAsync(1, 1, u => u.Email == dto.Email, ct: ct);
        var user = items.FirstOrDefault();

        if (user == null) throw new UnauthorizedException("Invalid request.");

        var isValid = await _otpService.VerifyOTPAsync(user.Id, dto.Code, OTPType.PasswordReset);
        if (!isValid) throw new UnauthorizedException("Invalid or expired code.");

        user.PasswordHash = _passwordHasher.Hash(dto.NewPassword);
        await _userRepository.UpdateAsync(user, ct);
        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task<AuthResponseDto> VerifyEmailAsync(VerifyOTPDto dto, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByEmailWithSecurityAsync(dto.Email, ct)
            ?? throw new NotFoundException(nameof(User), dto.Email);

        if (!user.IsEmailVerified)
        {
            var isValid = await _otpService.VerifyOTPAsync(user.Id, dto.Code, OTPType.EmailVerification);
            if (!isValid) throw new UnauthorizedException("Invalid or expired verification code.");

            user.IsEmailVerified = true;
        }

        if (!user.IsActive)
            throw new ForbiddenException("Account is deactivated.");

        var permissions = await _userRepository.GetUserPermissionsAsync(user.Id, ct);
        var (token, expiresAt) = _tokenService.GenerateToken(user, permissions);
        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        
        _logger.LogInformation("Email verified successfully for {Email}", dto.Email);

        return new AuthResponseDto(
            user.Id,
            user.Email,
            user.FullName,
            user.UserRoles.Select(ur => ur.Role.Name),
            permissions,
            token,
            expiresAt
        );
    }

    public async Task RequestEmailVerificationOTPAsync(RequestOTPDto dto, CancellationToken ct = default)
    {
        var (items, _) = await _userRepository.GetPagedAsync(1, 1, u => u.Email == dto.Email, ct: ct);
        var user = items.FirstOrDefault();

        if (user == null || user.IsEmailVerified) return;

        var otp = await _otpService.GenerateOTPAsync(user.Id, OTPType.EmailVerification);
        await _emailService.SendAsync(new EmailMessage
        {
            To = user.Email,
            Subject = "Email Verification Code",
            HtmlBody = $"Your verification code is: <strong>{otp}</strong>. It expires in 5 minutes."
        });
    }
}
