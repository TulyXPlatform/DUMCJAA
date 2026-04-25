using DUMCJAA.Application.Common;
using DUMCJAA.Application.Common.Exceptions;
using DUMCJAA.Application.Features.Samples;
using DUMCJAA.Application.Features.Samples.DTOs;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace DUMCJAA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SamplesController : ControllerBase
{
    private readonly ISampleService _sampleService;
    private readonly IValidator<CreateSampleDto> _createValidator;
    private readonly IValidator<UpdateSampleDto> _updateValidator;

    public SamplesController(
        ISampleService sampleService,
        IValidator<CreateSampleDto> createValidator,
        IValidator<UpdateSampleDto> updateValidator)
    {
        _sampleService = sampleService;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PaginationParams paging, CancellationToken ct)
    {
        var result = await _sampleService.GetAllAsync(paging, ct);
        return Ok(ApiResponse<PagedResult<SampleDto>>.SuccessResponse(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _sampleService.GetByIdAsync(id, ct);
        return Ok(ApiResponse<SampleDto>.SuccessResponse(result));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSampleDto dto, CancellationToken ct)
    {
        var validationResult = await _createValidator.ValidateAsync(dto, ct);
        if (!validationResult.IsValid)
            throw new Application.Common.Exceptions.ValidationException(
                validationResult.Errors.Select(e => e.ErrorMessage).ToList());

        var result = await _sampleService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            ApiResponse<SampleDto>.SuccessResponse(result, "Created successfully.", 201));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSampleDto dto, CancellationToken ct)
    {
        var validationResult = await _updateValidator.ValidateAsync(dto, ct);
        if (!validationResult.IsValid)
            throw new Application.Common.Exceptions.ValidationException(
                validationResult.Errors.Select(e => e.ErrorMessage).ToList());

        var result = await _sampleService.UpdateAsync(id, dto, ct);
        return Ok(ApiResponse<SampleDto>.SuccessResponse(result, "Updated successfully."));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _sampleService.DeleteAsync(id, ct);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Deleted successfully."));
    }
}
