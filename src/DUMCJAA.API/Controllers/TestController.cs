using DUMCJAA.Application.Common;
using DUMCJAA.Domain.Common;
using DUMCJAA.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DUMCJAA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly IEmailService _emailService;

    public TestController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpGet("email")]
    public async Task<IActionResult> TestEmail([FromQuery] string to)
    {
        if (string.IsNullOrEmpty(to)) return BadRequest("Recipient email is required.");

        var message = new EmailMessage
        {
            To = to,
            Subject = "Test Email - DUMCJAA Alumni Platform",
            HtmlBody = "<h1>Success!</h1><p>The pluggable email system is working correctly.</p>",
            TextBody = "Success! The pluggable email system is working correctly."
        };

        try
        {
            await _emailService.SendAsync(message);
            return Ok(ApiResponse<object>.SuccessResponse(null, $"Test email sent successfully to {to}"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResponse($"Failed to send email: {ex.Message}", 500));
        }
    }
}
