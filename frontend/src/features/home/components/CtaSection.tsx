import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CtaSection: React.FC = () => (
  <section className="cta-section">
    <div className="container">
      <h2 className="cta-title">Ready to reconnect?</h2>
      <p className="cta-subtitle">
        Whether you graduated yesterday or fifty years ago, your alma mater is
        waiting to welcome you back into the community.
      </p>
      <Link to="/register" className="btn btn-primary cta-btn">
        Create Your Free Profile <ArrowRight size={18} />
      </Link>
    </div>
  </section>
);
