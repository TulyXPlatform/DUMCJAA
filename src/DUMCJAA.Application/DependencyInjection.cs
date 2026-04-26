using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using DUMCJAA.Application.Features.Auth;
using DUMCJAA.Application.Features.Samples;
using DUMCJAA.Application.Features.Alumni;
using DUMCJAA.Application.Features.Events;
using DUMCJAA.Application.Features.Settings;
using DUMCJAA.Application.Features.RBAC;

namespace DUMCJAA.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Add Memory Cache for caching mechanisms inside the application layer
        services.AddMemoryCache();

        // Auto-register all validators in this assembly
        services.AddValidatorsFromAssemblyContaining<ISampleService>();

        // Feature services
        services.AddScoped<ISampleService, SampleService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAlumnusService, AlumnusService>();
        services.AddScoped<IEventService, EventService>();
        services.AddScoped<ISettingsService, SettingsService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IPermissionService, PermissionService>();

        return services;
    }
}
