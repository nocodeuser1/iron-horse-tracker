import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PermitRequirement } from '../types';
import sampleData from './data/sample-requirements.json';

interface DataState {
  requirements: PermitRequirement[];
  toggleCompleted: (id: string) => void;
  markCompleted: (id: string, date: string) => void;
  markIncomplete: (id: string) => void;
  resetData: () => void;
}

const initialRequirements = sampleData as PermitRequirement[];

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      requirements: initialRequirements,
      
      toggleCompleted: (id: string) =>
        set((state) => ({
          requirements: state.requirements.map((r) =>
            r.id === id
              ? {
                  ...r,
                  completedDate: r.completedDate
                    ? null
                    : new Date().toISOString().split('T')[0],
                }
              : r
          ),
        })),
      
      markCompleted: (id: string, date: string) =>
        set((state) => ({
          requirements: state.requirements.map((r) =>
            r.id === id ? { ...r, completedDate: date } : r
          ),
        })),
      
      markIncomplete: (id: string) =>
        set((state) => ({
          requirements: state.requirements.map((r) =>
            r.id === id ? { ...r, completedDate: null } : r
          ),
        })),
      
      resetData: () => set({ requirements: initialRequirements }),
    }),
    {
      name: 'iron-horse-data',
      version: 1,
    }
  )
);
