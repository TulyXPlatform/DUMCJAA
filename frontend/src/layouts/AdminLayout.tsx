import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Newspaper, Settings, LogOut, Menu, X, Shield } from 'lucide-react';
import './AdminLayout.css';
import '../features/admin/components/Admin.css';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-logo">
          <h2>DUMCJAA Admin</h2>
          <button className="admin-close-btn" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/alumni" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
            <Users size={20} />
            <span>Manage Alumni</span>
          </NavLink>
          <NavLink to="/admin/events" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
            <Calendar size={20} />
            <span>Manage Events</span>
          </NavLink>
          <NavLink to="/admin/news" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
            <Newspaper size={20} />
            <span>Manage News</span>
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
            <Settings size={20} />
            <span>CMS Settings</span>
          </NavLink>
          <NavLink to="/admin/rbac/roles" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
            <Shield size={20} />
            <span>Role Management</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-nav-link logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-title">
            <button className="admin-mobile-menu-btn" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h1>Admin Control Panel</h1>
          </div>
          <div className="admin-user-menu">
            <span className="admin-avatar">A</span>
          </div>
        </header>

        <main className="admin-content">
          <div className="admin-container fade-in" key={location.pathname}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
