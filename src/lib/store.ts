import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ActionType,
  EquipmentType,
  RequirementStatus,
  FilterState,
  PermitRequirement,
} from '../types';

interface UIState {
  filters: FilterState;
  selectedRequirement: PermitRequirement | null;
  detailOpen: boolean;
  sidebarOpen: boolean;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  toggleActionType: (t: ActionType) => void;
  toggleRecurrence: (r: string) => void;
  toggleEquipmentType: (e: EquipmentType) => void;
  toggleStatus: (s: RequirementStatus) => void;
  setSearch: (q: string) => void;
  setDateRange: (start: string | null, end: string | null) => void;
  openDetail: (r: PermitRequirement) => void;
  closeDetail: () => void;
}

const defaultFilters: FilterState = {
  actionTypes: [],
  recurrencePatterns: [],
  equipmentTypes: [],
  statuses: [],
  searchQuery: '',
  dateRange: { start: null, end: null },
};

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

export const useStore = create<UIState>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      selectedRequirement: null,
      detailOpen: false,
      sidebarOpen: false,
      setFilters: (partial) =>
        set((s) => ({ filters: { ...s.filters, ...partial } })),
      resetFilters: () => set({ filters: defaultFilters }),
      toggleActionType: (t) =>
        set((s) => ({
          filters: { ...s.filters, actionTypes: toggle(s.filters.actionTypes, t) },
        })),
      toggleRecurrence: (r) =>
        set((s) => ({
          filters: {
            ...s.filters,
            recurrencePatterns: toggle(s.filters.recurrencePatterns, r),
          },
        })),
      toggleEquipmentType: (e) =>
        set((s) => ({
          filters: {
            ...s.filters,
            equipmentTypes: toggle(s.filters.equipmentTypes, e),
          },
        })),
      toggleStatus: (s) =>
        set((state) => ({
          filters: {
            ...state.filters,
            statuses: toggle(state.filters.statuses, s),
          },
        })),
      setSearch: (q) =>
        set((s) => ({ filters: { ...s.filters, searchQuery: q } })),
      setDateRange: (start, end) =>
        set((s) => ({ filters: { ...s.filters, dateRange: { start, end } } })),
      openDetail: (r) => set({ selectedRequirement: r, detailOpen: true }),
      closeDetail: () => set({ selectedRequirement: null, detailOpen: false }),
    }),
    {
      name: 'iron-horse-filters',
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);
