using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DUMCJAA.Infrastructure.Auth;

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        // Extract permissions from the "permissions" claim in the JWT
        var permissions = context.User.FindAll("permissions").Select(x => x.Value);

        if (permissions.Contains(requirement.Permission))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
