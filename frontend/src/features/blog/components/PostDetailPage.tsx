import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react';
import { getPostBySlug, STATIC_POSTS } from '../data/posts';
import { PostCard } from './PostCard';
import './Blog.css';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function estimateReadTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export const PostDetailPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/news" replace />;

  // Related posts: same category, exclude current
  const related = STATIC_POSTS
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 2);

  const readTime = post.readTimeMinutes || estimateReadTime(post.content);

  return (
    <article className="post-detail" aria-label={post.title}>
      {/* Back link */}
      <nav aria-label="Breadcrumb" className="post-detail-breadcrumb">
        <Link to="/news" className="post-back-link">
          <ArrowLeft size={15} aria-hidden="true" /> News &amp; Stories
        </Link>
      </nav>

      {/* Cover */}
      <div
        className="post-detail-cover"
        style={
          post.coverImageUrl
            ? { backgroundImage: `url(${post.coverImageUrl})` }
            : { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
        }
        role="img"
        aria-label={`Cover image for: ${post.title}`}
      />

      {/* Header */}
      <header className="post-detail-header">
        <div className="post-detail-meta">
          <span className={`post-category-chip cat--${post.category.toLowerCase()}`}>{post.category}</span>
          <span className="post-meta-item">
            <Calendar size={13} aria-hidden="true" />
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </span>
          <span className="post-meta-item">
            <Clock size={13} aria-hidden="true" />
            {readTime} min read
          </span>
        </div>

        <h1 className="post-detail-title">{post.title}</h1>
        <p className="post-detail-excerpt">{post.excerpt}</p>

        <div className="post-detail-author">
          <div className="post-author-avatar post-author-avatar--lg" aria-hidden="true">
            {post.author.avatarUrl
              ? <img src={post.author.avatarUrl} alt="" />
              : <User size={20} />}
          </div>
          <div>
            <p className="post-author-name-lg">{post.author.name}</p>
            {post.author.role && <p className="post-author-role">{post.author.role}</p>}
          </div>
        </div>
      </header>

      {/* Article Body — rendered as HTML from CMS/static store */}
      <div
        className="post-detail-body prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
        aria-label="Article body"
      />

      {/* Tags */}
      {post.tags.length > 0 && (
        <footer className="post-detail-footer">
          <div className="post-detail-tags" aria-label="Article tags">
            <Tag size={14} aria-hidden="true" />
            {post.tags.map(t => <span key={t} className="post-tag">{t}</span>)}
          </div>
        </footer>
      )}

      {/* Related Posts */}
      {related.length > 0 && (
        <aside className="post-related" aria-label="Related articles">
          <h2 className="post-related-title">Related Articles</h2>
          <div className="post-related-grid">
            {related.map(r => <PostCard key={r.id} post={r} />)}
          </div>
        </aside>
      )}
    </article>
  );
};
