using DUMCJAA.Domain.Entities;

namespace DUMCJAA.Domain.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailWithSecurityAsync(string email, CancellationToken ct = default);
    Task<User?> GetByIdWithSecurityAsync(Guid id, CancellationToken ct = default);
    Task<List<string>> GetUserPermissionsAsync(Guid userId, CancellationToken ct = default);
}
