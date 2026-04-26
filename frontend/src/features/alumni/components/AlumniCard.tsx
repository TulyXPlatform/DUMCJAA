import React from 'react';
import { Mail, Building, GraduationCap } from 'lucide-react';
import type { Alumnus } from '../types';

const LinkedinIcon = ({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface AlumniCardProps {
  alumnus: Alumnus;
  viewMode: 'grid' | 'list';
}

export const AlumniCard: React.FC<AlumniCardProps> = ({ alumnus, viewMode }) => {
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(alumnus.fullName)}&background=2563eb&color=fff&size=128&bold=true`;

  if (viewMode === 'list') {
    return (
      <div className="alumni-list-row card">
        <img
          src={alumnus.profileImageUrl || avatarUrl}
          alt={alumnus.fullName}
          className="alumni-list-avatar"
          onError={e => { (e.target as HTMLImageElement).src = avatarUrl; }}
        />
        <div className="alumni-list-body">
          <div className="alumni-list-main">
            <h3 className="alumni-list-name">{alumnus.fullName}</h3>
            {alumnus.currentDesignation && alumnus.currentCompany && (
              <p className="alumni-list-role">
                <Building size={13} />
                {alumnus.currentDesignation} at {alumnus.currentCompany}
              </p>
            )}
          </div>
          <div className="alumni-list-meta">
            {alumnus.department && (
              <span className="alumni-meta-chip">
                <GraduationCap size={12} /> {alumnus.department}
              </span>
            )}
            {alumnus.batch && (
              <span className="alumni-meta-chip alumni-meta-chip--primary">
                Batch {alumnus.batch}
              </span>
            )}
          </div>
        </div>
        <div className="alumni-list-actions">
          {alumnus.linkedInUrl && (
            <a href={alumnus.linkedInUrl} target="_blank" rel="noopener noreferrer" className="alumni-icon-btn" aria-label="LinkedIn">
              <LinkedinIcon size={16} />
            </a>
          )}
          <a href={`mailto:${alumnus.email}`} className="alumni-icon-btn" aria-label="Email">
            <Mail size={16} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="alumni-grid-card card">
      <div className="alumni-grid-card-inner">
        <img
          src={alumnus.profileImageUrl || avatarUrl}
          alt={alumnus.fullName}
          className="alumni-grid-avatar"
          onError={e => { (e.target as HTMLImageElement).src = avatarUrl; }}
        />
        <div className="alumni-grid-badges">
          {alumnus.batch && (
            <span className="alumni-meta-chip alumni-meta-chip--primary">Batch {alumnus.batch}</span>
          )}
        </div>
        <h3 className="alumni-grid-name">{alumnus.fullName}</h3>
        {alumnus.department && (
          <p className="alumni-grid-dept">{alumnus.department}</p>
        )}
        {alumnus.currentDesignation && (
          <p className="alumni-grid-role">
            <Building size={12} />
            {alumnus.currentDesignation}
            {alumnus.currentCompany ? ` · ${alumnus.currentCompany}` : ''}
          </p>
        )}
        <div className="alumni-grid-actions">
          {alumnus.linkedInUrl && (
            <a href={alumnus.linkedInUrl} target="_blank" rel="noopener noreferrer" className="alumni-icon-btn" aria-label="LinkedIn">
              <LinkedinIcon size={15} />
            </a>
          )}
          <a href={`mailto:${alumnus.email}`} className="alumni-icon-btn alumni-icon-btn--primary" aria-label="Email">
            <Mail size={15} /> Contact
          </a>
        </div>
      </div>
    </div>
  );
};

import { Skeleton } from '../../../components/Skeleton';

/** Skeleton card for loading state — matches both grid and list modes */
export const AlumniCardSkeleton: React.FC<{ viewMode: 'grid' | 'list' }> = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="alumni-list-row card" style={{ border: 'none', background: '#fff' }}>
        <Skeleton variant="circle" width={56} height={56} />
        <div className="alumni-list-body">
          <Skeleton width="40%" height={20} />
          <Skeleton width="70%" height={16} style={{ marginTop: '0.5rem' }} />
        </div>
      </div>
    );
  }
  return (
    <div className="alumni-grid-card card" style={{ textAlign: 'center' }}>
      <Skeleton variant="circle" width={80} height={80} style={{ margin: '0 auto' }} />
      <Skeleton width="60%" height={20} style={{ margin: '1rem auto 0.5rem' }} />
      <Skeleton width="80%" height={16} style={{ margin: '0 auto 0.5rem' }} />
      <Skeleton width="40%" height={16} style={{ margin: '0 auto' }} />
    </div>
  );
};
