import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ScrollToTop } from '../hooks/useScrollToTop';
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { HomePage } from '../features/home/components/HomePage';
import { AlumniDirectory } from '../features/alumni/components/AlumniDirectory';
import { EventsPage } from '../features/events/components/EventsPage';
import { EventDetailPage } from '../features/events/components/EventDetailPage';
import { BlogPage } from '../features/blog/components/BlogPage';
import { PostDetailPage } from '../features/blog/components/PostDetailPage';
import { GalleryPage } from '../features/gallery/components/GalleryPage';
import { AdminDashboard } from '../features/admin/components/AdminDashboard';
import { AdminAlumni } from '../features/admin/components/AdminAlumni';
import { AdminEvents } from '../features/admin/components/AdminEvents';
import { AdminNews } from '../features/admin/components/AdminNews';
import { AdminSettings } from '../features/admin/components/AdminSettings';
import { RolesManagement } from '../features/admin/components/rbac/RolesManagement';
import { RolePermissionsManagement } from '../features/admin/components/rbac/RolePermissionsManagement';
import { UserRolesManagement } from '../features/admin/components/rbac/UserRolesManagement';
import { Login } from '../features/auth/components/Login';
import { Register } from '../features/auth/components/Register';
import { ForgotPassword } from '../features/auth/components/ForgotPassword';

// Placeholder components
const NotFound = () => <div style={{ textAlign: 'center', padding: '5rem 2rem' }}><h1 style={{ fontSize: '4rem' }}>404</h1><p>Page not found.</p></div>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'alumni', element: <AlumniDirectory /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'events/:id', element: <EventDetailPage /> },
      { path: 'news', element: <BlogPage /> },
      { path: 'news/:slug', element: <PostDetailPage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> }
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute requiredRole="Admin" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'alumni', element: <AdminAlumni /> },
          { path: 'events', element: <AdminEvents /> },
          { path: 'news', element: <AdminNews /> },
          { path: 'settings', element: <AdminSettings /> },
          { path: 'rbac/roles', element: <RolesManagement /> },
          { path: 'rbac/roles/:id/permissions', element: <RolePermissionsManagement /> },
          { path: 'rbac/users', element: <UserRolesManagement /> }
        ]
      }
    ]
  }
]);

export const AppRouter = () => {
  return (
    <>
      <ScrollToTop />
      <RouterProvider router={router} />
    </>
  );
};
