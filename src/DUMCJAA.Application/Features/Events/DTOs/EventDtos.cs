namespace DUMCJAA.Application.Features.Events.DTOs;

public record EventDto(
    Guid Id,
    string Title,
    string Description,
    DateTime EventDate,
    string Location,
    string? ImageUrl,
    int? MaxAttendees,
    int CurrentRegistrationsCount,
    bool IsFull,
    bool IsPastEvent
);

public record CreateEventDto(
    string Title,
    string Description,
    DateTime EventDate,
    string Location,
    string? ImageUrl,
    int? MaxAttendees
);

public record UpdateEventDto(
    string Title,
    string Description,
    DateTime EventDate,
    string Location,
    string? ImageUrl,
    int? MaxAttendees
);

public record EventRegistrationDto(
    Guid Id,
    Guid EventId,
    Guid UserId,
    string UserName,
    string UserEmail,
    DateTime RegisteredAt
);
