import { create } from 'zustand';

export interface MatchmakerPreferences {
  budget: { min: number; max: number };
  type: string;
  bedrooms: number | null;
  cities: string[];
  amenities: string[];
  lifestyle: string;
  pets: boolean;
  wfh: boolean;
}

interface MatchmakerState {
  preferences: MatchmakerPreferences;
  setPreferences: (prefs: Partial<MatchmakerPreferences>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: MatchmakerPreferences = {
  budget: { min: 0, max: 10000000 },
  type: '',
  bedrooms: null,
  cities: [],
  amenities: [],
  lifestyle: '',
  pets: false,
  wfh: false,
};

export const useMatchmakerStore = create<MatchmakerState>((set) => ({
  preferences: defaultPreferences,
  setPreferences: (prefs) =>
    set((state) => ({
      preferences: { ...state.preferences, ...prefs },
    })),
  resetPreferences: () => set({ preferences: defaultPreferences }),
}));
