import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/axios';
import { Link } from 'react-router-dom';
import { Linkedin, Mail } from 'lucide-react';

interface FeaturedAlumnus {
  id: string;
  fullName: string;
  department?: string;
  batch?: string;
  currentCompany?: string;
  currentDesignation?: string;
  profileImageUrl?: string;
  linkedInUrl?: string;
  email: string;
}

const FeaturedAlumnusCard: React.FC<{ alumnus: FeaturedAlumnus }> = ({ alumnus }) => {
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(alumnus.fullName)}&background=2563eb&color=fff&size=128`;
  return (
    <div className="featured-alumni-card">
      <div className="featured-card-inner">
        <img
          src={alumnus.profileImageUrl || avatarUrl}
          alt={alumnus.fullName}
          className="featured-alumni-avatar"
          onError={(e) => { (e.target as HTMLImageElement).src = avatarUrl; }}
        />
        <div className="featured-badge">{alumnus.batch ?? 'Alumni'}</div>
        <h3 className="featured-name">{alumnus.fullName}</h3>
        <p className="featured-designation">
          {alumnus.currentDesignation
            ? `${alumnus.currentDesignation}${alumnus.currentCompany ? ` at ${alumnus.currentCompany}` : ''}`
            : alumnus.department ?? ''}
        </p>
        <div className="featured-social">
          {alumnus.linkedInUrl && (
            <a href={alumnus.linkedInUrl} target="_blank" rel="noopener noreferrer" className="social-icon-btn">
              <Linkedin size={16} />
            </a>
          )}
          <a href={`mailto:${alumnus.email}`} className="social-icon-btn">
            <Mail size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

// Skeleton card shown while loading
const SkeletonCard: React.FC = () => (
  <div className="featured-alumni-card skeleton-card">
    <div className="skeleton-avatar"></div>
    <div className="skeleton-line w-half mt-3"></div>
    <div className="skeleton-line w-full mt-2"></div>
  </div>
);

export const FeaturedAlumniSection: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['featured-alumni'],
    queryFn: async () => {
      const res = await apiClient.get('/alumni', { params: { page: 1, pageSize: 3 } });
      return res.data.data.items as FeaturedAlumnus[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes — homepage data doesn't need aggressive refetching
  });

  return (
    <section className="home-section bg-surface">
      <div className="container">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">Our Community</span>
            <h2 className="section-title">Featured Alumni</h2>
          </div>
          <Link to="/alumni" className="view-all-link">Browse Full Directory →</Link>
        </div>

        {isError ? (
          <p className="section-error">Could not load alumni. Please try again later.</p>
        ) : (
          <div className="three-col-grid">
            {isLoading
              ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
              : data?.map(a => <FeaturedAlumnusCard key={a.id} alumnus={a} />)
            }
          </div>
        )}
      </div>
    </section>
  );
};
