using DUMCJAA.Domain.Common;
using DUMCJAA.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DUMCJAA.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<SampleEntity> Samples => Set<SampleEntity>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<OTPVerification> OTPVerifications => Set<OTPVerification>();
    public DbSet<Alumnus> Alumni => Set<Alumnus>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<EventRegistration> EventRegistrations => Set<EventRegistration>();
    public DbSet<Setting> Settings => Set<Setting>();
    public DbSet<Publication> Publications => Set<Publication>();
    public DbSet<JobPost> JobPosts => Set<JobPost>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<ContactInquiry> ContactInquiries => Set<ContactInquiry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply global soft-delete filter to all ISoftDeletable entities
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(ISoftDeletable).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType)
                    .HasQueryFilter(GenerateSoftDeleteFilter(entityType.ClrType));
            }
        }

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Auto-set audit fields on save
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    /// Builds expression: entity => !((ISoftDeletable)entity).IsDeleted
    private static System.Linq.Expressions.LambdaExpression GenerateSoftDeleteFilter(Type type)
    {
        var parameter = System.Linq.Expressions.Expression.Parameter(type, "e");
        var property = System.Linq.Expressions.Expression.Property(parameter, nameof(ISoftDeletable.IsDeleted));
        var condition = System.Linq.Expressions.Expression.Equal(property, System.Linq.Expressions.Expression.Constant(false));
        return System.Linq.Expressions.Expression.Lambda(condition, parameter);
    }
}
