import React from 'react';

export const AboutSection: React.FC = () => (
  <section className="home-section bg-surface">
    <div className="container">
      <div className="about-grid">
        <div className="about-text">
          <span className="section-eyebrow">Who We Are</span>
          <h2 className="section-title">Our Mission &amp; Legacy</h2>
          <p className="section-description" style={{ marginTop: '1rem' }}>
            The Dhaka University Mass Communication and Journalism Alumni Association
            (DUMCJAA) fosters lifelong relationships among graduates, upholding the
            journalistic integrity and professional excellence of our department.
          </p>
          <p className="section-description" style={{ marginTop: '1rem' }}>
            We have grown into a vibrant global network of media professionals,
            academics, and corporate leaders united by shared history and a commitment
            to serving society.
          </p>
        </div>
        <div className="about-stats">
          {[
            { number: '5,000+', label: 'Registered Alumni' },
            { number: '50+', label: 'Global Chapters' },
            { number: '200+', label: 'Yearly Events' },
            { number: '10k+', label: 'Mentorship Hours' },
          ].map(s => (
            <div className="stat-card" key={s.label}>
              <span className="stat-number">{s.number}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
