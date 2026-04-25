namespace DUMCJAA.Application.Common;

/// <summary>
/// Standardized API response wrapper.
/// All API responses (success and error) flow through this.
/// </summary>
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }
    public int StatusCode { get; set; }

    public static ApiResponse<T> SuccessResponse(T data, string? message = null, int statusCode = 200) =>
        new()
        {
            Success = true,
            Data = data,
            Message = message,
            StatusCode = statusCode
        };

    public static ApiResponse<T> ErrorResponse(string message, int statusCode = 400, List<string>? errors = null) =>
        new()
        {
            Success = false,
            Message = message,
            StatusCode = statusCode,
            Errors = errors
        };
}
