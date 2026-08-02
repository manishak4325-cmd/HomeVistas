import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareState {
  propertyIds: string[];
  addProperty: (id: string) => void;
  removeProperty: (id: string) => void;
  clearProperties: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      propertyIds: [],
      addProperty: (id) => {
        const currentIds = get().propertyIds;
        if (currentIds.length < 4 && !currentIds.includes(id)) {
          set({ propertyIds: [...currentIds, id] });
        }
      },
      removeProperty: (id) =>
        set((state) => ({
          propertyIds: state.propertyIds.filter((pId) => pId !== id),
        })),
      clearProperties: () => set({ propertyIds: [] }),
    }),
    {
      name: 'compare-storage',
    }
  )
);
