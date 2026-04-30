import React from 'react';
import { Link } from 'react-router-dom';
import './StaticInfoPage.css';

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
    <section className="home-section bg-main static-page-shell">
      <div className="container">
        <div className="card static-hero">
          <span className="section-eyebrow">{eyebrow}</span>
          <h1 className="section-title static-title">{title}</h1>
          <p className="section-description">{description}</p>
        </div>

        <div className="static-sections">
          {sections.map((section) => (
            <article key={section.title} className="card static-section-card">
              <h2 className="static-section-title">{section.title}</h2>
              <p className="static-section-body">{section.body}</p>
            </article>
          ))}
        </div>

        <div className="static-actions">
          <Link to="/events" className="btn btn-primary">View Events</Link>
          <Link to="/alumni" className="btn btn-outline">Browse Alumni</Link>
        </div>
      </div>
    </section>
  );
};
