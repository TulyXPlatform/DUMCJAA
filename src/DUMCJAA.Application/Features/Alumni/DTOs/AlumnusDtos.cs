namespace DUMCJAA.Application.Features.Alumni.DTOs;

public record AlumnusDto(
    Guid Id,
    string FirstName,
    string LastName,
    string FullName,
    string Email,
    string? Phone,
    string? Batch,
    string? Department,
    string? CurrentCompany,
    string? CurrentDesignation,
    string? ProfileImageUrl,
    string? LinkedInUrl,
    string? Biography,
    bool IsApproved,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreateAlumnusDto(
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? Batch,
    string? Department,
    string? CurrentCompany,
    string? CurrentDesignation,
    string? ProfileImageUrl,
    string? LinkedInUrl,
    string? Biography
);

public record UpdateAlumnusDto(
    string FirstName,
    string LastName,
    string? Phone,
    string? Batch,
    string? Department,
    string? CurrentCompany,
    string? CurrentDesignation,
    string? ProfileImageUrl,
    string? LinkedInUrl,
    string? Biography
);

public record ApproveAlumnusDto(
    bool IsApproved
);
