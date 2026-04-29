using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;
using DUMCJAA.Infrastructure.Persistence;
using DUMCJAA.Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace DUMCJAA.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailWithSecurityAsync(string email, CancellationToken ct = default)
    {
        return await _dbSet
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Email == email, ct);
    }

    public async Task<User?> GetByIdWithSecurityAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbSet
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == id, ct);
    }

    public async Task<User?> GetByLoginIdentifierAsync(string identifier, CancellationToken ct = default)
    {
        return await _dbSet
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Email == identifier || u.Phone == identifier || u.Username == identifier, ct);
    }

    public async Task<List<string>> GetUserPermissionsAsync(Guid userId, CancellationToken ct = default)
    {
        return await _context.UserRoles
            .Where(ur => ur.UserId == userId)
            .SelectMany(ur => ur.Role.RolePermissions)
            .Select(rp => rp.Permission.Name)
            .Distinct()
            .ToListAsync(ct);
    }

    public async Task<List<string>> GetAdminEmailsAsync(CancellationToken ct = default)
    {
        return await _context.UserRoles
            .Where(ur => ur.Role.Name == Roles.Admin || ur.Role.Name == Roles.SuperAdmin)
            .Select(ur => ur.User.Email)
            .Distinct()
            .ToListAsync(ct);
    }
}
