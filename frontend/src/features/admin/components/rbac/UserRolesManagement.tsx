import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Search, X } from 'lucide-react';
import { apiClient } from '../../../../api/axios';
import toast from 'react-hot-toast';

interface User {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
}

interface Role {
  id: string;
  name: string;
}

export const UserRolesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await apiClient.get('/users');
      return res.data.data as User[];
    }
  });

  const filteredUsers = users?.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openRolesModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="p-8 text-center">Loading users...</div>;

  return (
    <div className="admin-rbac">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">User Roles</h1>
          <p className="admin-subtitle">Assign and manage system roles for individual users</p>
        </div>
      </div>

      <div className="admin-toolbar mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="form-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map(user => (
              <tr key={user.id}>
                <td className="font-medium text-slate-900">{user.fullName}</td>
                <td className="text-slate-500">{user.email}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="admin-table-actions">
                  <button 
                    className="btn btn--outline btn--sm flex items-center gap-2"
                    onClick={() => openRolesModal(user)}
                  >
                    <Shield size={14} /> Manage Roles
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers?.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-slate-500">No users found matching "{searchTerm}"</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedUser && (
        <UserRolesModal 
          user={selectedUser} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

const UserRolesModal: React.FC<{ user: User, onClose: () => void }> = ({ user, onClose }) => {
  const queryClient = useQueryClient();
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  const { data: allRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await apiClient.get('/roles');
      return res.data.data as Role[];
    }
  });

  const { isLoading } = useQuery({
    queryKey: ['user-roles', user.id],
    queryFn: async () => {
      const res = await apiClient.get(`/users/${user.id}/roles`);
      const roles = res.data.data as Role[];
      setSelectedRoleIds(roles.map(r => r.id));
      return roles;
    }
  });

  const mutation = useMutation({
    mutationFn: (roleIds: string[]) => apiClient.put(`/users/${user.id}/roles`, { roleIds }),
    onSuccess: () => {
      toast.success("User roles updated successfully");
      queryClient.invalidateQueries({ queryKey: ['user-roles', user.id] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update user roles');
    }
  });

  const handleToggleRole = (roleId: string) => {
    setSelectedRoleIds(prev => 
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSave = () => {
    mutation.mutate(selectedRoleIds);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-md">
        <div className="modal-header">
          <h2>Manage Roles for {user.fullName}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        
        {isLoading ? (
          <div className="p-4 text-center">Loading current roles...</div>
        ) : (
          <div className="modal-body py-4 space-y-3">
            <p className="text-sm text-slate-500 mb-4">Select the roles to assign to {user.email}:</p>
            {allRoles?.map(role => (
              <label key={role.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-primary-600 rounded"
                  checked={selectedRoleIds.includes(role.id)}
                  onChange={() => handleToggleRole(role.id)}
                />
                <span className="font-medium">{role.name}</span>
              </label>
            ))}
          </div>
        )}
        
        <div className="modal-footer mt-6">
          <button className="btn btn--outline" onClick={onClose} disabled={mutation.isPending}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSave} disabled={mutation.isPending || isLoading}>
            {mutation.isPending ? 'Saving...' : 'Save Assignments'}
          </button>
        </div>
      </div>
    </div>
  );
};
