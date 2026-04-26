import React from 'react';
import { CATEGORIES, type Category } from '../types';

interface CategoryFilterProps {
  active: Category;
  onChange: (cat: Category) => void;
}

const CATEGORY_DOT: Record<string, string> = {
  Achievement:  '#16a34a',
  Announcement: '#2563eb',
  Community:    '#7c3aed',
  Scholarship:  '#dc2626',
  Research:     '#d97706',
  Interview:    '#0891b2',
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ active, onChange }) => (
  <nav className="category-filter" role="navigation" aria-label="Filter by category">
    <div className="category-filter-scroll">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          className={`category-filter-btn ${active === cat ? 'category-filter-btn--active' : ''}`}
          onClick={() => onChange(cat)}
          aria-pressed={active === cat}
        >
          {cat !== 'All' && (
            <span
              className="category-filter-dot"
              style={{ background: CATEGORY_DOT[cat] ?? '#64748b' }}
              aria-hidden="true"
            />
          )}
          {cat}
        </button>
      ))}
    </div>
  </nav>
);
