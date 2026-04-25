using DUMCJAA.Application.Common;
using DUMCJAA.Application.Features.Files;
using DUMCJAA.Application.Features.Files.DTOs;
using DUMCJAA.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DUMCJAA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilesController : ControllerBase
{
    private readonly IFileService _fileService;

    public FilesController(IFileService fileService)
    {
        _fileService = fileService;
    }

    /// <summary>
    /// Uploads an image file. Returns the public URL.
    /// Restricted to authenticated users (e.g., users uploading avatars or admins uploading event banners).
    /// </summary>
    [HttpPost("upload-image")]
    [Authorize]
    public async Task<IActionResult> UploadImage(IFormFile file, CancellationToken ct)
    {
        if (file == null || file.Length == 0)
            throw new Application.Common.Exceptions.ValidationException(new List<string> { "No file provided." });

        using var stream = file.OpenReadStream();
        var result = await _fileService.UploadImageAsync(stream, file.FileName, file.ContentType, ct);
        
        return Ok(ApiResponse<FileUploadResultDto>.SuccessResponse(result, "Image uploaded successfully."));
    }
}
