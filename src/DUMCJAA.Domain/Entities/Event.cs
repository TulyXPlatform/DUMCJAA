using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Entities;

public class Event : BaseEntity, ISoftDeletable
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    
    /// <summary>
    /// Maximum number of attendees allowed. If null, capacity is unlimited.
    /// </summary>
    public int? MaxAttendees { get; set; }

    public ICollection<EventRegistration> Registrations { get; set; } = new List<EventRegistration>();
}
