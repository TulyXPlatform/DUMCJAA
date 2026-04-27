import React from 'react';
import { Link } from 'react-router-dom';

export const UserDashboard: React.FC = () => {
  return (
    <section className="home-section bg-main">
      <div className="container">
        <div className="card" style={{ padding: '2rem' }}>
          <span className="section-eyebrow">Dashboard</span>
          <h1 className="section-title" style={{ marginBottom: '0.75rem' }}>Welcome to your dashboard</h1>
          <p className="section-description" style={{ marginBottom: '1.25rem' }}>
            Your account is verified and active. Use the quick links below to continue.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link className="btn btn-primary" to="/alumni">Alumni Directory</Link>
            <Link className="btn btn-outline" to="/events">Upcoming Events</Link>
          </div>
        </div>
      </div>
    </section>
  );
};
