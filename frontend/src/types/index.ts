export interface Property {
  _id: string;
  title: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  city: string;
  images: string[];
  amenities: string[];
  matchScore?: number;
  neighborhood?: {
    name: string;
    overallScore: number;
  };
}
