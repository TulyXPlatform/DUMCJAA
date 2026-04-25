namespace DUMCJAA.Application.Features.Samples.DTOs;

public record SampleDto(
    Guid Id,
    string Name,
    string? Description,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreateSampleDto(
    string Name,
    string? Description,
    bool IsActive = true
);

public record UpdateSampleDto(
    string Name,
    string? Description,
    bool IsActive
);
