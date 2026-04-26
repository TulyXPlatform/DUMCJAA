import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/axios';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Search, UserPlus } from 'lucide-react';
import { DataTable, type Column } from '../../../components/DataTable';
import { getHttpErrorMessage } from '../../../lib/httpError';

interface Alumnus {
  id: string;
  fullName: string;
  email: string;
  batch?: string;
  department?: string;
  isApproved: boolean;
  createdAt: string;
}

const COLUMNS: Column<Alumnus>[] = [
  {
    key: 'fullName',
    header: 'Member',
    width: '260px',
    render: row => (
      <div className="dt-member-cell">
        <div
          className="dt-avatar"
          style={{ background: `hsl(${row.fullName.charCodeAt(0) * 15}, 60%, 55%)` }}
        >
          {row.fullName.charAt(0)}
        </div>
        <div>
          <p className="dt-cell-primary">{row.fullName}</p>
          <p className="dt-cell-secondary">{row.department ?? '—'}</p>
        </div>
      </div>
    ),
  },
  { key: 'email', header: 'Email', render: row => <span className="dt-cell-muted">{row.email}</span> },
  { key: 'batch', header: 'Batch', width: '100px', align: 'center', render: row => row.batch ?? '—' },
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
    render: row => new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  },
  {
    key: 'actions',
    header: 'Actions',
    width: '140px',
    align: 'right',
    render: () => null, // Populated via the wrapper below
  },
];

export const AdminAlumni: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-alumni', page, search],
    queryFn: async () => {
      const res = await apiClient.get('/alumni', {
        params: { page, pageSize: 10, search: search || undefined },
      });
      return res.data.data;
    },
    placeholderData: prev => prev,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isApproved }: { id: string; isApproved: boolean }) => {
      await apiClient.patch(`/alumni/${id}/approve`, { isApproved });
    },
    onSuccess: (_, { isApproved }) => {
      toast.success(`Alumnus ${isApproved ? 'approved' : 'approval revoked'}`);
      queryClient.invalidateQueries({ queryKey: ['admin-alumni'] });
    },
    onError: (err: unknown) => toast.error(getHttpErrorMessage(err, 'Action failed')),
  });

  // Inject action column render with closure
  const columnsWithActions: Column<Alumnus>[] = COLUMNS.map(col =>
    col.key !== 'actions'
      ? col
      : {
          ...col,
          render: (row: Alumnus) =>
            row.isApproved ? (
              <button
                className="admin-action-btn btn-danger-ghost"
                onClick={() => toggleMutation.mutate({ id: row.id, isApproved: false })}
                disabled={toggleMutation.isPending}
                title="Revoke approval"
              >
                <XCircle size={14} /> Revoke
              </button>
            ) : (
              <button
                className="admin-action-btn btn-success-ghost"
                onClick={() => toggleMutation.mutate({ id: row.id, isApproved: true })}
                disabled={toggleMutation.isPending}
                title="Approve member"
              >
                <CheckCircle size={14} /> Approve
              </button>
            ),
        }
  );

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-page-title">Alumni Management</h1>
          <p className="admin-page-subtitle">Review, approve, and manage registered alumni.</p>
        </div>
        <button className="btn btn-primary admin-create-btn">
          <UserPlus size={16} /> Add Alumni
        </button>
      </div>

      {/* Search toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Search size={15} className="admin-search-icon" />
          <input
            className="admin-search-input"
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="admin-toolbar-stats">
          <span className="admin-badge badge-info">{data?.totalCount ?? 0} total</span>
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
        emptyMessage="No alumni records found."
      />
    </div>
  );
};
