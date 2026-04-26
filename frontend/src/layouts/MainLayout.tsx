import { useState } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import './MainLayout.css';

export const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  useScrollToTop();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="layout-wrapper">
      <header className="header">
        <div className="container header-container">
          <div className="logo">
            <Link to="/">DUMCJAA</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="main-nav">
            <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Events</NavLink>
            <NavLink to="/alumni" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Alumni</NavLink>
            <NavLink to="/news" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>News</NavLink>
            <NavLink to="/gallery" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Gallery</NavLink>
          </nav>
          <div className="auth-nav">
            <Link to="/login" className="nav-link">Log in</Link>
            <Link to="/register" className="btn btn-primary">Sign up</Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="mobile-nav">
            <div className="mobile-nav-links">
              <Link to="/events" className="mobile-nav-link" onClick={toggleMobileMenu}>Events</Link>
              <Link to="/alumni" className="mobile-nav-link" onClick={toggleMobileMenu}>Alumni Directory</Link>
              <div className="mobile-auth-divider"></div>
              <Link to="/login" className="mobile-nav-link" onClick={toggleMobileMenu}>Log in</Link>
              <Link to="/register" className="btn btn-primary mobile-btn" onClick={toggleMobileMenu}>Sign up</Link>
            </div>
          </div>
        )}
      </header>

      <main className="main-content">
        <div className="container fade-in" key={location.pathname}>
          <Outlet />
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-container">
          <p>© {new Date().getFullYear()} DUMCJAA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
