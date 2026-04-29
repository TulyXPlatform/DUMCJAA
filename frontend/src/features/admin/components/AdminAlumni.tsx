import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/axios';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Search, UserPlus, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '../../../components/DataTable';
import { getHttpErrorMessage } from '../../../lib/httpError';
import { useSearchParams } from 'react-router-dom';

interface Alumnus {
  id: string;
  fullName: string;
  email: string;
  studentId?: string;
  batch?: string;
  department?: string;
  isApproved: boolean;
  createdAt: string;
}

const COLUMNS: Column<Alumnus>[] = [
  {
    key: 'fullName',
    header: 'Member',
    width: '280px',
    render: row => (
      <div className="dt-member-cell">
        <div
          className="dt-avatar"
          style={{ background: `hsl(${row.fullName.charCodeAt(0) * 20}, 65%, 50%)` }}
        >
          {row.fullName.charAt(0)}
        </div>
        <div>
          <p className="dt-cell-primary">{row.fullName}</p>
          <p className="dt-cell-secondary text-xs">{row.studentId || 'No ID'}</p>
        </div>
      </div>
    ),
  },
  { key: 'department', header: 'Dept', width: '150px', render: row => <span className="text-sm">{row.department ?? '—'}</span> },
  { key: 'batch', header: 'Batch', width: '100px', align: 'center', render: row => <span className="font-medium text-slate-700">{row.batch ?? '—'}</span> },
  {
    key: 'isApproved',
    header: 'Status',
    width: '120px',
    align: 'center',
    render: row => (
      <span className={`admin-badge ${row.isApproved ? 'badge-success' : 'badge-warning'}`}>
        {row.isApproved ? 'Approved' : 'Pending'}
      </span>
    ),
  },
  {
    key: 'createdAt',
    header: 'Joined',
    width: '120px',
    render: row => new Date(row.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  },
  {
    key: 'actions',
    header: 'Actions',
    width: '180px',
    align: 'right',
    render: () => null,
  },
];

export const AdminAlumni: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    const f = searchParams.get('filter');
    if (f === 'pending' || f === 'approved' || f === 'all') {
      setFilter(f as any);
    }
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-alumni', page, search, filter],
    queryFn: async () => {
      const isApprovedParam = filter === 'all' ? undefined : filter === 'approved';
      const res = await apiClient.get('/alumni', {
        params: { 
          page, 
          pageSize: 10, 
          search: search || undefined,
          isApproved: isApprovedParam
        },
      });
      return res.data.data;
    },
    placeholderData: (prev) => prev,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isApproved }: { id: string; isApproved: boolean }) => {
      await apiClient.patch(`/alumni/${id}/approve`, { isApproved });
    },
    onSuccess: (_, { isApproved }) => {
      toast.success(isApproved ? 'Member approved successfully' : 'Approval revoked');
      queryClient.invalidateQueries({ queryKey: ['admin-alumni'] });
    },
    onError: (err: unknown) => toast.error(getHttpErrorMessage(err, 'Action failed')),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!window.confirm('Are you sure you want to delete/reject this registration? This action cannot be undone.')) return;
      await apiClient.delete(`/alumni/${id}`);
    },
    onSuccess: () => {
      toast.success('Registration removed');
      queryClient.invalidateQueries({ queryKey: ['admin-alumni'] });
    },
    onError: (err: unknown) => toast.error(getHttpErrorMessage(err, 'Deletion failed')),
  });

  const columnsWithActions: Column<Alumnus>[] = COLUMNS.map(col =>
    col.key !== 'actions'
      ? col
      : {
          ...col,
          render: (row: Alumnus) => (
            <div className="flex justify-end gap-2">
              {row.isApproved ? (
                <button
                  className="admin-action-btn text-amber-600 hover:bg-amber-50"
                  onClick={() => toggleMutation.mutate({ id: row.id, isApproved: false })}
                  disabled={toggleMutation.isPending}
                  title="Revoke approval"
                >
                  <XCircle size={16} />
                </button>
              ) : (
                <button
                  className="admin-action-btn text-green-600 hover:bg-green-50"
                  onClick={() => toggleMutation.mutate({ id: row.id, isApproved: true })}
                  disabled={toggleMutation.isPending}
                  title="Approve member"
                >
                  <CheckCircle size={16} />
                </button>
              )}
              <button
                className="admin-action-btn text-red-600 hover:bg-red-50"
                onClick={() => deleteMutation.mutate(row.id)}
                disabled={deleteMutation.isPending}
                title="Reject/Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ),
        }
  );

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-page-title">Alumni Directory</h1>
          <p className="admin-page-subtitle">Manage member verifications and information updates.</p>
        </div>
        <div className="flex gap-3">
          <select 
            className="admin-filter-select" 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Only</option>
            <option value="approved">Approved Only</option>
          </select>
          <button className="btn btn-primary admin-create-btn">
            <UserPlus size={16} /> Add Alumnus
          </button>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Search size={15} className="admin-search-icon" />
          <input
            className="admin-search-input"
            type="text"
            placeholder="Search by name, ID, or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="admin-toolbar-stats">
          <span className="text-sm text-slate-500">Showing {data?.items.length ?? 0} of {data?.totalCount ?? 0} members</span>
        </div>
      </div>

      <DataTable<Alumnus>
        columns={columnsWithActions}
        data={data?.items ?? []}
        isLoading={isLoading}
        page={page}
        pageSize={10}
        totalCount={data?.totalCount ?? 0}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        emptyMessage="No alumni registrations found for this criteria."
      />
    </div>
  );
};
