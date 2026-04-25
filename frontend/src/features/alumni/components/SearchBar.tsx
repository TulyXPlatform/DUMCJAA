import React, { useId } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by name, company, or designation...',
}) => {
  const inputId = useId();

  return (
    <div className="search-bar-wrapper">
      <label htmlFor={inputId} className="sr-only">Search alumni</label>
      <Search size={18} className="search-icon" aria-hidden="true" />
      <input
        id={inputId}
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete="off"
      />
      {value && (
        <button
          className="search-clear-btn"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
