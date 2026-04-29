using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Entities;

public class JobPost : BaseEntity, ISoftDeletable
{
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Requirements { get; set; }
    public DateTime? Deadline { get; set; }
    public string? ApplyUrl { get; set; }
    public bool IsActive { get; set; } = true;
}
