using DUMCJAA.Application.Features.RBAC.DTOs;
using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;

namespace DUMCJAA.Application.Features.RBAC;

public class PermissionService : IPermissionService
{
    private readonly IRepository<Permission> _permissionRepository;

    public PermissionService(IRepository<Permission> permissionRepository)
    {
        _permissionRepository = permissionRepository;
    }

    public async Task<List<PermissionDto>> GetAllPermissionsAsync()
    {
        var permissions = await _permissionRepository.GetAllAsync();
        return permissions.Select(p => new PermissionDto(p.Id, p.Name, p.Description)).ToList();
    }
}
