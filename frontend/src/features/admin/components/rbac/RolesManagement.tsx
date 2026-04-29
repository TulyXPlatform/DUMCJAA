import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit2, Trash2, CheckSquare, Plus, X } from 'lucide-react';
import { apiClient } from '../../../../api/axios';
import toast from 'react-hot-toast';

interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}


export const RolesManagement: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await apiClient.get('/roles');
      return res.data.data as Role[];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/roles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete role');
    }
  });

  if (isLoading) return <div className="p-8 text-center">Loading roles...</div>;

  return (
    <div className="admin-rbac">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Role Management</h1>
          <p className="admin-subtitle">Define and manage system roles and their permissions</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingRole(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Create Role
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Description</th>
              <th>Created At</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles?.map(role => (
              <tr key={role.id}>
                <td className="font-medium text-slate-900">{role.name}</td>
                <td className="text-slate-500">{role.description}</td>
                <td className="text-slate-500">{new Date(role.createdAt).toLocaleDateString()}</td>
                <td className="admin-table-actions">
                  <button 
                    className="action-btn" 
                    title="Manage Permissions"
                    onClick={() => navigate(`/admin/rbac/roles/${role.id}/permissions`)}
                  >
                    <CheckSquare size={16} />
                  </button>
                  <button className="action-btn" onClick={() => { setEditingRole(role); setIsModalOpen(true); }}>
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="action-btn text-red-600 hover:bg-red-50" 
                    onClick={() => { if(confirm('Delete this role?')) deleteMutation.mutate(role.id); }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <RoleModal 
          role={editingRole} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); queryClient.invalidateQueries({ queryKey: ['roles'] }); }} 
        />
      )}
    </div>
  );
};

const RoleModal: React.FC<{ role: Role | null, onClose: () => void, onSuccess: () => void }> = ({ role, onClose, onSuccess }) => {
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');

  const mutation = useMutation({
    mutationFn: (data: any) => role ? apiClient.put(`/roles/${role.id}`, data) : apiClient.post('/roles', data),
    onSuccess: () => {
      toast.success(`Role ${role ? 'updated' : 'created'} successfully`);
      onSuccess();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'An error occurred');
    }
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-md">
        <div className="modal-header">
          <h2>{role ? 'Edit Role' : 'Create New Role'}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form className="modal-form" onSubmit={(e) => { e.preventDefault(); mutation.mutate({ name, description }); }}>
          <div className="form-field">
            <label className="form-label">Role Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              placeholder="e.g. Editor"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea 
              className="form-input" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="What can this role do?"
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={mutation.isPending}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
