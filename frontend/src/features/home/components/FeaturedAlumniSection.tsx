import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/axios';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

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
              <LinkedinIcon size={16} />
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
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
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
          <div className="section-error-card">
            <h3>Couldn’t load featured alumni</h3>
            <p>There was a temporary connection issue. Please try again.</p>
            <button className="btn btn-outline" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'Retrying...' : 'Retry'}
            </button>
          </div>
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
