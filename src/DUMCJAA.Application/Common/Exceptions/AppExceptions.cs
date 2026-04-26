namespace DUMCJAA.Application.Common.Exceptions;

/// <summary>
/// Thrown when a requested entity is not found.
/// Mapped to 404 by global exception middleware.
/// </summary>
public class NotFoundException : Exception
{
    public NotFoundException(string name, object key)
        : base($"Entity \"{name}\" ({key}) was not found.") { }
}

/// <summary>
/// Thrown on validation failures.
/// Mapped to 400 by global exception middleware.
/// </summary>
public class ValidationException : Exception
{
    public List<string> Errors { get; }

    public ValidationException(List<string> errors)
        : base("One or more validation errors occurred.")
    {
        Errors = errors;
    }
}

/// <summary>
/// Thrown on general bad requests.
/// Mapped to 400 by global exception middleware.
/// </summary>
public class BadRequestException : Exception
{
    public BadRequestException(string message) : base(message) { }
}

/// <summary>
/// Thrown on business rule violations.
/// Mapped to 409 by global exception middleware.
/// </summary>
public class ConflictException : Exception
{
    public ConflictException(string message) : base(message) { }
}

/// <summary>
/// Thrown on authentication failures (invalid credentials, expired token).
/// Mapped to 401 by global exception middleware.
/// </summary>
public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message = "Invalid credentials.")
        : base(message) { }
}

/// <summary>
/// Thrown on authorization failures (authenticated but lacks permission).
/// Mapped to 403 by global exception middleware.
/// </summary>
public class ForbiddenException : Exception
{
    public ForbiddenException(string message = "You do not have permission to perform this action.")
        : base(message) { }
}
