namespace DUMCJAA.Domain.Interfaces;

/// <summary>
/// Abstraction for password hashing — Domain defines the contract,
/// Infrastructure implements with BCrypt.
/// </summary>
public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string hash);
}
