import React from 'react';
import { Skeleton } from './Skeleton';

// Reusable stat card for dashboard KPIs
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;       // e.g. "+12% from last month"
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  accent: 'blue' | 'green' | 'violet' | 'orange';
  isLoading?: boolean;
  onClick?: () => void;
}

const ACCENT_MAP = {
  blue:   { bg: '#eff6ff', icon: '#2563eb', border: '#bfdbfe' },
  green:  { bg: '#ecfdf5', icon: '#059669', border: '#a7f3d0' },
  violet: { bg: '#f5f3ff', icon: '#7c3aed', border: '#ddd6fe' },
  orange: { bg: '#fff7ed', icon: '#ea580c', border: '#fed7aa' },
};

export const StatCard: React.FC<StatCardProps> = ({
  title, value, change, trend = 'neutral', icon, accent, isLoading, onClick
}) => {
  const colors = ACCENT_MAP[accent];
  return (
    <div 
      className={`stat-card-admin ${onClick ? 'clickable' : ''}`} 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-card-inner">
        <div className="stat-card-text">
          <p className="stat-card-title">{title}</p>
          {isLoading
            ? <Skeleton width={80} height={32} style={{ marginTop: '0.25rem' }} />
            : <p className="stat-card-value">{value}</p>}
          {change && !isLoading && (
            <p className={`stat-card-change ${trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : ''}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {change}
            </p>
          )}
        </div>
        <div
          className="stat-card-icon-wrap"
          style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
        >
          <span style={{ color: colors.icon }}>{icon}</span>
        </div>
      </div>
    </div>
  );
};
