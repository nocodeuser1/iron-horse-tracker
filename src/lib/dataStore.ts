import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PermitRequirement } from '../types';
import titleVData from './data/sample-requirements.json';
import pbrData from './data/pbr-requirements.json';

interface DataState {
  titleVRequirements: PermitRequirement[];
  pbrRequirements: PermitRequirement[];
  toggleCompleted: (id: string, permitType: string) => void;
  markCompleted: (id: string, date: string, permitType: string) => void;
  markIncomplete: (id: string, permitType: string) => void;
  getRequirements: (permitType: string) => PermitRequirement[];
  resetData: (permitType: string) => void;
}

const initialTitleVRequirements = titleVData as PermitRequirement[];
const initialPBRRequirements = pbrData as PermitRequirement[];

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      titleVRequirements: initialTitleVRequirements,
      pbrRequirements: initialPBRRequirements,
      
      getRequirements: (permitType: string) => {
        const state = get();
        return permitType === 'pbr' ? state.pbrRequirements : state.titleVRequirements;
      },
      
      toggleCompleted: (id: string, permitType: string) =>
        set((state) => {
          const key = permitType === 'pbr' ? 'pbrRequirements' : 'titleVRequirements';
          return {
            [key]: state[key].map((r) =>
              r.id === id
                ? {
                    ...r,
                    completedDate: r.completedDate
                      ? null
                      : new Date().toISOString().split('T')[0],
                  }
                : r
            ),
          };
        }),
      
      markCompleted: (id: string, date: string, permitType: string) =>
        set((state) => {
          const key = permitType === 'pbr' ? 'pbrRequirements' : 'titleVRequirements';
          return {
            [key]: state[key].map((r) =>
              r.id === id ? { ...r, completedDate: date } : r
            ),
          };
        }),
      
      markIncomplete: (id: string, permitType: string) =>
        set((state) => {
          const key = permitType === 'pbr' ? 'pbrRequirements' : 'titleVRequirements';
          return {
            [key]: state[key].map((r) =>
              r.id === id ? { ...r, completedDate: null } : r
            ),
          };
        }),
      
      resetData: (permitType: string) =>
        set({
          [permitType === 'pbr' ? 'pbrRequirements' : 'titleVRequirements']:
            permitType === 'pbr' ? initialPBRRequirements : initialTitleVRequirements,
        }),
    }),
    {
      name: 'iron-horse-data',
      version: 2,
    }
  )
);
