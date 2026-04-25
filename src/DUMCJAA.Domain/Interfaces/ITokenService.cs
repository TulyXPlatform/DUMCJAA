using DUMCJAA.Domain.Entities;

namespace DUMCJAA.Domain.Interfaces;

/// <summary>
/// Token generation contract. Returns access token and expiry.
/// </summary>
public interface ITokenService
{
    (string Token, DateTime ExpiresAt) GenerateToken(User user, IEnumerable<string> permissions);
}
