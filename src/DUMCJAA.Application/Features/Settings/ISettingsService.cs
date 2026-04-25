using DUMCJAA.Application.Features.Settings.DTOs;

namespace DUMCJAA.Application.Features.Settings;

public interface ISettingsService
{
    Task<string?> GetValueAsync(string key, CancellationToken ct = default);
    Task<SettingDto> GetSettingAsync(string key, CancellationToken ct = default);
    Task<IReadOnlyList<SettingDto>> GetAllSettingsAsync(CancellationToken ct = default);
    Task<SettingDto> UpsertSettingAsync(string key, UpdateSettingDto dto, CancellationToken ct = default);
    Task DeleteSettingAsync(string key, CancellationToken ct = default);
}
