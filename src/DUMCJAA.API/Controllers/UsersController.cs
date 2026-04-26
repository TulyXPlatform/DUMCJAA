using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DUMCJAA.Infrastructure.Persistence;
using DUMCJAA.Domain.Common;
using DUMCJAA.Application.Common;
using Microsoft.EntityFrameworkCore;

namespace DUMCJAA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = Permissions.UsersManage)]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.IsActive,
                u.CreatedAt
            })
            .ToListAsync();
        return Ok(ApiResponse<object>.SuccessResponse(users));
    }
}
