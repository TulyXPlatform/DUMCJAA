using DUMCJAA.Application.Common;
using DUMCJAA.Application.Features.RBAC;
using DUMCJAA.Application.Features.RBAC.DTOs;
using DUMCJAA.Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DUMCJAA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = Permissions.UsersManage)]
public class RolesController : ControllerBase
{
    private readonly IRoleService _roleService;

    public RolesController(IRoleService roleService)
    {
        _roleService = roleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _roleService.GetRolesAsync();
        return Ok(ApiResponse<List<RoleDto>>.SuccessResponse(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _roleService.GetRoleByIdAsync(id);
        return Ok(ApiResponse<RoleDto>.SuccessResponse(result));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRoleDto dto)
    {
        var result = await _roleService.CreateRoleAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponse<RoleDto>.SuccessResponse(result, "Role created successfully.", 201));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateRoleDto dto)
    {
        var result = await _roleService.UpdateRoleAsync(id, dto);
        return Ok(ApiResponse<RoleDto>.SuccessResponse(result, "Role updated successfully."));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _roleService.DeleteRoleAsync(id);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Role deleted successfully."));
    }

    [HttpGet("{id:guid}/permissions")]
    public async Task<IActionResult> GetRolePermissions(Guid id)
    {
        var result = await _roleService.GetRolePermissionsAsync(id);
        return Ok(ApiResponse<List<PermissionDto>>.SuccessResponse(result));
    }

    [HttpPut("{id:guid}/permissions")]
    public async Task<IActionResult> UpdateRolePermissions(Guid id, [FromBody] RolePermissionAssignmentDto dto)
    {
        await _roleService.UpdateRolePermissionsAsync(id, dto);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Role permissions updated successfully."));
    }
}

[ApiController]
[Route("api/users")]
[Authorize(Policy = Permissions.UsersManage)]
public class UserRolesController : ControllerBase
{
    private readonly IRoleService _roleService;

    public UserRolesController(IRoleService roleService)
    {
        _roleService = roleService;
    }

    [HttpGet("{id:guid}/roles")]
    public async Task<IActionResult> GetUserRoles(Guid id)
    {
        var result = await _roleService.GetUserRolesAsync(id);
        return Ok(ApiResponse<List<RoleDto>>.SuccessResponse(result));
    }

    [HttpPut("{id:guid}/roles")]
    public async Task<IActionResult> UpdateUserRoles(Guid id, [FromBody] UserRoleAssignmentDto dto)
    {
        await _roleService.UpdateUserRolesAsync(id, dto);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "User roles updated successfully."));
    }

    [HttpGet("{id:guid}/permissions")]
    public async Task<IActionResult> GetUserPermissions(Guid id)
    {
        var result = await _roleService.GetUserPermissionsAsync(id);
        return Ok(ApiResponse<List<string>>.SuccessResponse(result));
    }
}

[ApiController]
[Route("api/permissions")]
[Authorize(Policy = Permissions.UsersManage)]
public class PermissionsController : ControllerBase
{
    private readonly IPermissionService _permissionService;

    public PermissionsController(IPermissionService permissionService)
    {
        _permissionService = permissionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _permissionService.GetAllPermissionsAsync();
        return Ok(ApiResponse<List<PermissionDto>>.SuccessResponse(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _permissionService.GetPermissionByIdAsync(id);
        return Ok(ApiResponse<PermissionDto>.SuccessResponse(result));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePermissionDto dto)
    {
        var result = await _permissionService.CreatePermissionAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponse<PermissionDto>.SuccessResponse(result, "Permission created successfully.", 201));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePermissionDto dto)
    {
        var result = await _permissionService.UpdatePermissionAsync(id, dto);
        return Ok(ApiResponse<PermissionDto>.SuccessResponse(result, "Permission updated successfully."));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _permissionService.DeletePermissionAsync(id);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Permission deleted successfully."));
    }
}
