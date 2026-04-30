import {
  LayoutDashboard, Users, Calendar, Newspaper,
  Settings, Shield, UserCog, BookOpen,
  Briefcase, MessageSquare, Mail, type LucideIcon
} from 'lucide-react';

export interface NavItem {
  title: string;
  path: string;
  icon?: LucideIcon;
  permission?: string;
  end?: boolean;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { title: 'Manage Alumni', path: '/admin/alumni', icon: Users, permission: 'alumni.read' },
  { title: 'Manage Events', path: '/admin/events', icon: Calendar, permission: 'events.manage' },
  { title: 'Manage News', path: '/admin/news', icon: Newspaper, permission: 'news.manage' },
  { title: 'Publications', path: '/admin/publications', icon: BookOpen, permission: 'publications.manage' },
  { title: 'Career Board', path: '/admin/career', icon: Briefcase, permission: 'career.manage' },
  { title: 'Blog Posts', path: '/admin/blog', icon: MessageSquare, permission: 'blog.manage' },
  { title: 'Contact Inquiries', path: '/admin/inquiries', icon: Mail, permission: 'inquiries.read' },
  { title: 'CMS Settings', path: '/admin/settings', icon: Settings, permission: 'settings.manage' }
];

export const SUPERADMIN_NAV_ITEMS: NavItem[] = [
  { title: 'Role Management', path: '/admin/rbac/roles', icon: Shield, permission: 'users.manage' },
  { title: 'Permission Catalog', path: '/admin/rbac/permissions', icon: Shield, permission: 'users.manage' },
  { title: 'User Roles', path: '/admin/rbac/users', icon: UserCog, permission: 'users.manage' }
];
