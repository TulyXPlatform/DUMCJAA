import { useState, useEffect, useCallback } from 'react';
import { Shield, Plus, Check, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../../api/axios';

interface Permission {
  id: string;
  name: string;
}

interface RolePermission {
  permissionId: string;
  permission: Permission;
}

interface Role {
  id: string;
  name: string;
  description?: string;
  rolePermissions: RolePermission[];
}

interface ApiListResponse<T> {
  data: T[];
}

interface ApiErrorResponse {
  message?: string;
}

export const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [rolesRes, permRes] = await Promise.all([
        apiClient.get<ApiListResponse<Role>>('/admin/roles'),
        apiClient.get<ApiListResponse<Permission>>('/admin/permissions')
      ]);
      setRoles(rolesRes.data.data);
      setPermissions(permRes.data.data);
    } catch {
      toast.error('Failed to fetch roles or permissions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const assignPermission = async (roleId: string, permissionId: string) => {
    try {
      await apiClient.post(`/admin/roles/${roleId}/permissions`, permissionId, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Permission assigned.');
      fetchData(); // Refresh to show the new state
    } catch (err) {
      const error = err as { response?: { data?: ApiErrorResponse } };
      toast.error(error.response?.data?.message || 'Failed to assign permission.');
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-600" /></div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
          <Shield className="text-brand-600" /> RBAC Management
        </h1>
        <p className="text-neutral-500 mt-2">Manage roles and their granular permissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{role.name}</h3>
                <p className="text-sm text-neutral-500">{role.description}</p>
              </div>
              <Shield className="text-neutral-300 w-8 h-8" />
            </div>
            
            <div className="p-6">
              <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Assigned Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {role.rolePermissions.map((rp) => (
                  <span key={rp.permissionId} className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full border border-brand-100">
                    <Check className="w-3 h-3" /> {rp.permission.name}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Available Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {permissions
                    .filter((p) => !role.rolePermissions.some((rp) => rp.permissionId === p.id))
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => assignPermission(role.id, p.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-neutral-50 text-neutral-600 text-xs font-medium rounded-full border border-neutral-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> {p.name}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
