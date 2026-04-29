import { useState } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useAuthStore } from '../features/auth/hooks/useAuth';
import './MainLayout.css';

export const MainLayout = () => {
  const { user, token, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  useScrollToTop();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isAdmin = user?.roles.some(r => ['SuperAdmin', 'Admin', 'Editor'].includes(r));

  return (
    <div className="layout-wrapper">
      <header className="header">
        <div className="container header-container">
          <div className="logo">
            <Link to="/" className="logo-link">
              <span className="logo-text">DU MCJ Alumni</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="main-nav">
            <NavLink to="/publications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Publications</NavLink>
            <NavLink to="/career" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Career</NavLink>
            <NavLink to="/blog" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Blog</NavLink>
            <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Events</NavLink>
            <NavLink to="/alumni" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Alumni</NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
          </nav>
          
          <div className="auth-nav">
            {token ? (
              <>
                <Link to={isAdmin ? "/admin" : "/dashboard"} className="nav-link">Dashboard</Link>
                <button onClick={handleLogout} className="btn btn-outline">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Log in</Link>
                <Link to="/register" className="btn btn-primary">Sign up</Link>
              </>
            )}
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
              <Link to="/publications" className="mobile-nav-link" onClick={toggleMobileMenu}>Publications</Link>
              <Link to="/career" className="mobile-nav-link" onClick={toggleMobileMenu}>Career</Link>
              <Link to="/blog" className="mobile-nav-link" onClick={toggleMobileMenu}>Blog</Link>
              <Link to="/events" className="mobile-nav-link" onClick={toggleMobileMenu}>Events</Link>
              <Link to="/alumni" className="mobile-nav-link" onClick={toggleMobileMenu}>Alumni Directory</Link>
              <Link to="/about" className="mobile-nav-link" onClick={toggleMobileMenu}>About</Link>
              <Link to="/contact" className="mobile-nav-link" onClick={toggleMobileMenu}>Contact</Link>
              <div className="mobile-auth-divider"></div>
              {token ? (
                <>
                  <Link to={isAdmin ? "/admin" : "/dashboard"} className="mobile-nav-link" onClick={toggleMobileMenu}>Dashboard</Link>
                  <button onClick={handleLogout} className="btn btn-outline mobile-btn">Log out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="mobile-nav-link" onClick={toggleMobileMenu}>Log in</Link>
                  <Link to="/register" className="btn btn-primary mobile-btn" onClick={toggleMobileMenu}>Sign up</Link>
                </>
              )}
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
