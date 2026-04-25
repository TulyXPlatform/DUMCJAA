using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Entities;

public class EventRegistration : BaseEntity
{
    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
}
