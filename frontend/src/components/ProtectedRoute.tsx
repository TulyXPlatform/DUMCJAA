import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../features/auth/hooks/useAuth';

interface ProtectedRouteProps {
  requiredRole?: string | string[];
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, requiredPermission }) => {
  const { user, token } = useAuthStore();
  const location = useLocation();
  
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin bypass
  const isSuperAdmin = user.roles.includes('SuperAdmin');

  if (isSuperAdmin) {
    return <Outlet />;
  }

  // Check roles
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRole = roles.some(role => user.roles.includes(role));
    
    if (!hasRole) {
      toast.error('You do not have the required role to access this area.');
      return <Navigate to="/" replace />;
    }
  }

  // Check permissions
  if (requiredPermission && !user.permissions.includes(requiredPermission)) {
    toast.error('You do not have the required permission to access this area.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
