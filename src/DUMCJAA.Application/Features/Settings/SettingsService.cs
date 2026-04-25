using DUMCJAA.Application.Common.Exceptions;
using DUMCJAA.Application.Features.Settings.DTOs;
using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace DUMCJAA.Application.Features.Settings;

public class SettingsService : ISettingsService
{
    private readonly IRepository<Setting> _settingsRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMemoryCache _cache;
    private readonly ILogger<SettingsService> _logger;
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(60); // Cache heavily read settings

    public SettingsService(
        IRepository<Setting> settingsRepository,
        IUnitOfWork unitOfWork,
        IMemoryCache cache,
        ILogger<SettingsService> logger)
    {
        _settingsRepository = settingsRepository;
        _unitOfWork = unitOfWork;
        _cache = cache;
        _logger = logger;
    }

    private string GetCacheKey(string key) => $"Setting_{key.ToLower()}";

    public async Task<string?> GetValueAsync(string key, CancellationToken ct = default)
    {
        var cacheKey = GetCacheKey(key);
        
        // Fast path: check cache first
        if (_cache.TryGetValue(cacheKey, out string? cachedValue))
        {
            return cachedValue;
        }

        // Slow path: hit database
        var (items, _) = await _settingsRepository.GetPagedAsync(1, 1, x => x.Key.ToLower() == key.ToLower(), ct: ct);
        var setting = items.FirstOrDefault();

        if (setting != null)
        {
            _cache.Set(cacheKey, setting.Value, CacheDuration);
            return setting.Value;
        }

        return null;
    }

    public async Task<SettingDto> GetSettingAsync(string key, CancellationToken ct = default)
    {
        var (items, _) = await _settingsRepository.GetPagedAsync(1, 1, x => x.Key.ToLower() == key.ToLower(), ct: ct);
        var setting = items.FirstOrDefault() ?? throw new NotFoundException(nameof(Setting), key);

        return MapToDto(setting);
    }

    public async Task<IReadOnlyList<SettingDto>> GetAllSettingsAsync(CancellationToken ct = default)
    {
        var (items, _) = await _settingsRepository.GetPagedAsync(1, 1000, ct: ct); // Get all, assuming settings are bounded
        return items.Select(MapToDto).ToList();
    }

    public async Task<SettingDto> UpsertSettingAsync(string key, UpdateSettingDto dto, CancellationToken ct = default)
    {
        var (items, _) = await _settingsRepository.GetPagedAsync(1, 1, x => x.Key.ToLower() == key.ToLower(), ct: ct);
        var entity = items.FirstOrDefault();

        if (entity == null)
        {
            entity = new Setting
            {
                Id = Guid.NewGuid(),
                Key = key.ToLower(),
                Value = dto.Value,
                Description = dto.Description,
                Type = dto.Type.ToLower()
            };
            await _settingsRepository.AddAsync(entity, ct);
            _logger.LogInformation("Created new CMS setting {Key}", key);
        }
        else
        {
            entity.Value = dto.Value;
            entity.Description = dto.Description;
            entity.Type = dto.Type.ToLower();
            entity.UpdatedAt = DateTime.UtcNow;
            await _settingsRepository.UpdateAsync(entity, ct);
            _logger.LogInformation("Updated CMS setting {Key}", key);
        }

        await _unitOfWork.SaveChangesAsync(ct);

        // Invalidate the cache for this setting so subsequent reads get the fresh value
        _cache.Remove(GetCacheKey(key));

        return MapToDto(entity);
    }

    public async Task DeleteSettingAsync(string key, CancellationToken ct = default)
    {
        var (items, _) = await _settingsRepository.GetPagedAsync(1, 1, x => x.Key.ToLower() == key.ToLower(), ct: ct);
        var entity = items.FirstOrDefault();
        
        if (entity == null)
            throw new NotFoundException(nameof(Setting), key);

        await _settingsRepository.DeleteAsync(entity.Id, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        
        _cache.Remove(GetCacheKey(key));
        _logger.LogInformation("Deleted CMS setting {Key}", key);
    }

    private static SettingDto MapToDto(Setting entity) =>
        new(entity.Key, entity.Value, entity.Description, entity.Type, entity.UpdatedAt);
}
