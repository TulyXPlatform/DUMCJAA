import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import type { Event } from '../types';

interface EventCardProps {
  event: Event;
}

const GRADIENT_FALLBACKS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
];

function getFallbackGradient(id: string) {
  const idx = id.charCodeAt(0) % GRADIENT_FALLBACKS.length;
  return GRADIENT_FALLBACKS[idx];
}

function getCapacityPercent(current: number, max?: number) {
  if (!max) return null;
  return Math.min(100, Math.round((current / max) * 100));
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isPast = new Date(event.eventDate) < new Date();
  const capacityPct = getCapacityPercent(event.currentRegistrationsCount, event.maxAttendees);
  const isAlmostFull = capacityPct !== null && capacityPct >= 80;

  return (
    <Link to={`/events/${event.id}`} className="event-card-link">
      <article className={`event-card ${isPast ? 'event-card--past' : ''}`}>
        {/* Banner */}
        <div
          className="event-card-banner"
          style={
            event.bannerImageUrl
              ? { backgroundImage: `url(${event.bannerImageUrl})` }
              : { background: getFallbackGradient(event.id) }
          }
        >
          {isPast ? (
            <span className="event-badge event-badge--past">Concluded</span>
          ) : event.isFull ? (
            <span className="event-badge event-badge--full">Full</span>
          ) : (
            <span className="event-badge event-badge--open">Open</span>
          )}
        </div>

        {/* Body */}
        <div className="event-card-body">
          <div className="event-card-date-row">
            <Calendar size={14} />
            <time dateTime={event.eventDate}>
              {new Date(event.eventDate).toLocaleDateString('en-US', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
              })}
            </time>
          </div>

          <h3 className="event-card-title">{event.title}</h3>

          <p className="event-card-desc">{event.description}</p>

          <div className="event-card-meta">
            <span className="event-meta-row">
              <MapPin size={13} /> {event.location}
            </span>
            {event.maxAttendees && (
              <span className="event-meta-row">
                <Users size={13} />
                {event.currentRegistrationsCount}/{event.maxAttendees}
              </span>
            )}
          </div>

          {/* Capacity bar */}
          {capacityPct !== null && (
            <div className="event-capacity-bar-wrapper" title={`${capacityPct}% full`}>
              <div
                className={`event-capacity-bar ${isAlmostFull ? 'event-capacity-bar--warn' : ''} ${event.isFull ? 'event-capacity-bar--full' : ''}`}
                style={{ width: `${capacityPct}%` }}
              />
            </div>
          )}

          {/* Countdown */}
          {!isPast && (
            <div className="event-card-countdown">
              <span className="event-card-countdown-label">Starts in</span>
              <CountdownTimer targetDate={event.eventDate} compact />
            </div>
          )}
        </div>

        <div className="event-card-footer">
          <span className={`event-cta-btn ${event.isFull || isPast ? 'event-cta-btn--muted' : ''}`}>
            {isPast ? 'View Summary' : event.isFull ? 'Event Full' : 'View & Register →'}
          </span>
        </div>
      </article>
    </Link>
  );
};

import { Skeleton } from '../../../components/Skeleton';

export const EventCardSkeleton: React.FC = () => (
  <div className="event-card">
    <Skeleton height={180} />
    <div className="event-card-body" style={{ gap: '0.75rem', display: 'flex', flexDirection: 'column' }}>
      <Skeleton width="40%" height={14} />
      <Skeleton width="90%" height={24} style={{ marginTop: '0.25rem' }} />
      <Skeleton width="100%" height={40} />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Skeleton width="30%" height={16} />
        <Skeleton width="30%" height={16} />
      </div>
    </div>
    <div className="event-card-footer">
      <Skeleton width="100px" height={32} />
    </div>
  </div>
);
