import React from 'react';
import { Briefcase, Plus, Search } from 'lucide-react';

export const AdminCareer: React.FC = () => {
  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-page-title">Career Board Management</h1>
          <p className="admin-page-subtitle">Manage job postings and career opportunities.</p>
        </div>
        <button className="btn btn-primary admin-create-btn">
          <Plus size={16} /> Post a Job
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Search size={15} className="admin-search-icon" />
          <input className="admin-search-input" type="text" placeholder="Search jobs..." />
        </div>
      </div>

      <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
        <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-600">No Job Posts Found</h3>
        <p className="text-slate-500">Post new opportunities for the alumni network.</p>
      </div>
    </div>
  );
};
