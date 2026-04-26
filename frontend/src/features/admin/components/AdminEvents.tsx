import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Calendar, MapPin, Users, Edit2, Trash2, Search } from 'lucide-react';
import { DataTable, type Column } from '../../../components/DataTable';
import { EventFormModal } from './EventFormModal';
import { type Event } from '../../events/types';
import { getHttpErrorMessage } from '../../../lib/httpError';



export const AdminEvents: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Event | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-events', page, search],
    queryFn: async () => {
      const res = await apiClient.get('/events', {
        params: { page, pageSize: 10, search: search || undefined },
      });
      return res.data.data;
    },
    placeholderData: prev => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiClient.delete(`/events/${id}`); },
    onSuccess: () => {
      toast.success('Event deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    },
    onError: (err: unknown) => toast.error(getHttpErrorMessage(err, 'Delete failed')),
  });

  const handleEdit = (event: Event) => { setEditTarget(event); setModalOpen(true); };
  const handleCreate = () => { setEditTarget(null); setModalOpen(true); };
  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    deleteMutation.mutate(id);
  };

  const COLUMNS: Column<Event>[] = [
    {
      key: 'title',
      header: 'Event',
      render: row => (
        <div>
          <p className="dt-cell-primary">{row.title}</p>
          <span className="dt-cell-secondary">
            <MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} />
            {row.location}
          </span>
        </div>
      ),
    },
    {
      key: 'eventDate',
      header: 'Date',
      width: '150px',
      render: row => (
        <span className="dt-date-cell">
          <Calendar size={13} />
          {new Date(row.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'currentRegistrationsCount',
      header: 'Registrations',
      width: '150px',
      align: 'center',
      render: row => (
        <div className="dt-capacity-cell">
          <Users size={13} />
          <span>{row.currentRegistrationsCount}</span>
          {row.maxAttendees && <span className="dt-capacity-max">/ {row.maxAttendees}</span>}
          {row.isFull && <span className="admin-badge badge-danger">Full</span>}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '120px',
      align: 'right',
      render: row => (
        <div className="dt-actions">
          <button className="admin-icon-btn" onClick={() => handleEdit(row)} title="Edit event" aria-label="Edit">
            <Edit2 size={15} />
          </button>
          <button
            className="admin-icon-btn admin-icon-btn--danger"
            onClick={() => handleDelete(row.id)}
            disabled={deleteMutation.isPending}
            title="Delete event"
            aria-label="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-page-title">Event Management</h1>
          <p className="admin-page-subtitle">Create, edit, and manage alumni events.</p>
        </div>
        <button className="btn btn-primary admin-create-btn" onClick={handleCreate}>
          <Plus size={16} /> New Event
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Search size={15} className="admin-search-icon" />
          <input
            className="admin-search-input"
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <DataTable<Event>
        columns={COLUMNS}
        data={data?.items ?? []}
        isLoading={isLoading}
        page={page}
        pageSize={10}
        totalCount={data?.totalCount ?? 0}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        emptyMessage="No events found. Create your first event."
      />

      <EventFormModal
        isOpen={modalOpen}
        event={editTarget}
        onClose={() => setModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['admin-events'] })}
      />
    </div>
  );
};
