using FluentValidation;
using DUMCJAA.Application.Features.Events.DTOs;

namespace DUMCJAA.Application.Features.Events.Validators;

public class CreateEventValidator : AbstractValidator<CreateEventDto>
{
    public CreateEventValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.Location).NotEmpty().MaximumLength(500);
        RuleFor(x => x.ImageUrl).MaximumLength(1000).When(x => !string.IsNullOrEmpty(x.ImageUrl));
        
        RuleFor(x => x.EventDate)
            .GreaterThan(DateTime.UtcNow)
            .WithMessage("Event date must be in the future.");

        RuleFor(x => x.MaxAttendees)
            .GreaterThan(0).When(x => x.MaxAttendees.HasValue)
            .WithMessage("Maximum attendees must be greater than zero.");
    }
}

public class UpdateEventValidator : AbstractValidator<UpdateEventDto>
{
    public UpdateEventValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.Location).NotEmpty().MaximumLength(500);
        RuleFor(x => x.ImageUrl).MaximumLength(1000).When(x => !string.IsNullOrEmpty(x.ImageUrl));

        RuleFor(x => x.MaxAttendees)
            .GreaterThan(0).When(x => x.MaxAttendees.HasValue)
            .WithMessage("Maximum attendees must be greater than zero.");
    }
}
