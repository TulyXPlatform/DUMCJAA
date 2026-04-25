using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Entities;

/// <summary>
/// Example domain entity — replace with real entities.
/// </summary>
public class SampleEntity : BaseEntity, ISoftDeletable
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}
