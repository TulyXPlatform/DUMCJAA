import React from 'react';
import { Link } from 'react-router-dom';
import './SitePages.css';

export const AboutPage: React.FC = () => {
  return (
    <section className="site-page">
      <div className="site-hero">
        <p className="site-eyebrow">About DUMCJAA</p>
        <h1 className="site-title">Department of Mass Communication & Journalism Alumni Association</h1>
        <p className="site-desc">We connect graduates, students, and faculty through mentorship, professional networking, cultural continuity, and impactful initiatives inspired by the spirit of University of Dhaka.</p>
      </div>

      <div className="site-grid">
        <article className="site-card span-6">
          <h3>Our Mission</h3>
          <p>Build a lifelong alumni platform that supports career growth, media literacy, research collaboration, and leadership development across communication disciplines.</p>
        </article>
        <article className="site-card span-6">
          <h3>Our Vision</h3>
          <p>To become a globally connected alumni community that champions ethical journalism, innovation, and public service through communication excellence.</p>
        </article>
        <article className="site-card span-4">
          <h3>Community Focus</h3>
          <ul>
            <li>Mentorship for students and fresh graduates</li>
            <li>Alumni networking and reunion programs</li>
            <li>Publication and research initiatives</li>
          </ul>
        </article>
        <article className="site-card span-4">
          <h3>Professional Growth</h3>
          <ul>
            <li>Career board and referral opportunities</li>
            <li>Skill workshops and industry talks</li>
            <li>Cross-generational collaboration</li>
          </ul>
        </article>
        <article className="site-card span-4">
          <h3>Institutional Legacy</h3>
          <ul>
            <li>Documenting alumni contributions</li>
            <li>Strengthening departmental ties</li>
            <li>Serving media and society together</li>
          </ul>
        </article>
      </div>

      <div className="site-actions">
        <Link to="/events" className="btn btn-primary">Explore Events</Link>
        <Link to="/alumni" className="btn btn-outline">Meet Members</Link>
      </div>
    </section>
  );
};
