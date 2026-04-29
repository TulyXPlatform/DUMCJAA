import React from 'react';
import { Mail, Search } from 'lucide-react';

export const AdminInquiries: React.FC = () => {
  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-page-title">Contact Inquiries</h1>
          <p className="admin-page-subtitle">Manage messages and feedback from users.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Search size={15} className="admin-search-icon" />
          <input className="admin-search-input" type="text" placeholder="Search inquiries..." />
        </div>
      </div>

      <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
        <Mail size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-600">No Inquiries Found</h3>
        <p className="text-slate-500">New messages from the contact form will appear here.</p>
      </div>
    </div>
  );
};
