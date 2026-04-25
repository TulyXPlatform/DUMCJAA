using DUMCJAA.Application.Features.Files.DTOs;

namespace DUMCJAA.Application.Features.Files;

public interface IFileService
{
    Task<FileUploadResultDto> UploadImageAsync(Stream fileStream, string fileName, string contentType, CancellationToken ct = default);
    Task DeleteFileAsync(string fileUrl, CancellationToken ct = default);
}
