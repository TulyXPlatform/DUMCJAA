import { useMemo, useState } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useAuthStore } from '../features/auth/hooks/useAuth';
import './MainLayout.css';

type PublicNavItem = { label: string; to: string };

const PUBLIC_NAV_ITEMS: PublicNavItem[] = [
  { label: 'About', to: '/about' },
  { label: 'Members', to: '/alumni' },
  { label: 'Publications', to: '/publications' },
  { label: 'Events', to: '/events' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Career', to: '/career' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact Us', to: '/contact' }
];

export const MainLayout = () => {
  const { user, token, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  useScrollToTop();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isAdmin = user?.roles.some((r) => ['SuperAdmin', 'Admin', 'Editor'].includes(r));
  const dashboardPath = useMemo(() => (isAdmin ? '/admin' : '/dashboard'), [isAdmin]);

  return (
    <div className="layout-wrapper">
      <header className="header">
        <div className="top-accent" />
        <div className="container header-container">
          <div className="logo">
            <Link to="/" className="logo-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="logo-mark" aria-hidden />
              <span className="logo-text-wrap">
                <span className="logo-text">DUMCJAA</span>
                <span className="logo-subtext">Mass Communication & Journalism Alumni</span>
              </span>
            </Link>
          </div>

          <nav className="main-nav" aria-label="Main navigation">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="auth-nav">
            {token ? (
              <>
                <Link to={dashboardPath} className="nav-link">Dashboard</Link>
                <button onClick={handleLogout} className="btn btn-outline">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Log in</Link>
                <Link to="/register" className="btn btn-primary">Sign up</Link>
              </>
            )}
          </div>

          <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="mobile-nav">
            <div className="mobile-nav-links">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <Link key={item.to} to={item.to} className="mobile-nav-link" onClick={toggleMobileMenu}>{item.label}</Link>
              ))}

              <div className="mobile-auth-divider" />
              {token ? (
                <>
                  <Link to={dashboardPath} className="mobile-nav-link" onClick={toggleMobileMenu}>Dashboard</Link>
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
          <p>© {new Date().getFullYear()} DUMCJAA · University of Dhaka · All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
