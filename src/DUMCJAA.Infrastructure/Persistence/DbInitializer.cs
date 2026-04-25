using DUMCJAA.Domain.Common;
using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DUMCJAA.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context, IPasswordHasher passwordHasher)
    {
        // 1. Ensure DB is created
        await context.Database.EnsureCreatedAsync();

        // 2. Seed Permissions
        var allPermissions = Permissions.All;
        var existingPermissions = await context.Permissions.ToListAsync();
        
        foreach (var pName in allPermissions)
        {
            if (!existingPermissions.Any(x => x.Name == pName))
            {
                context.Permissions.Add(new Permission { Name = pName, Description = $"Permission to {pName}" });
            }
        }
        await context.SaveChangesAsync();

        // 3. Seed Roles
        var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
        if (adminRole == null)
        {
            adminRole = new Role { Name = "Admin", Description = "Administrator with full access" };
            context.Roles.Add(adminRole);
            await context.SaveChangesAsync();
            
            // Assign ALL permissions to Admin
            var permissions = await context.Permissions.ToListAsync();
            foreach (var p in permissions)
            {
                context.RolePermissions.Add(new RolePermission { RoleId = adminRole.Id, PermissionId = p.Id });
            }
            await context.SaveChangesAsync();
        }

        // 4. Seed SuperAdmin User
        if (!await context.Users.AnyAsync(u => u.Email == "admin@dumcjaa.com"))
        {
            var adminUser = new User
            {
                Email = "admin@dumcjaa.com",
                PasswordHash = passwordHasher.HashPassword("Admin@123"),
                FirstName = "Super",
                LastName = "Admin",
                IsActive = true,
                IsEmailVerified = true
            };

            context.Users.Add(adminUser);
            await context.SaveChangesAsync();

            context.UserRoles.Add(new UserRole { UserId = adminUser.Id, RoleId = adminRole.Id });
            await context.SaveChangesAsync();
        }
    }
}
