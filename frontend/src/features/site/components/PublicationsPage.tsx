import React from 'react';
import { Link } from 'react-router-dom';
import './SitePages.css';

export const PublicationsPage: React.FC = () => {
  return (
    <section className="site-page">
      <div className="site-hero">
        <p className="site-eyebrow">Publications</p>
        <h1 className="site-title">Research, Stories & Departmental Insights</h1>
        <p className="site-desc">Browse a curated stream of alumni writing, media analysis, field reports, and academic contributions from the DUMCJAA network.</p>
      </div>

      <div className="site-grid">
        <article className="site-card span-4">
          <h3>Featured Alumni Stories</h3>
          <p>Experience real-world journalism journeys, newsroom lessons, documentary work, and communication leadership narratives.</p>
        </article>
        <article className="site-card span-4">
          <h3>Academic & Research</h3>
          <p>Selected papers and analyses from faculty and alumni focused on media theory, policy, communication behavior, and digital transformation.</p>
        </article>
        <article className="site-card span-4">
          <h3>Editorial Submissions</h3>
          <p>Want to submit? Share your publication summary, author details, and publication link for review by the editorial team.</p>
        </article>
      </div>

      <div className="site-actions">
        <Link to="/contact" className="btn btn-primary">Submit a Publication</Link>
        <Link to="/blog" className="btn btn-outline">Read Blog Updates</Link>
      </div>
    </section>
  );
};
