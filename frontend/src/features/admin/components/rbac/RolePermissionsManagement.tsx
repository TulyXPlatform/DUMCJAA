import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Save } from 'lucide-react';
import { apiClient } from '../../../../api/axios';
import toast from 'react-hot-toast';

interface Permission {
  id: string;
  name: string;
  description: string;
}

export const RolePermissionsManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: role } = useQuery({
    queryKey: ['roles', id],
    queryFn: async () => {
      const res = await apiClient.get(`/roles/${id}`);
      return res.data.data;
    }
  });

  const { data: allPermissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const res = await apiClient.get('/permissions');
      return res.data.data as Permission[];
    }
  });

  const { data: currentPermissions } = useQuery({
    queryKey: ['roles', id, 'permissions'],
    queryFn: async () => {
      const res = await apiClient.get(`/roles/${id}/permissions`);
      return res.data.data as Permission[];
    }
  });

  useEffect(() => {
    if (currentPermissions) {
      setSelectedIds(currentPermissions.map(p => p.id));
    }
  }, [currentPermissions]);

  const mutation = useMutation({
    mutationFn: (ids: string[]) => apiClient.put(`/roles/${id}/permissions`, { permissionIds: ids }),
    onSuccess: () => {
      toast.success('Permissions updated successfully');
      queryClient.invalidateQueries({ queryKey: ['roles', id, 'permissions'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update permissions');
    }
  });

  const togglePermission = (pId: string) => {
    setSelectedIds(prev => 
      prev.includes(pId) ? prev.filter(i => i !== pId) : [...prev, pId]
    );
  };

  const handleSave = () => {
    mutation.mutate(selectedIds);
  };

  const groupedPermissions = allPermissions?.reduce((acc, p) => {
    const group = p.name.split('.')[0];
    if (!acc[group]) acc[group] = [];
    acc[group].push(p);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="admin-rbac">
      <div className="admin-header">
        <div className="flex items-center gap-4">
          <button className="action-btn" onClick={() => navigate('/admin/rbac/roles')}>
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="admin-title">Manage Permissions: {role?.name}</h1>
            <p className="admin-subtitle">Assign functional permissions to this role</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={mutation.isPending}>
          <Save size={18} /> {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="permission-grid mt-8">
        {groupedPermissions && Object.entries(groupedPermissions).map(([group, perms]) => (
          <div key={group} className="permission-group-card">
            <h3 className="permission-group-title">{group.toUpperCase()}</h3>
            <div className="permission-list">
              {perms.map(p => (
                <label key={p.id} className="permission-item">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(p.id)} 
                    onChange={() => togglePermission(p.id)}
                  />
                  <div className="permission-info">
                    <span className="permission-name">{p.name}</span>
                    <span className="permission-desc">{p.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
