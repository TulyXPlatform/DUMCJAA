using DUMCJAA.Application.Common.Exceptions;
using DUMCJAA.Application.Features.Auth.DTOs;
using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace DUMCJAA.Application.Features.Auth;

public class AuthService : IAuthService
{
    private readonly IRepository<User> _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IRepository<User> userRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto, CancellationToken ct = default)
    {
        // Intentionally vague error — don't reveal whether email exists
        var (items, _) = await _userRepository.GetPagedAsync(
            1, 1, filter: u => u.Email == dto.Email, ct: ct);

        var user = items.FirstOrDefault();

        if (user is null || !_passwordHasher.Verify(dto.Password, user.PasswordHash))
        {
            _logger.LogWarning("Failed login attempt for {Email}", dto.Email);
            throw new UnauthorizedException("Invalid email or password.");
        }

        if (!user.IsActive)
        {
            _logger.LogWarning("Login attempt for deactivated account {Email}", dto.Email);
            throw new ForbiddenException("Account is deactivated. Contact an administrator.");
        }

        // Update last login timestamp
        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var (token, expiresAt) = _tokenService.GenerateToken(user);

        _logger.LogInformation("User {Email} logged in successfully", user.Email);

        return new AuthResponseDto(
            user.Id, user.Email, user.FullName, user.Role, token, expiresAt);
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto, CancellationToken ct = default)
    {
        // Check for duplicate email
        var exists = await _userRepository.ExistsAsync(u => u.Email == dto.Email, ct);
        if (exists)
            throw new ConflictException($"A user with email '{dto.Email}' already exists.");

        var role = dto.Role ?? Roles.Editor;
        if (!Roles.IsValid(role))
            throw new ValidationException([$"Invalid role '{role}'. Valid roles: {string.Join(", ", Roles.All)}"]);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email.ToLowerInvariant(),
            PasswordHash = _passwordHasher.Hash(dto.Password),
            FirstName = dto.FirstName.Trim(),
            LastName = dto.LastName.Trim(),
            Role = role,
            IsActive = true
        };

        await _userRepository.AddAsync(user, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var (token, expiresAt) = _tokenService.GenerateToken(user);

        _logger.LogInformation("New user registered: {Email} with role {Role}", user.Email, user.Role);

        return new AuthResponseDto(
            user.Id, user.Email, user.FullName, user.Role, token, expiresAt);
    }

    public async Task<UserDto> GetCurrentUserAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, ct)
            ?? throw new NotFoundException(nameof(User), userId);

        return new UserDto(
            user.Id, user.Email, user.FirstName, user.LastName,
            user.FullName, user.Role, user.IsActive, user.CreatedAt, user.LastLoginAt);
    }
}
