import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Newspaper, Settings, LogOut, Menu, X, Shield, UserCog } from 'lucide-react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useAuthStore } from '../features/auth/hooks/useAuth';
import './AdminLayout.css';
import '../features/admin/components/Admin.css';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  useScrollToTop();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isSuperAdmin = user?.roles.includes('SuperAdmin');
  const isAdmin = user?.roles.includes('Admin') || isSuperAdmin;
  const isEditor = user?.roles.includes('Editor') || isAdmin;

  const hasPermission = (perm: string) => user?.permissions.includes(perm) || isSuperAdmin;

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

          {hasPermission('alumni.read') && (
            <NavLink to="/admin/alumni" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
              <Users size={20} />
              <span>Manage Alumni</span>
            </NavLink>
          )}

          {hasPermission('events.manage') && (
            <NavLink to="/admin/events" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
              <Calendar size={20} />
              <span>Manage Events</span>
            </NavLink>
          )}

          {isEditor && (
            <NavLink to="/admin/news" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
              <Newspaper size={20} />
              <span>Manage News</span>
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
              <Settings size={20} />
              <span>CMS Settings</span>
            </NavLink>
          )}

          {isSuperAdmin && (
            <>
              <div className="admin-nav-divider">System Management</div>
              <NavLink to="/admin/rbac/roles" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
                <Shield size={20} />
                <span>Role Management</span>
              </NavLink>
              <NavLink to="/admin/rbac/users" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
                <UserCog size={20} />
                <span>User Roles</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <span className="admin-user-name">{user?.fullName}</span>
            <span className="admin-user-role">{user?.roles[0]}</span>
          </div>
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
            <h1>{location.pathname.includes('rbac') ? 'RBAC Management' : 'Admin Control Panel'}</h1>
          </div>
          <div className="admin-user-menu">
            <span className="admin-avatar">{user?.fullName.charAt(0)}</span>
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
