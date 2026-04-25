using DUMCJAA.Application.Common;

namespace DUMCJAA.Application.Features.Alumni.DTOs;

public class AlumnusPaginationParams : PaginationParams
{
    public string? Batch { get; set; }
    public string? Department { get; set; }
    public bool? IsApproved { get; set; }
}
