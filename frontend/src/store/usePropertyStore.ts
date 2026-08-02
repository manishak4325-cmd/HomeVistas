import { create } from 'zustand';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  city: string;
  images: string[];
  amenities: string[];
  status: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  views: number;
  createdAt: string;
}

interface PropertyState {
  properties: Property[];
  setProperties: (properties: Property[]) => void;
  favorites: Property[];
  setFavorites: (favorites: Property[]) => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  properties: [],
  setProperties: (properties) => set({ properties }),
  favorites: [],
  setFavorites: (favorites) => set({ favorites }),
}));
