import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Demo credentials
const DEMO_CREDENTIALS = {
  email: 'scott@baberenvironmental.com',
  password: 'IHTempLogin26',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, password: string) => {
        if (
          email === DEMO_CREDENTIALS.email &&
          password === DEMO_CREDENTIALS.password
        ) {
          const user = {
            email: DEMO_CREDENTIALS.email,
            name: 'Scott',
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
