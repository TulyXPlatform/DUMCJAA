import React from 'react';
import './SitePages.css';

export const ContactPage: React.FC = () => {
  return (
    <section className="site-page">
      <div className="site-hero">
        <p className="site-eyebrow">Contact Us</p>
        <h1 className="site-title">Get in Touch with DUMCJAA</h1>
        <p className="site-desc">For membership help, publication requests, partnerships, and event collaborations, reach out to our support and coordination team.</p>
      </div>

      <div className="site-grid">
        <article className="site-card span-4">
          <h3>General Support</h3>
          <p>Email: support@dumcjaa.com</p>
          <p>Include full name, batch, and request details for faster response and proper routing.</p>
        </article>
        <article className="site-card span-4">
          <h3>Events & Partnerships</h3>
          <p>Email: events@dumcjaa.com</p>
          <p>Send organization profile, proposal scope, preferred timeline, and expected collaboration outcomes.</p>
        </article>
        <article className="site-card span-4">
          <h3>Publications & Editorial</h3>
          <p>Email: editorial@dumcjaa.com</p>
          <p>Share publication links, abstracts, and author credentials for review and potential feature placement.</p>
        </article>
      </div>

      <div className="site-actions">
        <a href="mailto:support@dumcjaa.com" className="btn btn-primary">Email Support</a>
        <a href="mailto:events@dumcjaa.com" className="btn btn-outline">Discuss Collaboration</a>
      </div>
    </section>
  );
};
