using DUMCJAA.Application.Common.Exceptions;
using DUMCJAA.Application.Features.Files;
using DUMCJAA.Application.Features.Files.DTOs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DUMCJAA.Infrastructure.Services;

public class LocalFileService : IFileService
{
    private readonly string _uploadDirectory;
    private readonly string _baseUrl;
    private readonly ILogger<LocalFileService> _logger;
    
    // Security: Restrict allowed extensions and MIME types
    private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
    private readonly string[] _allowedMimeTypes = { "image/jpeg", "image/png", "image/webp" };
    private const long MaxFileSizeInBytes = 5 * 1024 * 1024; // 5 MB

    public LocalFileService(IConfiguration configuration, ILogger<LocalFileService> logger)
    {
        _logger = logger;
        
        // Ensure uploads go to the API's wwwroot/uploads directory
        _uploadDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        
        // Get the base URL from config to construct public URLs
        _baseUrl = configuration["ApiSettings:BaseUrl"] ?? "https://localhost:7001";
        
        if (!Directory.Exists(_uploadDirectory))
        {
            Directory.CreateDirectory(_uploadDirectory);
        }
    }

    public async Task<FileUploadResultDto> UploadImageAsync(Stream fileStream, string fileName, string contentType, CancellationToken ct = default)
    {
        ValidateFile(fileStream, fileName, contentType);

        // Security: Generate a completely unique, safe filename to prevent directory traversal and overwrites
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        var uniqueFileName = $"{Guid.NewGuid():N}_{DateTime.UtcNow.Ticks}{extension}";
        
        var filePath = Path.Combine(_uploadDirectory, uniqueFileName);

        try
        {
            using var fileOutStream = new FileStream(filePath, FileMode.Create);
            await fileStream.CopyToAsync(fileOutStream, ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save file to disk: {FileName}", uniqueFileName);
            throw new Exception("An error occurred while saving the file.", ex);
        }

        var fileUrl = $"{_baseUrl}/uploads/{uniqueFileName}";
        
        _logger.LogInformation("File uploaded successfully: {FileUrl}", fileUrl);

        return new FileUploadResultDto(uniqueFileName, fileUrl, fileStream.Length);
    }

    public Task DeleteFileAsync(string fileUrl, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(fileUrl)) return Task.CompletedTask;

        try
        {
            var uri = new Uri(fileUrl);
            var fileName = Path.GetFileName(uri.LocalPath);
            var filePath = Path.Combine(_uploadDirectory, fileName);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                _logger.LogInformation("File deleted successfully: {FileName}", fileName);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to delete file: {FileUrl}", fileUrl);
        }

        return Task.CompletedTask;
    }

    private void ValidateFile(Stream fileStream, string fileName, string contentType)
    {
        if (fileStream == null || fileStream.Length == 0)
            throw new ValidationException(new List<string> { "File is empty or not provided." });

        if (fileStream.Length > MaxFileSizeInBytes)
            throw new ValidationException(new List<string> { $"File exceeds the maximum allowed size of {MaxFileSizeInBytes / 1024 / 1024}MB." });

        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        if (string.IsNullOrEmpty(extension) || !_allowedExtensions.Contains(extension))
            throw new ValidationException(new List<string> { "Invalid file extension. Allowed extensions: .jpg, .jpeg, .png, .webp" });

        if (!_allowedMimeTypes.Contains(contentType.ToLowerInvariant()))
            throw new ValidationException(new List<string> { "Invalid MIME type. Upload a valid image file." });
            
        // Note: For extreme security, we would read the file header (magic numbers) to verify it's actually an image
        // and not a renamed malicious executable.
    }
}
