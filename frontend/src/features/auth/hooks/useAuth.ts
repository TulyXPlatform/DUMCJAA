import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
    permissions: string[];
  } | null;
  token: string | null;
  setAuth: (user: AuthState['user'], token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const usePermission = (permission: string) => {
  const user = useAuthStore((state) => state.user);
  
  if (!user) return false;
  
  // SuperAdmin bypass (optional but common)
  if (user.roles.includes('Admin')) return true;
  
  return user.permissions.includes(permission);
};

export const hasAnyPermission = (userPermissions: string[], requiredPermissions: string[]) => {
  return requiredPermissions.some(p => userPermissions.includes(p));
};
