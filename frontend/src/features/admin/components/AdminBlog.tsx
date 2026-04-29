import React from 'react';
import { MessageSquare, Plus, Search } from 'lucide-react';

export const AdminBlog: React.FC = () => {
  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-page-title">Blog Management</h1>
          <p className="admin-page-subtitle">Create and manage alumni stories and news articles.</p>
        </div>
        <button className="btn btn-primary admin-create-btn">
          <Plus size={16} /> New Post
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Search size={15} className="admin-search-icon" />
          <input className="admin-search-input" type="text" placeholder="Search posts..." />
        </div>
      </div>

      <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
        <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-600">No Blog Posts Found</h3>
        <p className="text-slate-500">Share news and stories with the community.</p>
      </div>
    </div>
  );
};
