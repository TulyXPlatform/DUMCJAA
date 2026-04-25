import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetEventById, useRegisterForEvent, useUnregisterFromEvent } from '../api/useEvents';
import { CountdownTimer } from './CountdownTimer';
import { ArrowLeft, Calendar, MapPin, Users, Clock } from 'lucide-react';
import './EventDetailPage.css';
import './EventsPage.css';

const GRADIENT_FALLBACKS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
];

function getFallback(id: string) {
  return GRADIENT_FALLBACKS[id.charCodeAt(0) % GRADIENT_FALLBACKS.length];
}

export const EventDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: event, isLoading, isError } = useGetEventById(id);
  const registerMutation = useRegisterForEvent(id);
  const unregisterMutation = useUnregisterFromEvent(id);

  const isPending = registerMutation.isPending || unregisterMutation.isPending;

  if (isLoading) return <EventDetailSkeleton />;

  if (isError || !event) {
    return (
      <div className="event-detail-error">
        <h2>Event not found</h2>
        <p>This event may have been removed or the link is incorrect.</p>
        <Link to="/events" className="btn btn-primary mt-4">← Back to Events</Link>
      </div>
    );
  }

  const eventDate = new Date(event.eventDate);
  const isPast = eventDate < new Date();
  const capacityPct = event.maxAttendees
    ? Math.min(100, Math.round((event.currentRegistrationsCount / event.maxAttendees) * 100))
    : null;

  const handleToggleRegistration = () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    if (event.isRegistered) {
      unregisterMutation.mutate();
    } else {
      registerMutation.mutate();
    }
  };

  return (
    <div className="event-detail-page">
      {/* Back link */}
      <Link to="/events" className="event-detail-back">
        <ArrowLeft size={16} /> All Events
      </Link>

      {/* Hero Banner */}
      <div
        className="event-detail-banner"
        style={
          event.bannerImageUrl
            ? { backgroundImage: `url(${event.bannerImageUrl})` }
            : { background: getFallback(event.id) }
        }
      >
        <div className="event-detail-banner-overlay">
          <div className="event-detail-banner-content">
            <span className={`event-badge ${isPast ? 'event-badge--past' : event.isFull ? 'event-badge--full' : 'event-badge--open'}`}>
              {isPast ? 'Concluded' : event.isFull ? 'Full' : 'Registration Open'}
            </span>
            <h1 className="event-detail-title">{event.title}</h1>
            <div className="event-detail-banner-meta">
              <span><Calendar size={15} /> {eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span><MapPin size={15} /> {event.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="event-detail-grid">

        {/* Main Content */}
        <div className="event-detail-main">
          <section className="event-detail-section">
            <h2 className="event-detail-section-title">About This Event</h2>
            <p className="event-detail-description">{event.description}</p>
          </section>

          <section className="event-detail-section">
            <h2 className="event-detail-section-title">Event Details</h2>
            <ul className="event-detail-facts">
              <li>
                <Calendar size={18} className="fact-icon" />
                <div>
                  <strong>Date & Time</strong>
                  <span>{eventDate.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</span>
                </div>
              </li>
              <li>
                <MapPin size={18} className="fact-icon" />
                <div>
                  <strong>Location</strong>
                  <span>{event.location}</span>
                </div>
              </li>
              {event.maxAttendees && (
                <li>
                  <Users size={18} className="fact-icon" />
                  <div>
                    <strong>Capacity</strong>
                    <span>{event.currentRegistrationsCount} / {event.maxAttendees} registered</span>
                  </div>
                </li>
              )}
              {!isPast && (
                <li>
                  <Clock size={18} className="fact-icon" />
                  <div>
                    <strong>Starts In</strong>
                    <CountdownTimer targetDate={event.eventDate} />
                  </div>
                </li>
              )}
            </ul>
          </section>
        </div>

        {/* Sticky Sidebar CTA */}
        <aside className="event-detail-sidebar">
          <div className="event-cta-card">
            {!isPast && !event.isFull && (
              <div className="event-cta-countdown">
                <p className="event-cta-countdown-label">Starts in</p>
                <CountdownTimer targetDate={event.eventDate} />
              </div>
            )}

            {capacityPct !== null && (
              <div className="event-cta-capacity">
                <div className="event-cta-capacity-row">
                  <span>{event.currentRegistrationsCount} registered</span>
                  <span>{event.maxAttendees! - event.currentRegistrationsCount} spots left</span>
                </div>
                <div className="event-capacity-bar-wrapper">
                  <div
                    className={`event-capacity-bar ${capacityPct >= 80 ? 'event-capacity-bar--warn' : ''} ${event.isFull ? 'event-capacity-bar--full' : ''}`}
                    style={{ width: `${capacityPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* CTA Button */}
            {isPast ? (
              <button className="event-register-btn event-register-btn--disabled" disabled>
                This event has concluded
              </button>
            ) : event.isFull && !event.isRegistered ? (
              <button className="event-register-btn event-register-btn--full" disabled>
                Event is Full
              </button>
            ) : (
              <button
                className={`event-register-btn ${event.isRegistered ? 'event-register-btn--unregister' : 'event-register-btn--register'}`}
                onClick={handleToggleRegistration}
                disabled={isPending}
              >
                {isPending
                  ? 'Processing...'
                  : event.isRegistered
                  ? '✓ Unregister'
                  : 'Register Now →'}
              </button>
            )}

            {!localStorage.getItem('token') && !isPast && (
              <p className="event-cta-note">
                <Link to="/login">Log in</Link> to register for this event.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

const EventDetailSkeleton: React.FC = () => (
  <div className="event-detail-page">
    <div className="skeleton-line h-4 w-24 mb-6" />
    <div className="skeleton-block event-detail-banner" style={{ height: '360px' }} />
    <div className="event-detail-grid" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="skeleton-line h-6 w-48" />
        <div className="skeleton-line h-4 w-full" />
        <div className="skeleton-line h-4 w-full" />
        <div className="skeleton-line h-4 w-3q" />
      </div>
      <div className="skeleton-block" style={{ height: '220px', borderRadius: '0.5rem' }} />
    </div>
  </div>
);
