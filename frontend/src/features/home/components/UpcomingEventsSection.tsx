import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/axios';
import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  maxAttendees?: number;
  currentRegistrationsCount: number;
  isFull: boolean;
}

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const date = new Date(event.eventDate);
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const day = date.getDate();

  return (
    <div className="event-card card">
      <div className="event-card-date-strip">
        <span className="event-month-label">{month}</span>
        <span className="event-day-label">{day}</span>
      </div>
      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-desc">{event.description}</p>
        <div className="event-meta">
          <span className="event-meta-item">
            <MapPin size={14} /> {event.location}
          </span>
          {event.maxAttendees && (
            <span className="event-meta-item">
              <Users size={14} />
              {event.isFull
                ? <span className="text-error">Full</span>
                : `${event.currentRegistrationsCount}/${event.maxAttendees}`}
            </span>
          )}
        </div>
        <Link to={`/events/${event.id}`} className="btn btn-primary mt-4" style={{ width: '100%', justifyContent: 'center' }}>
          {event.isFull ? 'View Details' : 'Register Now'}
        </Link>
      </div>
    </div>
  );
};

const SkeletonEventCard: React.FC = () => (
  <div className="event-card card">
    <div className="skeleton-event-date"></div>
    <div className="event-card-body">
      <div className="skeleton-line w-full"></div>
      <div className="skeleton-line w-half mt-2"></div>
    </div>
  </div>
);

export const UpcomingEventsSection: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['upcoming-events-home'],
    queryFn: async () => {
      const res = await apiClient.get('/events', { params: { page: 1, pageSize: 3 } });
      return res.data.data.items as Event[];
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="home-section bg-main">
      <div className="container">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">What's Coming</span>
            <h2 className="section-title">Upcoming Events</h2>
          </div>
          <Link to="/events" className="view-all-link">View All Events →</Link>
        </div>

        {isError ? (
          <p className="section-error">Could not load events. Please try again later.</p>
        ) : (
          <div className="three-col-grid">
            {isLoading
              ? [1, 2, 3].map(i => <SkeletonEventCard key={i} />)
              : data?.map(e => <EventCard key={e.id} event={e} />)
            }
          </div>
        )}
      </div>
    </section>
  );
};
