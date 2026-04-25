using DUMCJAA.Application.Common;
using DUMCJAA.Application.Features.Settings;
using DUMCJAA.Application.Features.Settings.DTOs;
using DUMCJAA.Domain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace DUMCJAA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly ISettingsService _settingsService;
    private readonly IValidator<UpdateSettingDto> _updateValidator;

    public SettingsController(
        ISettingsService settingsService,
        IValidator<UpdateSettingDto> updateValidator)
    {
        _settingsService = settingsService;
        _updateValidator = updateValidator;
    }

    /// <summary>
    /// Gets a single setting by key. This is a fast, heavily cached endpoint.
    /// If the setting is of type 'json', it returns the parsed object to the frontend.
    /// </summary>
    [HttpGet("{key}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetValue(string key, CancellationToken ct)
    {
        var result = await _settingsService.GetSettingAsync(key, ct);
        
        // Dynamic response: return parsed JSON if the type is json, otherwise return the string directly
        object responseValue = result.Value;
        if (result.Type.Equals("json", StringComparison.OrdinalIgnoreCase))
        {
            try
            {
                responseValue = JsonSerializer.Deserialize<object>(result.Value)!;
            }
            catch
            {
                // Fallback to string if parsing fails despite validation
            }
        }

        return Ok(ApiResponse<object>.SuccessResponse(new { 
            result.Key, 
            Value = responseValue, 
            result.Type 
        }));
    }

    [HttpGet]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var result = await _settingsService.GetAllSettingsAsync(ct);
        return Ok(ApiResponse<IReadOnlyList<SettingDto>>.SuccessResponse(result));
    }

    [HttpPut("{key}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Upsert(string key, [FromBody] UpdateSettingDto dto, CancellationToken ct)
    {
        var validationResult = await _updateValidator.ValidateAsync(dto, ct);
        if (!validationResult.IsValid)
            throw new Application.Common.Exceptions.ValidationException(
                validationResult.Errors.Select(e => e.ErrorMessage).ToList());

        var result = await _settingsService.UpsertSettingAsync(key, dto, ct);
        return Ok(ApiResponse<SettingDto>.SuccessResponse(result, "Setting saved successfully."));
    }

    [HttpDelete("{key}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete(string key, CancellationToken ct)
    {
        await _settingsService.DeleteSettingAsync(key, ct);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Setting deleted successfully."));
    }
}
