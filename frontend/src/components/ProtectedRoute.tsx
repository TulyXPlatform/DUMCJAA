import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  requiredRole?: string;
}

// Simple auth check. In a real app, this would use a robust AuthProvider/Context
// and decode the JWT to check roles and expiration.
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    toast.error('You must be logged in to view this page.');
    return <Navigate to="/login" replace />;
  }

  // Placeholder logic for Role checking.
  // In production, decode JWT payload to verify Roles array contains requiredRole.
  const userRole = localStorage.getItem('role') || 'Admin'; // Mocking Admin role for now

  if (requiredRole && userRole !== requiredRole) {
    toast.error('You do not have permission to access this area.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
