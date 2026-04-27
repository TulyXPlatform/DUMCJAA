import React from 'react';
import { Link } from 'react-router-dom';

interface ContentSection {
  title: string;
  body: string;
}

interface StaticInfoPageProps {
  eyebrow: string;
  title: string;
  description: string;
  sections: ContentSection[];
}

export const StaticInfoPage: React.FC<StaticInfoPageProps> = ({
  eyebrow,
  title,
  description,
  sections,
}) => {
  return (
    <section className="home-section bg-main">
      <div className="container">
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <span className="section-eyebrow">{eyebrow}</span>
          <h1 className="section-title" style={{ marginBottom: '0.75rem' }}>{title}</h1>
          <p className="section-description" style={{ marginBottom: 0 }}>{description}</p>
        </div>

        <div className="three-col-grid" style={{ gridTemplateColumns: '1fr' }}>
          {sections.map((section) => (
            <article key={section.title} className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.25rem', color: 'var(--text-main)' }}>{section.title}</h2>
              <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--text-muted)' }}>{section.body}</p>
            </article>
          ))}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/events" className="btn btn-primary">View Events</Link>
          <Link to="/alumni" className="btn btn-outline">Browse Alumni</Link>
        </div>
      </div>
    </section>
  );
};
