import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';
import type { PostSummary } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  Achievement:  'cat--achievement',
  Announcement: 'cat--announcement',
  Community:    'cat--community',
  Scholarship:  'cat--scholarship',
  Research:     'cat--research',
  Interview:    'cat--interview',
};

const COVER_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
];

function gradient(id: string) {
  return COVER_GRADIENTS[id.charCodeAt(0) % COVER_GRADIENTS.length];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

interface PostCardProps {
  post: PostSummary;
  featured?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, featured = false }) => (
  <article className={`post-card ${featured ? 'post-card--featured' : ''}`}>
    <Link to={`/news/${post.slug}`} className="post-card-link" aria-label={`Read: ${post.title}`}>

      {/* Cover */}
      <div
        className="post-card-cover"
        style={
          post.coverImageUrl
            ? { backgroundImage: `url(${post.coverImageUrl})` }
            : { background: gradient(post.id) }
        }
        aria-hidden="true"
      >
        {post.isFeatured && <span className="post-featured-badge">Featured</span>}
      </div>

      {/* Body */}
      <div className="post-card-body">
        <div className="post-card-meta">
          <span className={`post-category-chip ${CATEGORY_COLORS[post.category] ?? ''}`}>
            {post.category}
          </span>
          <span className="post-meta-item">
            <Calendar size={12} aria-hidden="true" />
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </span>
          <span className="post-meta-item">
            <Clock size={12} aria-hidden="true" />
            {post.readTimeMinutes} min read
          </span>
        </div>

        <h2 className="post-card-title">{post.title}</h2>
        <p className="post-card-excerpt">{post.excerpt}</p>

        {post.tags.length > 0 && (
          <div className="post-card-tags" aria-label="Tags">
            <Tag size={11} aria-hidden="true" />
            {post.tags.slice(0, 3).map(t => (
              <span key={t} className="post-tag">{t}</span>
            ))}
          </div>
        )}

        <div className="post-card-author">
          <div className="post-author-avatar" aria-hidden="true">
            {post.author.avatarUrl
              ? <img src={post.author.avatarUrl} alt={post.author.name} />
              : post.author.name.charAt(0)}
          </div>
          <span className="post-author-name">{post.author.name}</span>
          <span className="post-read-more">Read article →</span>
        </div>
      </div>
    </Link>
  </article>
);

import { Skeleton } from '../../../components/Skeleton';

export const PostCardSkeleton: React.FC = () => (
  <div className="post-card">
    <Skeleton height={200} />
    <div className="post-card-body" style={{ gap: '0.75rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Skeleton width="40px" height={20} />
        <Skeleton width="100px" height={16} />
      </div>
      <Skeleton width="95%" height={24} style={{ marginTop: '0.25rem' }} />
      <Skeleton width="100%" height={16} />
      <Skeleton width="100%" height={16} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
        <Skeleton variant="circle" width={28} height={28} />
        <Skeleton width="80px" height={16} />
      </div>
    </div>
  </div>
);
