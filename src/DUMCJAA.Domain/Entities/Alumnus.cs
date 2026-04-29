using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Entities;

public class Alumnus : BaseEntity, ISoftDeletable
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? StudentId { get; set; }
    public string? Phone { get; set; }
    public string? Batch { get; set; } // Graduation year or batch name
    public string? Department { get; set; }
    public string? CurrentCompany { get; set; }
    public string? CurrentDesignation { get; set; }
    public string? ProfileImageUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? Biography { get; set; }
    public bool IsApproved { get; set; } = false; // Requires admin approval to show publicly

    public string FullName => $"{FirstName} {LastName}".Trim();
}
