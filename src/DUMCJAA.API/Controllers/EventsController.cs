using System.Security.Claims;
using DUMCJAA.Application.Common;
using DUMCJAA.Application.Features.Events;
using DUMCJAA.Application.Features.Events.DTOs;
using DUMCJAA.Domain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DUMCJAA.Domain.Common;

namespace DUMCJAA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;
    private readonly IValidator<CreateEventDto> _createValidator;
    private readonly IValidator<UpdateEventDto> _updateValidator;

    public EventsController(
        IEventService eventService,
        IValidator<CreateEventDto> createValidator,
        IValidator<UpdateEventDto> updateValidator)
    {
        _eventService = eventService;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] PaginationParams paging, CancellationToken ct)
    {
        var result = await _eventService.GetAllAsync(paging, ct);
        return Ok(ApiResponse<PagedResult<EventDto>>.SuccessResponse(result));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _eventService.GetByIdAsync(id, ct);
        return Ok(ApiResponse<EventDto>.SuccessResponse(result));
    }

    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Create([FromBody] CreateEventDto dto, CancellationToken ct)
    {
        var validationResult = await _createValidator.ValidateAsync(dto, ct);
        if (!validationResult.IsValid)
            throw new Application.Common.Exceptions.ValidationException(
                validationResult.Errors.Select(e => e.ErrorMessage).ToList());

        var result = await _eventService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            ApiResponse<EventDto>.SuccessResponse(result, "Event created successfully.", 201));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateEventDto dto, CancellationToken ct)
    {
        var validationResult = await _updateValidator.ValidateAsync(dto, ct);
        if (!validationResult.IsValid)
            throw new Application.Common.Exceptions.ValidationException(
                validationResult.Errors.Select(e => e.ErrorMessage).ToList());

        var result = await _eventService.UpdateAsync(id, dto, ct);
        return Ok(ApiResponse<EventDto>.SuccessResponse(result, "Event updated successfully."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _eventService.DeleteAsync(id, ct);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Event deleted successfully."));
    }

    [HttpPost("{id:guid}/register")]
    [Authorize]
    public async Task<IActionResult> Register(Guid id, CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        var result = await _eventService.RegisterUserAsync(id, userId, ct);
        return Ok(ApiResponse<EventRegistrationDto>.SuccessResponse(result, "Registered successfully for the event."));
    }

    [HttpDelete("{id:guid}/register")]
    [Authorize]
    public async Task<IActionResult> Unregister(Guid id, CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        await _eventService.UnregisterUserAsync(id, userId, ct);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Unregistered successfully from the event."));
    }

    [HttpGet("{id:guid}/registrations")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> GetRegistrations(Guid id, CancellationToken ct)
    {
        var result = await _eventService.GetEventRegistrationsAsync(id, ct);
        return Ok(ApiResponse<IReadOnlyList<EventRegistrationDto>>.SuccessResponse(result));
    }

    private Guid GetCurrentUserId()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            throw new Application.Common.Exceptions.UnauthorizedException("Invalid token claims.");
        return userId;
    }
}
