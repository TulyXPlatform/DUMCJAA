using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Entities;

public class ContactInquiry : BaseEntity, ISoftDeletable
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime ReceivedAt { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; } = false;
}
