using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DUMCJAA.Domain.Common;
using DUMCJAA.Application.Common;
using DUMCJAA.Application.Features.Users;
using DUMCJAA.Application.Features.Auth.DTOs;

namespace DUMCJAA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = Permissions.UsersManage)]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(ApiResponse<List<UserDto>>.SuccessResponse(users));
    }
}
