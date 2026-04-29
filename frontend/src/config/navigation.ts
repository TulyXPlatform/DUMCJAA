import { 
  LayoutDashboard, Users, Calendar, Newspaper, 
  Settings, Shield, UserCog, BookOpen, 
  Briefcase, MessageSquare, Mail 
} from 'lucide-react';

export interface NavItem {
  title: string;
  path: string;
  icon?: any;
  permission?: string;
  role?: string;
  end?: boolean;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/admin',
    icon: LayoutDashboard,
    end: true
  },
  {
    title: 'Manage Alumni',
    path: '/admin/alumni',
    icon: Users,
    permission: 'alumni.read'
  },
  {
    title: 'Manage Events',
    path: '/admin/events',
    icon: Calendar,
    permission: 'events.manage'
  },
  {
    title: 'Manage News',
    path: '/admin/news',
    icon: Newspaper,
    role: 'Editor'
  },
  {
    title: 'Publications',
    path: '/admin/publications',
    icon: BookOpen,
    permission: 'publications.manage'
  },
  {
    title: 'Career Board',
    path: '/admin/career',
    icon: Briefcase,
    permission: 'career.manage'
  },
  {
    title: 'Blog Posts',
    path: '/admin/blog',
    icon: MessageSquare,
    permission: 'blog.manage'
  },
  {
    title: 'Contact Inquiries',
    path: '/admin/inquiries',
    icon: Mail,
    permission: 'inquiries.read'
  },
  {
    title: 'CMS Settings',
    path: '/admin/settings',
    icon: Settings,
    role: 'Admin'
  }
];

export const SUPERADMIN_NAV_ITEMS: NavItem[] = [
  {
    title: 'Role Management',
    path: '/admin/rbac/roles',
    icon: Shield
  },
  {
    title: 'User Roles',
    path: '/admin/rbac/users',
    icon: UserCog
  }
];
