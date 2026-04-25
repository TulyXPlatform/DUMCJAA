namespace DUMCJAA.Application.Features.Files.DTOs;

public record FileUploadResultDto(
    string FileName,
    string FileUrl,
    long SizeInBytes
);
