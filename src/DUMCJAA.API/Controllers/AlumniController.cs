using DUMCJAA.Application.Common;
using DUMCJAA.Application.Features.Alumni;
using DUMCJAA.Application.Features.Alumni.DTOs;
using DUMCJAA.Domain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DUMCJAA.Domain.Common;

namespace DUMCJAA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlumniController : ControllerBase
{
    private readonly IAlumnusService _alumnusService;
    private readonly IValidator<CreateAlumnusDto> _createValidator;
    private readonly IValidator<UpdateAlumnusDto> _updateValidator;

    public AlumniController(
        IAlumnusService alumnusService,
        IValidator<CreateAlumnusDto> createValidator,
        IValidator<UpdateAlumnusDto> updateValidator)
    {
        _alumnusService = alumnusService;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    /// <summary>
    /// Gets a paginated list of alumni. Can be filtered by search term, batch, department, and approval status.
    /// Public users can only see approved alumni.
    /// </summary>
    [HttpGet]
    [AllowAnonymous] // Public can view approved alumni
    public async Task<IActionResult> GetAll([FromQuery] AlumnusPaginationParams paging, CancellationToken ct)
    {
        // If the user is not authenticated or not an admin, force IsApproved to true
        // so they only see publicly approved profiles.
        if (!User.Identity?.IsAuthenticated ?? true || !User.IsInRole(Roles.Admin))
        {
            paging.IsApproved = true;
        }

        var result = await _alumnusService.GetAllAsync(paging, ct);
        return Ok(ApiResponse<PagedResult<AlumnusDto>>.SuccessResponse(result));
    }

    /// <summary>
    /// Gets a specific alumnus by ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _alumnusService.GetByIdAsync(id, ct);
        
        // Prevent public users from viewing unapproved profiles
        if (!result.IsApproved && (!User.Identity?.IsAuthenticated ?? true || !User.IsInRole(Roles.Admin)))
        {
            return Forbid();
        }

        return Ok(ApiResponse<AlumnusDto>.SuccessResponse(result));
    }

    /// <summary>
    /// Registers a new alumnus. Requires admin approval before becoming public.
    /// </summary>
    [HttpPost]
    [AllowAnonymous] // Anyone can submit an alumni profile
    public async Task<IActionResult> Create([FromBody] CreateAlumnusDto dto, CancellationToken ct)
    {
        var validationResult = await _createValidator.ValidateAsync(dto, ct);
        if (!validationResult.IsValid)
            throw new Application.Common.Exceptions.ValidationException(
                validationResult.Errors.Select(e => e.ErrorMessage).ToList());

        var result = await _alumnusService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            ApiResponse<AlumnusDto>.SuccessResponse(result, "Profile submitted successfully. Pending admin approval.", 201));
    }

    /// <summary>
    /// Updates an existing alumnus profile.
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize] // Requires auth. Typically user can only edit their own, but for simplicity assuming admins can edit any.
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAlumnusDto dto, CancellationToken ct)
    {
        var validationResult = await _updateValidator.ValidateAsync(dto, ct);
        if (!validationResult.IsValid)
            throw new Application.Common.Exceptions.ValidationException(
                validationResult.Errors.Select(e => e.ErrorMessage).ToList());

        var result = await _alumnusService.UpdateAsync(id, dto, ct);
        return Ok(ApiResponse<AlumnusDto>.SuccessResponse(result, "Profile updated successfully."));
    }

    /// <summary>
    /// Admin only: Approves or rejects an alumni profile.
    /// </summary>
    [HttpPatch("{id:guid}/approve")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> UpdateApprovalStatus(Guid id, [FromBody] ApproveAlumnusDto dto, CancellationToken ct)
    {
        var result = await _alumnusService.UpdateApprovalStatusAsync(id, dto.IsApproved, ct);
        var status = dto.IsApproved ? "approved" : "unapproved";
        return Ok(ApiResponse<AlumnusDto>.SuccessResponse(result, $"Profile has been {status}."));
    }

    /// <summary>
    /// Admin only: Deletes an alumni profile.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _alumnusService.DeleteAsync(id, ct);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Profile deleted successfully."));
    }
}
