using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DUMCJAA.Infrastructure.Auth;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public (string Token, DateTime ExpiresAt) GenerateToken(User user, IEnumerable<string> permissions)
    {
        var secretKey = _configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured.");
        var issuer = _configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer not configured.");
        var audience = _configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience not configured.");
        
        var expirationMinutesStr = _configuration["Jwt:ExpirationMinutes"] ?? "60";
        if (!int.TryParse(expirationMinutesStr, out var expirationMinutes))
        {
            expirationMinutes = 60;
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.FullName),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        // Add roles
        foreach (var userRole in user.UserRoles)
        {
            claims.Add(new Claim(ClaimTypes.Role, userRole.Role.Name));
        }

        // Add permissions as custom claims
        foreach (var permission in permissions)
        {
            claims.Add(new Claim("permissions", permission));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds
        );

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }
}
