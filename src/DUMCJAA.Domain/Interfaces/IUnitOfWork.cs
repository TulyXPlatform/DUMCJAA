namespace DUMCJAA.Domain.Interfaces;

/// <summary>
/// Unit of Work — coordinates transactional saves across multiple repositories.
/// </summary>
public interface IUnitOfWork : IDisposable
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
