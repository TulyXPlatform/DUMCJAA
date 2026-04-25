import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => (
  <section
    className="hero-section"
    style={{
      backgroundImage: 'linear-gradient(135deg, rgba(15,23,42,0.80) 0%, rgba(37,99,235,0.55) 100%), url("/hero-bg.png")',
    }}
  >
    <div className="container hero-content">
      <h1 className="hero-headline">
        Empowering the Next Generation of Excellence
      </h1>
      <p className="hero-subheadline">
        Join the official DUMCJAA platform. Connect with thousands of alumni, mentor students, and stay updated on the latest news and events from your alma mater.
      </p>
      <div className="hero-actions">
        <Link to="/register" className="btn btn-primary hero-btn">
          Join the Network <ArrowRight size={18} />
        </Link>
        <Link to="/alumni" className="btn-outline-white hero-btn">
          Browse Directory
        </Link>
      </div>
    </div>
  </section>
);
