using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Entities;

public class Setting : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = "string"; // string, json, boolean, number
}
