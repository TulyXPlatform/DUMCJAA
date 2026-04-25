import React, { useState, useMemo } from 'react';
import { Search, X, Newspaper } from 'lucide-react';
import { PostCard, PostCardSkeleton } from './PostCard';
import { CategoryFilter } from './CategoryFilter';
import { STATIC_POSTS } from '../data/posts';
import { Category } from '../types';
import './Blog.css';

const PAGE_SIZE = 6;

export const BlogPage: React.FC = () => {
  const [category, setCategory] = useState<Category>('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Client-side filter + paginate over static data
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return STATIC_POSTS.filter(p => {
      const matchCat = category === 'All' || p.category === category;
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [category, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const featured = STATIC_POSTS.find(p => p.isFeatured);

  const handleCategoryChange = (cat: Category) => { setCategory(cat); setPage(1); };
  const handleSearch = (val: string) => { setSearch(val); setPage(1); };

  return (
    <div className="blog-page">
      {/* Hero */}
      <header className="blog-hero" role="banner">
        <div>
          <h1 className="blog-hero-title">News &amp; Stories</h1>
          <p className="blog-hero-subtitle">
            Alumni achievements, scholarships, research, and community news — all in one place.
          </p>
        </div>

        {/* Search */}
        <div className="blog-search-wrap">
          <Search size={16} className="blog-search-icon" aria-hidden="true" />
          <input
            type="search"
            className="blog-search-input"
            placeholder="Search articles..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            aria-label="Search articles"
          />
          {search && (
            <button className="blog-search-clear" onClick={() => handleSearch('')} aria-label="Clear search">
              <X size={15} />
            </button>
          )}
        </div>
      </header>

      {/* Category Filter */}
      <CategoryFilter active={category} onChange={handleCategoryChange} />

      {/* Featured Hero Post (only when no filter/search active) */}
      {!search && category === 'All' && featured && page === 1 && (
        <section aria-label="Featured article">
          <PostCard post={featured} featured />
        </section>
      )}

      {/* Results Count */}
      {filtered.length > 0 && (
        <p className="blog-result-count" role="status" aria-live="polite">
          {filtered.length} article{filtered.length !== 1 ? 's' : ''}
          {category !== 'All' ? ` in ${category}` : ''}
          {search ? ` matching "${search}"` : ''}
        </p>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="blog-empty-state" role="status">
          <Newspaper size={40} strokeWidth={1.5} aria-hidden="true" />
          <h3>No articles found</h3>
          <p>{search ? `No results for "${search}".` : `No articles in the "${category}" category yet.`}</p>
          <button className="btn btn-primary mt-4" onClick={() => { setSearch(''); setCategory('All'); }}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Grid */}
      {paginated.length > 0 && (
        <section aria-label="Articles list">
          <div className="blog-grid">
            {paginated.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="blog-pagination" aria-label="Article pages">
          <button
            className="pag-btn"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            aria-label="Previous page"
          >
            ← Prev
          </button>
          <span className="blog-page-info" aria-current="page">
            Page {page} of {totalPages}
          </span>
          <button
            className="pag-btn"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            aria-label="Next page"
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
};
