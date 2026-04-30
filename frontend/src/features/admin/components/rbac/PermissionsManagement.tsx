import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient } from '../../../../api/axios';
import { unwrap } from '../../../../api/http';

type Permission = { id: string; name: string; description: string };

export const PermissionsManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Permission | null>(null);

  const { data: permissions, isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => unwrap<Permission[]>(await apiClient.get('/permissions'))
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/permissions/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['permissions'] }); toast.success('Permission deleted'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete permission')
  });

  if (isLoading) return <div className="p-8 text-center">Loading permissions...</div>;

  return <div className="admin-rbac">
    <div className="admin-header"><div><h1 className="admin-title">Permission Catalog</h1><p className="admin-subtitle">CRUD permissions used to drive scalable role nav and access.</p></div>
      <button className="btn btn-primary" onClick={() => { setEditing(null); setIsModalOpen(true); }}><Plus size={18} /> Create Permission</button></div>
    <div className="admin-table-container"><table className="admin-table"><thead><tr><th>Name</th><th>Description</th><th className="text-right">Actions</th></tr></thead>
      <tbody>{permissions?.map((p) => <tr key={p.id}><td className="font-medium text-slate-900">{p.name}</td><td className="text-slate-500">{p.description}</td>
        <td className="admin-table-actions"><button className="action-btn" onClick={() => { setEditing(p); setIsModalOpen(true); }}><Edit2 size={16} /></button>
        <button className="action-btn text-red-600 hover:bg-red-50" onClick={() => confirm('Delete this permission?') && deleteMutation.mutate(p.id)}><Trash2 size={16} /></button></td></tr>)}</tbody></table></div>
    {isModalOpen && <PermissionModal permission={editing} onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); queryClient.invalidateQueries({ queryKey: ['permissions'] }); }} />}
  </div>;
};

const PermissionModal: React.FC<{ permission: Permission | null; onClose: () => void; onSuccess: () => void }> = ({ permission, onClose, onSuccess }) => {
  const [name, setName] = useState(permission?.name || '');
  const [description, setDescription] = useState(permission?.description || '');

  const mutation = useMutation({
    mutationFn: (data: { name: string; description: string }) => permission ? apiClient.put(`/permissions/${permission.id}`, data) : apiClient.post('/permissions', data),
    onSuccess: () => { toast.success(`Permission ${permission ? 'updated' : 'created'} successfully`); onSuccess(); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to save permission')
  });

  return <div className="modal-overlay"><div className="modal-content max-w-md"><div className="modal-header"><h2>{permission ? 'Edit Permission' : 'Create Permission'}</h2><button onClick={onClose}><X size={20} /></button></div>
    <form className="modal-form" onSubmit={(e) => { e.preventDefault(); mutation.mutate({ name, description }); }}>
      <div className="form-field"><label className="form-label">Permission Name</label><input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. publications.manage" /></div>
      <div className="form-field"><label className="form-label">Description</label><textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe what this permission allows" /></div>
      <div className="modal-footer"><button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save Permission'}</button></div>
    </form></div></div>;
};
