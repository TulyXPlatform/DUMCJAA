using DUMCJAA.Domain.Common;
using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DUMCJAA.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context, IPasswordHasher passwordHasher)
    {
        // 1. Seed Permissions
        var allPermissionNames = Permissions.All;
        var existingPermissions = await context.Permissions.ToListAsync();
        
        foreach (var pName in allPermissionNames)
        {
            if (!existingPermissions.Any(x => x.Name == pName))
            {
                context.Permissions.Add(new Permission { Name = pName, Description = $"Permission to {pName}" });
            }
        }
        await context.SaveChangesAsync();

        // 2. Seed Default Roles
        var rolesToSeed = new List<(string Name, string Description)>
        {
            (Roles.SuperAdmin, "Administrator with full access to everything"),
            (Roles.Admin, "Administrator with high-level management access"),
            (Roles.Editor, "Editor who can manage content like alumni and events")
        };

        foreach (var r in rolesToSeed)
        {
            if (!await context.Roles.AnyAsync(x => x.Name == r.Name))
            {
                context.Roles.Add(new Role { Name = r.Name, Description = r.Description });
            }
        }
        await context.SaveChangesAsync();

        // 3. Assign Permissions to Roles
        var superAdminRole = await context.Roles.FirstAsync(r => r.Name == Roles.SuperAdmin);
        var adminRole = await context.Roles.FirstAsync(r => r.Name == Roles.Admin);
        var editorRole = await context.Roles.FirstAsync(r => r.Name == Roles.Editor);

        var allPermissionsFromDb = await context.Permissions.ToListAsync();

        // SuperAdmin gets ALL permissions
        foreach (var p in allPermissionsFromDb)
        {
            if (!await context.RolePermissions.AnyAsync(rp => rp.RoleId == superAdminRole.Id && rp.PermissionId == p.Id))
            {
                context.RolePermissions.Add(new RolePermission { RoleId = superAdminRole.Id, PermissionId = p.Id });
            }
        }

        // Admin gets most but maybe not users.manage? No, user requested Admin can manage.
        // For now, let's give Admin everything except maybe sensitive ones if defined later.
        foreach (var p in allPermissionsFromDb)
        {
            if (p.Name != Permissions.UsersManage) 
            {
                if (!await context.RolePermissions.AnyAsync(rp => rp.RoleId == adminRole.Id && rp.PermissionId == p.Id))
                {
                    context.RolePermissions.Add(new RolePermission { RoleId = adminRole.Id, PermissionId = p.Id });
                }
            }
        }

        // Editor gets read/create/update but not delete and not system management
        var editorPermissions = new[] { 
            Permissions.AlumniRead, Permissions.AlumniCreate, Permissions.AlumniUpdate, 
            Permissions.EventsRegister,
            Permissions.PublicationsRead, Permissions.PublicationsManage,
            Permissions.CareerRead,
            Permissions.BlogRead, Permissions.BlogManage
        };
        foreach (var pName in editorPermissions)
        {
            var p = allPermissionsFromDb.FirstOrDefault(x => x.Name == pName);
            if (p != null && !await context.RolePermissions.AnyAsync(rp => rp.RoleId == editorRole.Id && rp.PermissionId == p.Id))
            {
                context.RolePermissions.Add(new RolePermission { RoleId = editorRole.Id, PermissionId = p.Id });
            }
        }
        await context.SaveChangesAsync();

        // 4. Seed SuperAdmin User
        if (!await context.Users.AnyAsync(u => u.Email == "admin@dumcjaa.com"))
        {
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                Email = "admin@dumcjaa.com",
                Phone = "1234567890",
                Username = "admin",
                PasswordHash = passwordHasher.Hash("Admin@123"),
                FirstName = "Super",
                LastName = "Admin",
                IsActive = true,
                IsEmailVerified = true
            };

            context.Users.Add(adminUser);
            await context.SaveChangesAsync();

            context.UserRoles.Add(new UserRole { UserId = adminUser.Id, RoleId = superAdminRole.Id });
            await context.SaveChangesAsync();
        }

        // 5. Seed Alumni
        if (!await context.Alumni.AnyAsync())
        {
            context.Alumni.AddRange(new List<Alumnus>
            {
                new Alumnus 
                { 
                    FirstName = "Mahmud", 
                    LastName = "Hasan", 
                    Email = "mahmud@example.com", 
                    StudentId = "CS-2018-001",
                    Phone = "01711111111",
                    Batch = "2018", 
                    Department = "Computer Science", 
                    CurrentCompany = "Tech Corp", 
                    CurrentDesignation = "Software Engineer",
                    IsApproved = true
                },
                new Alumnus 
                { 
                    FirstName = "Tuhin", 
                    LastName = "Ahmad", 
                    Email = "tuhin@example.com", 
                    StudentId = "SE-2019-042",
                    Phone = "01722222222",
                    Batch = "2019", 
                    Department = "Software Engineering", 
                    CurrentCompany = "Innovate Ltd", 
                    CurrentDesignation = "Product Manager",
                    IsApproved = true
                }
            });
            await context.SaveChangesAsync();
        }

        // 6. Seed Events
        if (!await context.Events.AnyAsync())
        {
            context.Events.AddRange(new List<Event>
            {
                new Event 
                { 
                    Title = "Annual Alumni Meetup 2026", 
                    Description = "Join us for our grand annual reunion!", 
                    EventDate = DateTime.Now.AddMonths(1), 
                    Location = "University Grand Hall" 
                },
                new Event 
                { 
                    Title = "Tech Career Workshop", 
                    Description = "A workshop on modern software development trends.", 
                    EventDate = DateTime.Now.AddDays(15), 
                    Location = "Auditorium 1" 
                }
            });
            await context.SaveChangesAsync();
        }
    }
}
