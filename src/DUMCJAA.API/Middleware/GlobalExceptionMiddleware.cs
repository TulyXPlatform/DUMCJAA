using System.Net;
using System.Text.Json;
using DUMCJAA.Application.Common;
using DUMCJAA.Application.Common.Exceptions;

namespace DUMCJAA.API.Middleware;

/// <summary>
/// Catches all unhandled exceptions and maps them to standardized API responses.
/// Custom exceptions → specific status codes; unknown exceptions → 500.
/// </summary>
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message, errors) = exception switch
        {
            NotFoundException notFound => (
                HttpStatusCode.NotFound,
                notFound.Message,
                (List<string>?)null),

            ValidationException validation => (
                HttpStatusCode.BadRequest,
                validation.Message,
                validation.Errors),

            UnauthorizedException unauthorized => (
                HttpStatusCode.Unauthorized,
                unauthorized.Message,
                (List<string>?)null),

            ConflictException conflict => (
                HttpStatusCode.Conflict,
                conflict.Message,
                (List<string>?)null),

            ForbiddenException forbidden => (
                HttpStatusCode.Forbidden,
                forbidden.Message,
                (List<string>?)null),

            _ => (
                HttpStatusCode.InternalServerError,
                "An unexpected error occurred.",
                (List<string>?)null)
        };

        // Log full details for 500s, structured info for known exceptions
        if (statusCode == HttpStatusCode.InternalServerError)
            _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
        else
            _logger.LogWarning("Handled exception ({StatusCode}): {Message}", (int)statusCode, exception.Message);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var response = ApiResponse<object>.ErrorResponse(message, (int)statusCode, errors);

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}
