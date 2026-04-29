import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useAuthStore } from '../features/auth/hooks/useAuth';
import { ADMIN_NAV_ITEMS, SUPERADMIN_NAV_ITEMS } from '../config/navigation';
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

  const hasPermission = (perm?: string) => !perm || user?.permissions.includes(perm) || isSuperAdmin;
  const hasRole = (role?: string) => !role || user?.roles.includes(role) || isSuperAdmin;

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
          {ADMIN_NAV_ITEMS.map((item) => (
            (hasPermission(item.permission) && hasRole(item.role)) && (
              <NavLink 
                key={item.path} 
                to={item.path} 
                end={item.end} 
                className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} 
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.icon && <item.icon size={20} />}
                <span>{item.title}</span>
              </NavLink>
            )
          ))}

          {isSuperAdmin && (
            <>
              <div className="admin-nav-divider">System Management</div>
              {SUPERADMIN_NAV_ITEMS.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} 
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.icon && <item.icon size={20} />}
                  <span>{item.title}</span>
                </NavLink>
              ))}
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
