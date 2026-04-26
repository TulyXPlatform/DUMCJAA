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
        var connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
        
        // Failsafe: Strip out Azure AD auth if accidentally pasted into Render
        if (connectionString.Contains("Authentication=ActiveDirectoryDefault;", StringComparison.OrdinalIgnoreCase))
        {
            connectionString = connectionString.Replace("Authentication=ActiveDirectoryDefault;", "", StringComparison.OrdinalIgnoreCase);
        }
        if (connectionString.Contains("Authentication=\"Active Directory Default\";", StringComparison.OrdinalIgnoreCase))
        {
            connectionString = connectionString.Replace("Authentication=\"Active Directory Default\";", "", StringComparison.OrdinalIgnoreCase);
        }
        if (connectionString.Contains("Authentication=Active Directory Default;", StringComparison.OrdinalIgnoreCase))
        {
            connectionString = connectionString.Replace("Authentication=Active Directory Default;", "", StringComparison.OrdinalIgnoreCase);
        }

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(
                connectionString,
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        
        services.AddScoped<IPasswordHasher, DUMCJAA.Infrastructure.Auth.PasswordHasher>();
        services.AddScoped<ITokenService, DUMCJAA.Infrastructure.Auth.TokenService>();
        
        // Email System (Pluggable)
        services.Configure<DUMCJAA.Infrastructure.Email.EmailSettings>(configuration.GetSection("Email"));
        services.AddScoped<DUMCJAA.Infrastructure.Email.IEmailProvider, DUMCJAA.Infrastructure.Email.GmailSmtpProvider>();
        services.AddScoped<IEmailService, DUMCJAA.Infrastructure.Email.EmailService>();
        
        services.AddScoped<IOTPService, DUMCJAA.Infrastructure.Services.OTPService>();

        services.AddSingleton<DUMCJAA.Application.Features.Files.IFileService, DUMCJAA.Infrastructure.Services.LocalFileService>();

        return services;
    }
}
