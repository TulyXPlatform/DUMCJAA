using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Entities;

public class BlogPost : BaseEntity, ISoftDeletable
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid AuthorId { get; set; }
    public User? Author { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime? PublishedAt { get; set; }
    public bool IsPublished { get; set; } = false;
}
