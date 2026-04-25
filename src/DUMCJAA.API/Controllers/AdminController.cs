using DUMCJAA.Application.Common;
using DUMCJAA.Domain.Common;
using DUMCJAA.Domain.Entities;
using DUMCJAA.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DUMCJAA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = Permissions.UsersManage)]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("roles")]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await _context.Roles
            .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
            .ToListAsync();
        return Ok(ApiResponse<object>.SuccessResponse(roles));
    }

    [HttpPost("roles/{roleId}/permissions")]
    public async Task<IActionResult> AssignPermission(Guid roleId, [FromBody] Guid permissionId)
    {
        var role = await _context.Roles.FindAsync(roleId);
        if (role == null) return NotFound();

        var exists = await _context.RolePermissions.AnyAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);
        if (exists) return BadRequest(ApiResponse<object>.ErrorResponse("Permission already assigned to role.", 400));

        _context.RolePermissions.Add(new RolePermission { RoleId = roleId, PermissionId = permissionId });
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "Permission assigned successfully."));
    }

    [HttpGet("permissions")]
    public async Task<IActionResult> GetPermissions()
    {
        var permissions = await _context.Permissions.ToListAsync();
        return Ok(ApiResponse<object>.SuccessResponse(permissions));
    }
}
