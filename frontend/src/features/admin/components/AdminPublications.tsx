import React from 'react';
import { BookOpen, Plus, Search } from 'lucide-react';

export const AdminPublications: React.FC = () => {
  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-page-title">Publications Management</h1>
          <p className="admin-page-subtitle">Manage reports, souvenirs, and books.</p>
        </div>
        <button className="btn btn-primary admin-create-btn">
          <Plus size={16} /> Add Publication
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Search size={15} className="admin-search-icon" />
          <input className="admin-search-input" type="text" placeholder="Search publications..." />
        </div>
      </div>

      <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
        <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-600">No Publications Found</h3>
        <p className="text-slate-500">Start by adding a new report or souvenir.</p>
      </div>
    </div>
  );
};
