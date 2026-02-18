import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DarkModeState {
  dark: boolean;
  toggle: () => void;
}

export const useDarkMode = create<DarkModeState>()(
  persist(
    (set) => ({
      dark: false,
      toggle: () =>
        set((s) => {
          const next = !s.dark;
          document.documentElement.classList.toggle('dark', next);
          return { dark: next };
        }),
    }),
    {
      name: 'iron-horse-dark-mode',
      onRehydrateStorage: () => (state) => {
        if (state?.dark) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
