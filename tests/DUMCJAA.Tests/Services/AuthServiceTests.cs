using DUMCJAA.Application.Common.Exceptions;
using DUMCJAA.Application.Features.Auth;
using DUMCJAA.Application.Features.Auth.DTOs;
using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace DUMCJAA.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IRepository<User>> _userRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly Mock<IPasswordHasher> _passwordHasherMock;
    private readonly Mock<ILogger<AuthService>> _loggerMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _userRepositoryMock = new Mock<IRepository<User>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _tokenServiceMock = new Mock<ITokenService>();
        _passwordHasherMock = new Mock<IPasswordHasher>();
        _loggerMock = new Mock<ILogger<AuthService>>();

        _authService = new AuthService(
            _userRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _passwordHasherMock.Object,
            _tokenServiceMock.Object,
            _loggerMock.Object
        );
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsAuthResponseDto()
    {
        // Arrange
        var dto = new LoginDto("test@example.com", "Password123!");
        var user = new User 
        { 
            Id = Guid.NewGuid(), 
            Email = "test@example.com", 
            PasswordHash = "hashed_password",
            FirstName = "Test",
            LastName = "User",
            IsActive = true,
            Role = "User"
        };

        // We simulate finding a single user matching the email
        var userList = new List<User> { user };
        _userRepositoryMock
            .Setup(x => x.GetPagedAsync(1, 1, It.IsAny<System.Linq.Expressions.Expression<Func<User, bool>>>(), null, true, default))
            .ReturnsAsync((userList, 1));

        _passwordHasherMock
            .Setup(x => x.Verify(dto.Password, user.PasswordHash))
            .Returns(true);

        _tokenServiceMock
            .Setup(x => x.GenerateToken(user))
            .Returns(("valid_jwt_token", DateTime.UtcNow.AddHours(1)));

        // Act
        var result = await _authService.LoginAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Token.Should().Be("valid_jwt_token");
        result.Email.Should().Be(dto.Email);
        result.FullName.Should().Be("Test User");
    }

    [Fact]
    public async Task LoginAsync_WithInvalidPassword_ThrowsUnauthorizedException()
    {
        // Arrange
        var dto = new LoginDto("test@example.com", "WrongPassword!");
        var user = new User 
        { 
            Id = Guid.NewGuid(), 
            Email = "test@example.com", 
            PasswordHash = "hashed_password",
            IsActive = true
        };

        var userList = new List<User> { user };
        _userRepositoryMock
            .Setup(x => x.GetPagedAsync(1, 1, It.IsAny<System.Linq.Expressions.Expression<Func<User, bool>>>(), null, true, default))
            .ReturnsAsync((userList, 1));

        _passwordHasherMock
            .Setup(x => x.Verify(dto.Password, user.PasswordHash))
            .Returns(false); // Simulate incorrect password

        // Act
        Func<Task> action = async () => await _authService.LoginAsync(dto);

        // Assert
        await action.Should().ThrowAsync<UnauthorizedException>()
            .WithMessage("Invalid email or password.");
            
        // Security check: Ensure token is never generated if password fails
        _tokenServiceMock.Verify(x => x.GenerateToken(It.IsAny<User>()), Times.Never);
    }
    
    [Fact]
    public async Task LoginAsync_WithNonExistentUser_ThrowsUnauthorizedException()
    {
        // Arrange
        var dto = new LoginDto("nobody@example.com", "Password123!");

        // Simulate returning empty list
        var userList = new List<User>();
        _userRepositoryMock
            .Setup(x => x.GetPagedAsync(1, 1, It.IsAny<System.Linq.Expressions.Expression<Func<User, bool>>>(), null, true, default))
            .ReturnsAsync((userList, 0));

        // Act
        Func<Task> action = async () => await _authService.LoginAsync(dto);

        // Assert
        await action.Should().ThrowAsync<UnauthorizedException>()
            .WithMessage("Invalid email or password."); // Vague error to prevent enumeration
    }
}
