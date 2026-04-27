using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using DUMCJAA.API.Middleware;
using DUMCJAA.Application;
using DUMCJAA.Infrastructure;
using Serilog;

// ── Bootstrap Serilog before anything else ──
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

    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrWhiteSpace(connectionString) ||
        connectionString.Contains("your_username", StringComparison.OrdinalIgnoreCase) ||
        connectionString.Contains("your_password", StringComparison.OrdinalIgnoreCase))
    {
        throw new InvalidOperationException(
            "ConnectionStrings__DefaultConnection is missing or still contains placeholder credentials.");
    }

    // ── API services ──
    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
        });

    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
        {
            Title = "DUMCJAA API",
            Version = "v1",
            Description = "Production-ready Clean Architecture API"
        });
        
        options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
            Name = "Authorization",
            In = Microsoft.OpenApi.Models.ParameterLocation.Header,
            Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });

        options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
        {
            {
                new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Reference = new Microsoft.OpenApi.Models.OpenApiReference
                    {
                        Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
    });

    // ── Authentication & Authorization ──
    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"] ?? string.Empty))
        };
    });
    
    // RBAC dynamic policy registration
    builder.Services.AddSingleton<Microsoft.AspNetCore.Authorization.IAuthorizationPolicyProvider, DUMCJAA.Infrastructure.Auth.PermissionPolicyProvider>();
    builder.Services.AddScoped<Microsoft.AspNetCore.Authorization.IAuthorizationHandler, DUMCJAA.Infrastructure.Auth.PermissionAuthorizationHandler>();
    builder.Services.AddAuthorization();

    // Trust reverse-proxy headers (Render / Nginx) so HTTPS redirection works correctly
    builder.Services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
        options.KnownNetworks.Clear();
        options.KnownProxies.Clear();
    });

    // ── CORS ──
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
    });

    var app = builder.Build();

    // ── Database bootstrap (fail fast if DB is unreachable/misconfigured) ──
    await InitializeDatabaseAsync(app.Services);

    // ── Middleware pipeline ──
    app.UseMiddleware<GlobalExceptionMiddleware>();
    app.UseSerilogRequestLogging();

    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "DUMCJAA API v1"));

    app.UseForwardedHeaders();

    app.UseHttpsRedirection();

    // Serve the React app (built files copied to wwwroot during container build)
    app.UseDefaultFiles();
    app.UseStaticFiles();

    app.UseCors("AllowFrontend");
    
    app.UseAuthentication();
    app.UseAuthorization();
    
    app.MapControllers();

    // Lightweight probes for Render health checks
    app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
    app.MapGet("/health/db", async (DUMCJAA.Infrastructure.Persistence.ApplicationDbContext db, CancellationToken ct) =>
    {
        var canConnect = await db.Database.CanConnectAsync(ct);
        return canConnect
            ? Results.Ok(new { status = "ok", database = "reachable" })
            : Results.Problem("Database unreachable", statusCode: 503);
    });

    // Let client-side routes (e.g. /events/123) resolve to React's index.html
    app.MapFallbackToFile("index.html");

    app.Run();

    static async Task InitializeDatabaseAsync(IServiceProvider services)
    {
        const int maxAttempts = 5;
        for (var attempt = 1; attempt <= maxAttempts; attempt++)
        {
            try
            {
                using var scope = services.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<DUMCJAA.Infrastructure.Persistence.ApplicationDbContext>();
                var passwordHasher = scope.ServiceProvider.GetRequiredService<DUMCJAA.Domain.Interfaces.IPasswordHasher>();

                Console.WriteLine($"Database initialization attempt {attempt}/{maxAttempts}...");
                await context.Database.EnsureCreatedAsync();
                await DUMCJAA.Infrastructure.Persistence.DbInitializer.SeedAsync(context, passwordHasher);
                Console.WriteLine("Database initialization completed successfully.");
                return;
            }
            catch (Exception ex) when (attempt < maxAttempts)
            {
                Log.Warning(ex, "Database initialization attempt {Attempt} failed. Retrying...", attempt);
                await Task.Delay(TimeSpan.FromSeconds(5 * attempt));
            }
        }

        throw new InvalidOperationException(
            "Database initialization failed after multiple attempts. " +
            "Check ConnectionStrings__DefaultConnection and Azure SQL firewall settings.");
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

// Make the implicit Program class public so test projects can access it
public partial class Program { }
