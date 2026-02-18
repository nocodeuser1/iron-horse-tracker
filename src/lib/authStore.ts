import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'super_admin' | 'company_admin' | 'user';

interface User {
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  companyName?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isSuperAdmin: () => boolean;
  isCompanyUser: () => boolean;
}

// Demo credentials with roles
const DEMO_CREDENTIALS = [
  {
    email: 'admin@visualpermit.com',
    password: 'SuperAdmin2026!',
    user: {
      email: 'admin@visualpermit.com',
      name: 'Super Admin',
      role: 'super_admin' as UserRole,
    },
  },
  {
    email: 'israel@baberenvironmental.com',
    password: 'myBaberPermitting26',
    user: {
      email: 'israel@baberenvironmental.com',
      name: 'Israel',
      role: 'super_admin' as UserRole,
    },
  },
  {
    email: 'scott@baberenvironmental.com',
    password: 'IHTempLogin26',
    user: {
      email: 'scott@baberenvironmental.com',
      name: 'Scott',
      role: 'company_admin' as UserRole,
      companyId: 'iron-horse-1',
      companyName: 'Iron Horse Midstream',
    },
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, password: string) => {
        const credential = DEMO_CREDENTIALS.find(
          (cred) => cred.email === email && cred.password === password
        );

        if (credential) {
          set({ user: credential.user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      isSuperAdmin: () => {
        const state = get();
        return state.isAuthenticated && state.user?.role === 'super_admin';
      },

      isCompanyUser: () => {
        const state = get();
        return (
          state.isAuthenticated &&
          (state.user?.role === 'company_admin' || state.user?.role === 'user')
        );
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
