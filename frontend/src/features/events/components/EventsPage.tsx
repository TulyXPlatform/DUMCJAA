import React, { useState } from 'react';
import { useGetEvents } from '../api/useEvents';
import { EventCard, EventCardSkeleton } from './EventCard';
import { Search, Calendar, X } from 'lucide-react';
import './EventsPage.css';

export const EventsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [upcomingOnly, setUpcomingOnly] = useState(true);

  const { data, isLoading, isError, isFetching } = useGetEvents({
    page,
    pageSize: 9,
    search: search || undefined,
    upcoming: upcomingOnly || undefined,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="events-page">
      {/* Header */}
      <div className="events-page-header">
        <div>
          <h1 className="events-page-title">Events</h1>
          <p className="events-page-subtitle">Reunions, workshops, seminars, and more.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="events-toolbar">
        <form className="events-search-form" onSubmit={handleSearch}>
          <div className="events-search-input-wrap">
            <Search size={16} className="events-search-icon" />
            <input
              type="text"
              className="events-search-input"
              placeholder="Search events..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button type="button" className="events-search-clear" onClick={() => { setSearch(''); setPage(1); }}>
                <X size={15} />
              </button>
            )}
          </div>
        </form>

        <button
          className={`events-filter-btn ${upcomingOnly ? 'active' : ''}`}
          onClick={() => { setUpcomingOnly(v => !v); setPage(1); }}
        >
          <Calendar size={15} />
          {upcomingOnly ? 'Upcoming Only' : 'All Events'}
        </button>
      </div>

      {/* Content */}
      <div className={`events-grid-wrapper ${isFetching && !isLoading ? 'events-fading' : ''}`}>
        {/* Error */}
        {isError && (
          <div className="events-state-box events-state-error">
            <span className="events-state-icon">⚠️</span>
            <h3>Failed to load events</h3>
            <p>Please check your connection and try again.</p>
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="events-grid">
            {Array.from({ length: 9 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && data?.items.length === 0 && (
          <div className="events-state-box">
            <span className="events-state-icon">📅</span>
            <h3>No events found</h3>
            <p>{search ? 'Try a different search term.' : 'Check back soon for upcoming events.'}</p>
            {search && (
              <button className="btn btn-primary mt-4" onClick={() => setSearch('')}>Clear Search</button>
            )}
          </div>
        )}

        {/* Results */}
        {!isLoading && !isError && data && data.items.length > 0 && (
          <>
            <p className="events-result-count">
              {data.totalCount} event{data.totalCount !== 1 ? 's' : ''} found
            </p>
            <div className="events-grid">
              {data.items.map(e => <EventCard key={e.id} event={e} />)}
            </div>

            {data.totalPages > 1 && (
              <div className="events-pagination">
                <button
                  className="pag-btn"
                  disabled={!data.hasPrevious}
                  onClick={() => setPage(p => p - 1)}
                >
                  ← Prev
                </button>
                <span className="events-page-info">
                  Page {data.page} of {data.totalPages}
                </span>
                <button
                  className="pag-btn"
                  disabled={!data.hasNext}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
