using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using DUMCJAA.API.Middleware;
using DUMCJAA.API.Extensions;
using DUMCJAA.Application;
using DUMCJAA.Infrastructure;
using Serilog;

// ── Bootstrap Serilog ──
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day, retainedFileCountLimit: 30)
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting DUMCJAA API");

    var builder = WebApplication.CreateBuilder(args);

    // ── Serilog ──
    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day, retainedFileCountLimit: 30));

    // ── Layer DI registration ──
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);

    // ── API Services Extensions ──
    builder.Services.AddSwaggerDocumentation();
    builder.Services.AddJwtAuthentication(builder.Configuration);
    
    // RBAC dynamic policy registration
    builder.Services.AddSingleton<Microsoft.AspNetCore.Authorization.IAuthorizationPolicyProvider, DUMCJAA.Infrastructure.Auth.PermissionPolicyProvider>();
    builder.Services.AddScoped<Microsoft.AspNetCore.Authorization.IAuthorizationHandler, DUMCJAA.Infrastructure.Auth.PermissionAuthorizationHandler>();
    builder.Services.AddAuthorization();

    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
        });

    builder.Services.AddEndpointsApiExplorer();

    // ── CORS ──
    var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            if (builder.Environment.IsDevelopment())
            {
                policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
            }
            else
            {
                policy.WithOrigins(allowedOrigins)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            }
        });
    });

    // ── Middleware ──
    var app = builder.Build();

    // Bind Render/containers port explicitly when provided
    var portValue = Environment.GetEnvironmentVariable("PORT");
    if (int.TryParse(portValue, out var port))
    {
        app.Urls.Add($"http://0.0.0.0:{port}");
        Log.Information("Listening on port {Port}", port);
    }

    // Database bootstrap: block in development for fast feedback, async in production for fast port binding
    if (app.Environment.IsDevelopment())
    {
        await InitializeDatabaseAsync(app.Services);
    }
    else
    {
        _ = Task.Run(async () =>
        {
            try
            {
                await InitializeDatabaseAsync(app.Services);
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Database initialization failed in background task.");
            }
        });
    }

    app.UseMiddleware<GlobalExceptionMiddleware>();
    app.UseSerilogRequestLogging();

    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "DUMCJAA API v1"));

    app.UseRouting();
    app.UseCors("AllowFrontend");

    if (!app.Environment.IsDevelopment())
    {
        app.UseHttpsRedirection();
    }

    app.UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    });

    app.UseDefaultFiles();
    app.UseStaticFiles();
    
    app.UseAuthentication();
    app.UseAuthorization();
    
    app.MapControllers();

    // Health checks
    app.MapGet("/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }));
    app.MapGet("/health/db", async (DUMCJAA.Infrastructure.Persistence.ApplicationDbContext db, CancellationToken ct) =>
    {
        var canConnect = await db.Database.CanConnectAsync(ct);
        return canConnect
            ? Results.Ok(new { status = "ok", database = "reachable" })
            : Results.Problem("Database unreachable", statusCode: 503);
    });

    app.MapFallbackToFile("index.html");

    app.Run();

    static async Task InitializeDatabaseAsync(IServiceProvider services)
    {
        const int maxAttempts = 3;
        for (var attempt = 1; attempt <= maxAttempts; attempt++)
        {
            try
            {
                using var scope = services.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<DUMCJAA.Infrastructure.Persistence.ApplicationDbContext>();
                var passwordHasher = scope.ServiceProvider.GetRequiredService<DUMCJAA.Domain.Interfaces.IPasswordHasher>();

                Log.Information("Database initialization attempt {Attempt}/{MaxAttempts}...", attempt, maxAttempts);
                
                // Using MigrateAsync instead of EnsureCreatedAsync for production-readiness
                await context.Database.MigrateAsync();
                await DUMCJAA.Infrastructure.Persistence.DbInitializer.SeedAsync(context, passwordHasher);
                
                Log.Information("Database initialization completed successfully.");
                return;
            }
            catch (Exception ex) when (attempt < maxAttempts)
            {
                Log.Warning(ex, "Database initialization attempt {Attempt} failed. Retrying...", attempt);
                await Task.Delay(TimeSpan.FromSeconds(5 * attempt));
            }
        }
        throw new InvalidOperationException("Database initialization failed after multiple attempts.");
    }
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

public partial class Program { }
