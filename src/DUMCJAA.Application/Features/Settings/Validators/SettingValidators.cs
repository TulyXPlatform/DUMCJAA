using FluentValidation;
using DUMCJAA.Application.Features.Settings.DTOs;
using System.Text.Json;

namespace DUMCJAA.Application.Features.Settings.Validators;

public class UpdateSettingValidator : AbstractValidator<UpdateSettingDto>
{
    public UpdateSettingValidator()
    {
        RuleFor(x => x.Value).NotNull();
        RuleFor(x => x.Type).NotEmpty().Must(x => new[] { "string", "json", "boolean", "number" }.Contains(x.ToLower()))
            .WithMessage("Type must be one of: string, json, boolean, number.");
            
        // If it's a JSON type, validate that it's actually valid JSON
        RuleFor(x => x.Value)
            .Must(BeValidJson)
            .When(x => x.Type.Equals("json", StringComparison.OrdinalIgnoreCase))
            .WithMessage("Value must be a valid JSON string when Type is 'json'.");
    }
    
    private bool BeValidJson(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) return false;
        try
        {
            JsonDocument.Parse(value);
            return true;
        }
        catch (JsonException)
        {
            return false;
        }
    }
}
