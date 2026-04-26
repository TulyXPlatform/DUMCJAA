import React, { useState, useEffect } from 'react';
import { useGetAlumni } from '../api/useGetAlumni';
import { AlumniCard, AlumniCardSkeleton } from './AlumniCard';
import { SearchBar } from './SearchBar';
import { FilterSidebar, type AlumniFilters } from './FilterSidebar';
import { LayoutGrid, List, SlidersHorizontal, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import './AlumniDirectory.css';

const DEFAULT_FILTERS: AlumniFilters = { batch: '', department: '', sortBy: '' };
const PAGE_SIZE = 12;

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return deb;
}

export const AlumniDirectory: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AlumniFilters>(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  // Reset page when any filter/search changes
  useEffect(() => { setPage(1); }, [debouncedSearch, filters]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleFilterChange = (key: keyof AlumniFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch('');
  };

  // Parse sortBy into separate values for API
  const [sortByField, sortDescending] = filters.sortBy
    ? [filters.sortBy.split('_')[0], filters.sortBy.endsWith('desc')]
    : ['', false];

  const { data, isLoading, isError, isFetching } = useGetAlumni({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
    batch: filters.batch || undefined,
    department: filters.department || undefined,
    sortBy: sortByField || undefined,
    sortDescending: sortDescending || undefined,
  });

  return (
    <div className="alumni-directory-page">
      {/* Page Header */}
      <div className="directory-page-header">
        <div>
          <h1 className="directory-page-title">Alumni Directory</h1>
          <p className="directory-page-subtitle">
            Connect with {data?.totalCount?.toLocaleString() ?? '...'} graduates worldwide
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="directory-toolbar">
        <SearchBar value={search} onChange={setSearch} />

        <div className="directory-toolbar-right">
          <button
            className={`toolbar-btn ${isFilterOpen ? 'toolbar-btn--active' : ''}`}
            onClick={() => setIsFilterOpen(v => !v)}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="filter-count-badge">{activeFilterCount}</span>
            )}
          </button>

          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <LayoutGrid size={17} />
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* Layout: Sidebar + Content */}
      <div className="directory-layout">
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          activeFilterCount={activeFilterCount}
        />

        <div className={`directory-content ${isFetching && !isLoading ? 'directory-content--fading' : ''}`}>
          {/* Error State */}
          {isError && (
            <div className="dir-state-box dir-state-error">
              <div className="dir-state-icon">⚠️</div>
              <h3>Failed to load alumni</h3>
              <p>Something went wrong while fetching data. Please try again.</p>
              <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className={viewMode === 'grid' ? 'alumni-grid' : 'alumni-list'}>
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <AlumniCardSkeleton key={i} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && data?.items.length === 0 && (
            <div className="dir-state-box">
              <div className="dir-state-icon"><Users size={40} strokeWidth={1.5} /></div>
              <h3>No alumni found</h3>
              <p>Try adjusting your search terms or removing some filters.</p>
              <button className="btn btn-primary mt-4" onClick={handleReset}>
                Clear All Filters
              </button>
            </div>
          )}

          {/* Results */}
          {!isLoading && !isError && data && data.items.length > 0 && (
            <>
              <p className="results-count">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, data.totalCount)} of {data.totalCount.toLocaleString()} alumni
              </p>

              <div className={viewMode === 'grid' ? 'alumni-grid' : 'alumni-list'}>
                {data.items.map(a => (
                  <AlumniCard key={a.id} alumnus={a} viewMode={viewMode} />
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="dir-pagination">
                  <button
                    className="pag-btn"
                    disabled={!data.hasPrevious}
                    onClick={() => setPage(p => p - 1)}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>

                  <div className="pag-pages">
                    {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === data.totalPages || Math.abs(p - page) <= 1)
                      .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                        if (idx > 0 && (arr[idx - 1] as number) < p - 1) acc.push('...');
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, idx) =>
                        p === '...'
                          ? <span key={`ellipsis-${idx}`} className="pag-ellipsis">…</span>
                          : <button
                              key={p}
                              className={`pag-num ${p === page ? 'pag-num--active' : ''}`}
                              onClick={() => setPage(p as number)}
                            >
                              {p}
                            </button>
                      )}
                  </div>

                  <button
                    className="pag-btn"
                    disabled={!data.hasNext}
                    onClick={() => setPage(p => p + 1)}
                    aria-label="Next page"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
