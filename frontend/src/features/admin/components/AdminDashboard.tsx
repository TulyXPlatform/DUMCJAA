import React from 'react';
import { Users, Calendar, Newspaper, CheckCircle, Clock, Shield, UserCog } from 'lucide-react';
import { StatCard } from '../../../components/StatCard';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/axios';
import { useAuthStore } from '../../auth/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

function useAdminStats() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.roles.includes('SuperAdmin');

  const alumni = useQuery({
    queryKey: ['admin-stat-alumni'],
    queryFn: async () => (await apiClient.get('/alumni', { params: { page: 1, pageSize: 1 } })).data.data,
    staleTime: 5 * 60_000,
  });

  const pendingAlumni = useQuery({
    queryKey: ['admin-stat-pending'],
    queryFn: async () => (await apiClient.get('/alumni', { params: { page: 1, pageSize: 1, isApproved: false } })).data.data,
    staleTime: 5 * 60_000,
  });

  const events = useQuery({
    queryKey: ['admin-stat-events'],
    queryFn: async () => (await apiClient.get('/events', { params: { page: 1, pageSize: 1 } })).data.data,
    staleTime: 5 * 60_000,
  });

  const users = useQuery({
    queryKey: ['admin-stat-users'],
    queryFn: async () => (await apiClient.get('/users')).data.data,
    enabled: isSuperAdmin,
    staleTime: 5 * 60_000,
  });

  return { alumni, pendingAlumni, events, users };
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { alumni, pendingAlumni, events, users } = useAdminStats();

  const isSuperAdmin = user?.roles.includes('SuperAdmin');
  const isAdmin = user?.roles.includes('Admin') || isSuperAdmin;

  const activityItems = [
    { icon: <Users size={14} />, text: 'New alumni registration from Farhana Islam', time: '2 min ago', color: '#2563eb' },
    { icon: <CheckCircle size={14} />, text: 'Alumni profile approved — Karim Uddin', time: '15 min ago', color: '#059669' },
    { icon: <Calendar size={14} />, text: 'Event "Annual Reunion 2026" has 45 new registrations', time: '1 hr ago', color: '#7c3aed' },
    ...(isSuperAdmin ? [{ icon: <Shield size={14} />, text: 'Security Policy updated by System', time: '5 hrs ago', color: '#dc2626' }] : []),
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Admin Overview</h1>
          <p className="admin-page-subtitle">Welcome, {user?.fullName}. Here is your command center.</p>
        </div>
        <div className="admin-page-header-badge">
          <span className="live-indicator" aria-hidden="true" />
          System Active
        </div>
      </div>

      {isSuperAdmin && (
        <div className="superadmin-navbar mb-8">
          <div className="superadmin-navbar-inner bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-lg">
                <Shield size={20} className="text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">System Administration</h3>
                <p className="text-xs text-slate-400">Manage global security and permissions</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/rbac/roles" className="btn btn-sm btn-outline border-slate-700 text-white hover:bg-slate-800">
                Manage Roles
              </Link>
              <Link to="/admin/rbac/users" className="btn btn-sm btn-primary">
                Assign Roles
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="stat-grid">
        <StatCard
          title="Total Alumni"
          value={alumni.data?.totalCount ?? '0'}
          change="Public members"
          trend="neutral"
          icon={<Users size={22} />}
          accent="blue"
          isLoading={alumni.isLoading}
          onClick={() => navigate('/admin/alumni')}
        />
        <StatCard
          title="Upcoming Events"
          value={events.data?.totalCount ?? '0'}
          change="Scheduled"
          trend="neutral"
          icon={<Calendar size={22} />}
          accent="violet"
          isLoading={events.isLoading}
          onClick={() => navigate('/admin/events')}
        />
        {isSuperAdmin && (
          <StatCard
            title="System Users"
            value={users.data?.length ?? '0'}
            change="Active accounts"
            trend="up"
            icon={<UserCog size={22} />}
            accent="orange"
            isLoading={users.isLoading}
            onClick={() => navigate('/admin/rbac/users')}
          />
        )}
        <StatCard
          title="Pending Reviews"
          value={pendingAlumni.data?.totalCount ?? '0'}
          change="Awaiting action"
          trend="neutral"
          icon={<Clock size={22} />}
          accent="orange"
          isLoading={pendingAlumni.isLoading}
          onClick={() => navigate('/admin/alumni?filter=pending')}
        />
      </div>

      <div className="admin-content-grid">
        <section className="admin-section">
          <h2 className="admin-section-title">Management Quick Actions</h2>
          <div className="quick-actions-grid">
            {isAdmin && (
              <Link to="/admin/alumni" className="quick-action-card">
                <span className="quick-action-icon" style={{ color: '#059669' }}><CheckCircle size={18} /></span>
                <span className="quick-action-label">Approve Alumni</span>
                <span className="quick-action-arrow">→</span>
              </Link>
            )}
            <Link to="/admin/events" className="quick-action-card">
              <span className="quick-action-icon" style={{ color: '#2563eb' }}><Calendar size={18} /></span>
              <span className="quick-action-label">Create Event</span>
              <span className="quick-action-arrow">→</span>
            </Link>
            <Link to="/admin/news" className="quick-action-card">
              <span className="quick-action-icon" style={{ color: '#7c3aed' }}><Newspaper size={18} /></span>
              <span className="quick-action-label">New Announcement</span>
              <span className="quick-action-arrow">→</span>
            </Link>
            {isSuperAdmin && (
              <Link to="/admin/rbac/users" className="quick-action-card">
                <span className="quick-action-icon" style={{ color: '#ea580c' }}><Shield size={18} /></span>
                <span className="quick-action-label">Access Control</span>
                <span className="quick-action-arrow">→</span>
              </Link>
            )}
          </div>
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">System Status</h2>
          <div className="system-status-card card">
            <div className="status-item">
              <span className="status-label">Database</span>
              <span className="status-value success">Operational</span>
            </div>
            <div className="status-item">
              <span className="status-label">Email Service</span>
              <span className="status-value success">Active</span>
            </div>
            <div className="status-item">
              <span className="status-label">API Version</span>
              <span className="status-value">v1.0.4 (Stable)</span>
            </div>
          </div>
        </section>
      </div>

      <section className="admin-section">
        <h2 className="admin-section-title">Recent System Activity</h2>
        <div className="activity-feed card">
          {activityItems.map((item, i) => (
            <div key={i} className="activity-item">
              <div className="activity-dot" style={{ background: item.color, color: '#fff' }}>
                {item.icon}
              </div>
              <div className="activity-body">
                <p className="activity-text">{item.text}</p>
                <p className="activity-time">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
