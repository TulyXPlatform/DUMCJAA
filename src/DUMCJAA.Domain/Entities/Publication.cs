using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Entities;

public enum PublicationType
{
    Report,
    Souvenir,
    Book,
    Notice,
    Other
}

public class Publication : BaseEntity, ISoftDeletable
{
    public string Title { get; set; } = string.Empty;
    public string? Author { get; set; }
    public PublicationType Type { get; set; }
    public string? Description { get; set; }
    public string? FileUrl { get; set; }
    public DateTime PublishDate { get; set; }
    public bool IsActive { get; set; } = true;
}
