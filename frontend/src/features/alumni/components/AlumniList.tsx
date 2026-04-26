import React, { useState, useEffect } from 'react';
import { useGetAlumni } from '../api/useGetAlumni';
import { AlumniCard } from './AlumniCard';
import './AlumniList.css';
import { getHttpErrorMessage } from '../../../lib/httpError';

// Custom hook to debounce search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const AlumniList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const [page, setPage] = useState(1);
  const [department, setDepartment] = useState('');
  const [batch, setBatch] = useState('');

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, department, batch]);

  const { data: pagedData, isLoading, isError, error } = useGetAlumni({
    page,
    pageSize: 12,
    search: debouncedSearch,
    department: department || undefined,
    batch: batch || undefined,
  });

  if (isError) {
    return (
      <div className="alumni-state-container error">
        <h2>Failed to load Alumni Directory</h2>
        <p>{getHttpErrorMessage(error, 'Unexpected error while loading alumni.')}</p>
        <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="alumni-directory">
      <div className="directory-header">
        <h1>Alumni Directory</h1>
        <p>Connect with fellow graduates across the globe.</p>
      </div>

      <div className="directory-filters card">
        <input 
          type="text" 
          className="input search-input" 
          placeholder="Search by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input 
          type="text" 
          className="input filter-input" 
          placeholder="Department (e.g. Civil Engineering)" 
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <input 
          type="text" 
          className="input filter-input" 
          placeholder="Batch (e.g. 2020)" 
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="alumni-state-container loading">
          <div className="spinner"></div>
          <p>Loading alumni profiles...</p>
        </div>
      ) : !pagedData || pagedData.items.length === 0 ? (
        <div className="alumni-state-container empty">
          <h2>No Alumni Found</h2>
          <p>We couldn't find anyone matching your search criteria.</p>
          <button className="btn btn-primary mt-4" onClick={() => {
            setSearchTerm(''); setDepartment(''); setBatch('');
          }}>Clear Filters</button>
        </div>
      ) : (
        <>
          <div className="alumni-grid">
            {pagedData.items.map(alumnus => (
              <AlumniCard key={alumnus.id} alumnus={alumnus} viewMode="grid" />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagedData.totalPages > 1 && (
            <div className="pagination">
              <button 
                className="btn btn-outline" 
                disabled={!pagedData.hasPrevious}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagedData.page} of {pagedData.totalPages}
              </span>
              <button 
                className="btn btn-outline" 
                disabled={!pagedData.hasNext}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
