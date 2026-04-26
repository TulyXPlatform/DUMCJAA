using System.Linq.Expressions;
using DUMCJAA.Domain.Common;
using DUMCJAA.Domain.Interfaces;
using DUMCJAA.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DUMCJAA.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbSet.FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default)
    {
        return await _dbSet.AsNoTracking().ToListAsync(ct);
    }

    public async Task<(IReadOnlyList<T> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize,
        Expression<Func<T, bool>>? filter = null,
        Expression<Func<T, object>>? orderBy = null,
        bool ascending = true,
        CancellationToken ct = default)
    {
        IQueryable<T> query = _dbSet.AsNoTracking();

        if (filter is not null)
            query = query.Where(filter);

        var totalCount = await query.CountAsync(ct);

        if (orderBy is not null)
            query = ascending ? query.OrderBy(orderBy) : query.OrderByDescending(orderBy);
        else
            query = query.OrderByDescending(x => x.CreatedAt);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<T> AddAsync(T entity, CancellationToken ct = default)
    {
        await _dbSet.AddAsync(entity, ct);
        return entity;
    }

    public Task UpdateAsync(T entity, CancellationToken ct = default)
    {
        _dbSet.Update(entity);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await GetByIdAsync(id, ct);
        if (entity is null) return;

        // Soft delete if entity supports it
        if (entity is ISoftDeletable softDeletable)
        {
            softDeletable.IsDeleted = true;
            _dbSet.Update(entity);
        }
        else
        {
            _dbSet.Remove(entity);
        }
    }

    public async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default)
    {
        return await _dbSet.AnyAsync(predicate, ct);
    }

    public IQueryable<T> GetWhere(Expression<Func<T, bool>> predicate)
    {
        return _dbSet.Where(predicate);
    }
}
