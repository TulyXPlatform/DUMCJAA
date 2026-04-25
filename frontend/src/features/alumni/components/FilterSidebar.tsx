import React from 'react';
import { Filter, X } from 'lucide-react';

export interface AlumniFilters {
  batch: string;
  department: string;
  sortBy: string;
}

interface FilterSidebarProps {
  filters: AlumniFilters;
  onFilterChange: (key: keyof AlumniFilters, value: string) => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
  activeFilterCount: number;
}

const BATCHES = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2010', '2005', '2000'];
const DEPARTMENTS = [
  'Mass Communication & Journalism',
  'Computer Science',
  'Business Administration',
  'Civil Engineering',
  'Law',
  'English',
  'Economics',
];
const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'firstName_asc', label: 'Name (A–Z)' },
  { value: 'firstName_desc', label: 'Name (Z–A)' },
  { value: 'batch_desc', label: 'Batch (Newest)' },
  { value: 'batch_asc', label: 'Batch (Oldest)' },
];

const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}> = ({ label, value, onChange, options, placeholder }) => (
  <div className="filter-field">
    <label className="filter-label">{label}</label>
    <select
      className="filter-select"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  isOpen,
  onClose,
  activeFilterCount,
}) => (
  <>
    {/* Mobile overlay */}
    {isOpen && <div className="filter-overlay" onClick={onClose} />}

    <aside className={`filter-sidebar ${isOpen ? 'filter-sidebar--open' : ''}`}>
      <div className="filter-sidebar-header">
        <div className="filter-sidebar-title">
          <Filter size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="filter-count-badge">{activeFilterCount}</span>
          )}
        </div>
        <button className="filter-close-btn" onClick={onClose} aria-label="Close filters">
          <X size={20} />
        </button>
      </div>

      <div className="filter-sidebar-body">
        <SelectField
          label="Batch Year"
          value={filters.batch}
          onChange={v => onFilterChange('batch', v)}
          options={BATCHES.map(b => ({ value: b, label: b }))}
          placeholder="All Batches"
        />
        <SelectField
          label="Department"
          value={filters.department}
          onChange={v => onFilterChange('department', v)}
          options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
          placeholder="All Departments"
        />
        <SelectField
          label="Sort By"
          value={filters.sortBy}
          onChange={v => onFilterChange('sortBy', v)}
          options={SORT_OPTIONS}
          placeholder="Default"
        />

        {activeFilterCount > 0 && (
          <button className="filter-reset-btn" onClick={onReset}>
            <X size={14} /> Reset All Filters
          </button>
        )}
      </div>
    </aside>
  </>
);
