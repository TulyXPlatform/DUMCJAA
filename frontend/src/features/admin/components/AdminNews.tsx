import React, { useState } from 'react';
import { Plus, Edit2, Eye, Search } from 'lucide-react';
import { DataTable, Column } from '../../../components/DataTable';
import { STATIC_POSTS } from '../../blog/data/posts';
import { PostSummary } from '../../blog/types';

export const AdminNews: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const PAGE_SIZE = 8;

  const filtered = STATIC_POSTS.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const COLUMNS: Column<PostSummary>[] = [
    {
      key: 'title',
      header: 'Article',
      render: row => (
        <div>
          <p className="dt-cell-primary">{row.title}</p>
          <p className="dt-cell-secondary">{row.excerpt.slice(0, 80)}…</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      width: '140px',
      render: row => <span className={`admin-badge cat-badge cat-badge--${row.category.toLowerCase()}`}>{row.category}</span>,
    },
    {
      key: 'author',
      header: 'Author',
      width: '140px',
      render: row => <span className="dt-cell-muted">{row.author.name}</span>,
    },
    {
      key: 'publishedAt',
      header: 'Published',
      width: '130px',
      render: row => new Date(row.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    },
    {
      key: 'readTimeMinutes',
      header: 'Read Time',
      width: '100px',
      align: 'center',
      render: row => `${row.readTimeMinutes} min`,
    },
    {
      key: 'actions',
      header: '',
      width: '100px',
      align: 'right',
      render: row => (
        <div className="dt-actions">
          <a
            href={`/news/${row.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-icon-btn"
            title="Preview"
            aria-label="Preview post"
          >
            <Eye size={15} />
          </a>
          <button className="admin-icon-btn" title="Edit" aria-label="Edit post">
            <Edit2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-page-title">News Management</h1>
          <p className="admin-page-subtitle">Manage articles, announcements, and stories.</p>
        </div>
        <button className="btn btn-primary admin-create-btn">
          <Plus size={16} /> New Article
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Search size={15} className="admin-search-icon" />
          <input
            className="admin-search-input"
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <span className="admin-badge badge-info">{filtered.length} articles</span>
      </div>

      <DataTable<PostSummary>
        columns={COLUMNS}
        data={paginated}
        isLoading={false}
        page={page}
        pageSize={PAGE_SIZE}
        totalCount={filtered.length}
        totalPages={Math.ceil(filtered.length / PAGE_SIZE)}
        onPageChange={setPage}
        emptyMessage="No articles found."
      />
    </div>
  );
};
