using DUMCJAA.Domain.Interfaces;
using DUMCJAA.Infrastructure.Persistence;
using DUMCJAA.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DUMCJAA.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddSingleton<IPasswordHasher, DUMCJAA.Infrastructure.Auth.PasswordHasher>();
        services.AddSingleton<ITokenService, DUMCJAA.Infrastructure.Auth.TokenService>();
        services.AddSingleton<DUMCJAA.Application.Features.Files.IFileService, DUMCJAA.Infrastructure.Services.LocalFileService>();

        return services;
    }
}
