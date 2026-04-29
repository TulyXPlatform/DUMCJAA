using DUMCJAA.Application.Common;
using DUMCJAA.Application.Features.Auth.DTOs;
using DUMCJAA.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DUMCJAA.Application.Features.Users;

public interface IUserService
{
    Task<List<UserDto>> GetAllUsersAsync(CancellationToken ct = default);
}

public class UserService : IUserService
{
    private readonly IRepository<DUMCJAA.Domain.Entities.User> _userRepository;

    public UserService(IRepository<DUMCJAA.Domain.Entities.User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<UserDto>> GetAllUsersAsync(CancellationToken ct = default)
    {
        var users = await _userRepository.GetAllAsync(ct);
        return users.Select(u => new UserDto(
            u.Id,
            u.Email,
            u.FirstName,
            u.LastName,
            u.FullName,
            new List<string>(), // Roles would require Include() which repo might handle or we add here if using IQueryable
            u.IsActive,
            u.CreatedAt,
            null // LastLoginAt
        )).ToList();
    }
}
