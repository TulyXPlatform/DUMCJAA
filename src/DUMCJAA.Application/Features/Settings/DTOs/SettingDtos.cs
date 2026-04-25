namespace DUMCJAA.Application.Features.Settings.DTOs;

public record SettingDto(
    string Key,
    string Value,
    string? Description,
    string Type,
    DateTime? UpdatedAt
);

public record UpdateSettingDto(
    string Value,
    string? Description,
    string Type
);
