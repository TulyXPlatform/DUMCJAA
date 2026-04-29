import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

const HomePage = lazy(() => import('../features/home/components/HomePage').then((m) => ({ default: m.HomePage })));
const AlumniDirectory = lazy(() => import('../features/alumni/components/AlumniDirectory').then((m) => ({ default: m.AlumniDirectory })));
const EventsPage = lazy(() => import('../features/events/components/EventsPage').then((m) => ({ default: m.EventsPage })));
const EventDetailPage = lazy(() => import('../features/events/components/EventDetailPage').then((m) => ({ default: m.EventDetailPage })));
const BlogPage = lazy(() => import('../features/blog/components/BlogPage').then((m) => ({ default: m.BlogPage })));
const PostDetailPage = lazy(() => import('../features/blog/components/PostDetailPage').then((m) => ({ default: m.PostDetailPage })));
const GalleryPage = lazy(() => import('../features/gallery/components/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const AboutPage = lazy(() => import('../features/site/components/AboutPage').then((m) => ({ default: m.AboutPage })));
const PublicationsPage = lazy(() => import('../features/site/components/PublicationsPage').then((m) => ({ default: m.PublicationsPage })));
const CareerPage = lazy(() => import('../features/site/components/CareerPage').then((m) => ({ default: m.CareerPage })));
const ContactPage = lazy(() => import('../features/site/components/ContactPage').then((m) => ({ default: m.ContactPage })));

const AdminDashboard = lazy(() => import('../features/admin/components/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminAlumni = lazy(() => import('../features/admin/components/AdminAlumni').then((m) => ({ default: m.AdminAlumni })));
const AdminEvents = lazy(() => import('../features/admin/components/AdminEvents').then((m) => ({ default: m.AdminEvents })));
const AdminNews = lazy(() => import('../features/admin/components/AdminNews').then((m) => ({ default: m.AdminNews })));
const AdminPublications = lazy(() => import('../features/admin/components/AdminPublications').then((m) => ({ default: m.AdminPublications })));
const AdminCareer = lazy(() => import('../features/admin/components/AdminCareer.tsx').then((m) => ({ default: m.AdminCareer })));
const AdminBlog = lazy(() => import('../features/admin/components/AdminBlog.tsx').then((m) => ({ default: m.AdminBlog })));
const AdminInquiries = lazy(() => import('../features/admin/components/AdminInquiries').then((m) => ({ default: m.AdminInquiries })));
const AdminSettings = lazy(() => import('../features/admin/components/AdminSettings').then((m) => ({ default: m.AdminSettings })));
const RolesManagement = lazy(() => import('../features/admin/components/rbac/RolesManagement').then((m) => ({ default: m.RolesManagement })));
const RolePermissionsManagement = lazy(() => import('../features/admin/components/rbac/RolePermissionsManagement').then((m) => ({ default: m.RolePermissionsManagement })));
const UserRolesManagement = lazy(() => import('../features/admin/components/rbac/UserRolesManagement').then((m) => ({ default: m.UserRolesManagement })));

const Login = lazy(() => import('../features/auth/components/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('../features/auth/components/Register').then((m) => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('../features/auth/components/ForgotPassword').then((m) => ({ default: m.ForgotPassword })));
const EmailVerification = lazy(() => import('../features/auth/components/EmailVerification').then((m) => ({ default: m.EmailVerification })));
const UserDashboard = lazy(() => import('../features/auth/components/UserDashboard').then((m) => ({ default: m.UserDashboard })));

const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
    <h1 style={{ fontSize: '4rem' }}>404</h1>
    <p>Page not found.</p>
  </div>
);

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
      { path: 'about', element: <AboutPage /> },
      { path: 'publications', element: <PublicationsPage /> },
      { path: 'career', element: <CareerPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'news', element: <BlogPage /> },
      { path: 'news/:slug', element: <PostDetailPage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'verify-email', element: <EmailVerification /> }
    ],
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <UserDashboard /> }
    ]
  },
  {
    path: '/admin',
    element: <ProtectedRoute requiredRole="Admin" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'alumni', element: <AdminAlumni /> },
          { path: 'events', element: <AdminEvents /> },
          { path: 'news', element: <AdminNews /> },
          { path: 'publications', element: <AdminPublications /> },
          { path: 'career', element: <AdminCareer /> },
          { path: 'blog', element: <AdminBlog /> },
          { path: 'inquiries', element: <AdminInquiries /> },
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
    <RouterProvider router={router} />
  );
};
