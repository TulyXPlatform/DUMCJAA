import React from 'react';
import { Users, Calendar, Newspaper, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { StatCard } from '../../../components/StatCard';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/axios';

// Quick-stat queries are lightweight and can be computed server-side.
// We fire them in parallel; each has its own loading state.
function useAdminStats() {
  const alumni = useQuery({
    queryKey: ['admin-stat-alumni'],
    queryFn: async () => (await apiClient.get('/alumni', { params: { page: 1, pageSize: 1 } })).data.data,
    staleTime: 5 * 60_000,
  });
  const events = useQuery({
    queryKey: ['admin-stat-events'],
    queryFn: async () => (await apiClient.get('/events', { params: { page: 1, pageSize: 1 } })).data.data,
    staleTime: 5 * 60_000,
  });
  return { alumni, events };
}

export const AdminDashboard: React.FC = () => {
  const { alumni, events } = useAdminStats();

  return (
    <div className="admin-dashboard">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="admin-page-header-badge">
          <span className="live-indicator" aria-hidden="true" />
          Live Data
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <StatCard
          title="Total Alumni"
          value={alumni.data?.totalCount ?? '—'}
          change="Registered members"
          trend="neutral"
          icon={<Users size={22} />}
          accent="blue"
          isLoading={alumni.isLoading}
        />
        <StatCard
          title="Upcoming Events"
          value={events.data?.totalCount ?? '—'}
          change="Scheduled events"
          trend="neutral"
          icon={<Calendar size={22} />}
          accent="violet"
          isLoading={events.isLoading}
        />
        <StatCard
          title="Pending Approvals"
          value="—"
          change="Awaiting review"
          trend="neutral"
          icon={<Clock size={22} />}
          accent="orange"
          isLoading={false}
        />
        <StatCard
          title="Published Posts"
          value="6"
          change="Active articles"
          trend="up"
          icon={<Newspaper size={22} />}
          accent="green"
          isLoading={false}
        />
      </div>

      {/* Quick Actions */}
      <section className="admin-section">
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {[
            { label: 'Approve Pending Alumni', href: '/admin/alumni', icon: <CheckCircle size={18} />, color: '#059669' },
            { label: 'Create New Event', href: '/admin/events', icon: <Calendar size={18} />, color: '#2563eb' },
            { label: 'Publish News Post', href: '/admin/news', icon: <Newspaper size={18} />, color: '#7c3aed' },
            { label: 'View Analytics', href: '/admin/settings', icon: <TrendingUp size={18} />, color: '#ea580c' },
          ].map(action => (
            <a key={action.label} href={action.href} className="quick-action-card">
              <span className="quick-action-icon" style={{ color: action.color }}>{action.icon}</span>
              <span className="quick-action-label">{action.label}</span>
              <span className="quick-action-arrow">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* Activity Feed placeholder */}
      <section className="admin-section">
        <h2 className="admin-section-title">Recent Activity</h2>
        <div className="activity-feed">
          {[
            { icon: <Users size={14} />, text: 'New alumni registration from Farhana Islam', time: '2 min ago', color: '#2563eb' },
            { icon: <CheckCircle size={14} />, text: 'Alumni profile approved — Karim Uddin', time: '15 min ago', color: '#059669' },
            { icon: <Calendar size={14} />, text: 'Event "Annual Reunion 2026" has 45 new registrations', time: '1 hr ago', color: '#7c3aed' },
            { icon: <Newspaper size={14} />, text: 'Blog post "Scholarship 2026" published', time: '3 hrs ago', color: '#ea580c' },
          ].map((item, i) => (
            <div key={i} className="activity-item">
              <div className="activity-dot" style={{ background: item.color, color: item.color }}>
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
