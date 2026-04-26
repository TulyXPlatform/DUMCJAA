using System.Linq.Expressions;
using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Interfaces;

/// <summary>
/// Generic repository contract — lives in Domain so Application can depend on it
/// without knowing the infrastructure implementation.
/// </summary>
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default);
    Task<(IReadOnlyList<T> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize,
        Expression<Func<T, bool>>? filter = null,
        Expression<Func<T, object>>? orderBy = null,
        bool ascending = true,
        CancellationToken ct = default);
    Task<T> AddAsync(T entity, CancellationToken ct = default);
    Task UpdateAsync(T entity, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    IQueryable<T> GetWhere(Expression<Func<T, bool>> predicate);
}
