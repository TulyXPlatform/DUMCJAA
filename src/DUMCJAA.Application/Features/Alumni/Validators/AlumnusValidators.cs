using FluentValidation;
using DUMCJAA.Application.Features.Alumni.DTOs;

namespace DUMCJAA.Application.Features.Alumni.Validators;

public class CreateAlumnusValidator : AbstractValidator<CreateAlumnusDto>
{
    public CreateAlumnusValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(x => x.Phone).MaximumLength(20).When(x => !string.IsNullOrEmpty(x.Phone));
        RuleFor(x => x.Batch).MaximumLength(50).When(x => !string.IsNullOrEmpty(x.Batch));
        RuleFor(x => x.Department).MaximumLength(150).When(x => !string.IsNullOrEmpty(x.Department));
        RuleFor(x => x.CurrentCompany).MaximumLength(200).When(x => !string.IsNullOrEmpty(x.CurrentCompany));
        RuleFor(x => x.CurrentDesignation).MaximumLength(200).When(x => !string.IsNullOrEmpty(x.CurrentDesignation));
        RuleFor(x => x.ProfileImageUrl).MaximumLength(1000).When(x => !string.IsNullOrEmpty(x.ProfileImageUrl));
        RuleFor(x => x.LinkedInUrl).MaximumLength(1000).When(x => !string.IsNullOrEmpty(x.LinkedInUrl));
        RuleFor(x => x.Biography).MaximumLength(2000).When(x => !string.IsNullOrEmpty(x.Biography));
    }
}

public class UpdateAlumnusValidator : AbstractValidator<UpdateAlumnusDto>
{
    public UpdateAlumnusValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Phone).MaximumLength(20).When(x => !string.IsNullOrEmpty(x.Phone));
        RuleFor(x => x.Batch).MaximumLength(50).When(x => !string.IsNullOrEmpty(x.Batch));
        RuleFor(x => x.Department).MaximumLength(150).When(x => !string.IsNullOrEmpty(x.Department));
        RuleFor(x => x.CurrentCompany).MaximumLength(200).When(x => !string.IsNullOrEmpty(x.CurrentCompany));
        RuleFor(x => x.CurrentDesignation).MaximumLength(200).When(x => !string.IsNullOrEmpty(x.CurrentDesignation));
        RuleFor(x => x.ProfileImageUrl).MaximumLength(1000).When(x => !string.IsNullOrEmpty(x.ProfileImageUrl));
        RuleFor(x => x.LinkedInUrl).MaximumLength(1000).When(x => !string.IsNullOrEmpty(x.LinkedInUrl));
        RuleFor(x => x.Biography).MaximumLength(2000).When(x => !string.IsNullOrEmpty(x.Biography));
    }
}
