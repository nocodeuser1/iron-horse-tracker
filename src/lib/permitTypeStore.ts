import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PermitType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface PermitTypeState {
  permitTypes: PermitType[];
  activePermitId: string;
  addPermitType: (name: string, description: string) => void;
  removePermitType: (id: string) => void;
  setActivePermit: (id: string) => void;
  getActivePermit: () => PermitType | undefined;
}

const DEFAULT_PERMIT_TYPES: PermitType[] = [
  {
    id: 'title-v',
    name: 'Title V',
    description: 'Air quality operating permit for major sources under Title V of the Clean Air Act',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pbr',
    name: 'PBR',
    description: 'Permit by Rule - standard authorization for specific types of air emission sources',
    createdAt: new Date().toISOString(),
  },
];

export const usePermitTypeStore = create<PermitTypeState>()(
  persist(
    (set, get) => ({
      permitTypes: DEFAULT_PERMIT_TYPES,
      activePermitId: 'title-v', // Default to Title V
      
      addPermitType: (name: string, description: string) => {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        const newType: PermitType = {
          id,
          name,
          description,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          permitTypes: [...state.permitTypes, newType],
        }));
      },
      
      removePermitType: (id: string) => {
        set((state) => ({
          permitTypes: state.permitTypes.filter((p) => p.id !== id),
          // Switch to first permit if deleting active one
          activePermitId: state.activePermitId === id 
            ? state.permitTypes[0]?.id || 'title-v'
            : state.activePermitId,
        }));
      },
      
      setActivePermit: (id: string) => {
        set({ activePermitId: id });
      },
      
      getActivePermit: () => {
        const state = get();
        return state.permitTypes.find((p) => p.id === state.activePermitId);
      },
    }),
    {
      name: 'iron-horse-permit-types',
      version: 1,
    }
  )
);
