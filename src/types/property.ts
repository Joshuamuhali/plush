export type PropertyType = 'shop' | 'villa' | 'apartment' | 'townhouse' | 'office' | 'land' | 'plot' | 'house';

export interface PropertyFeature {
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  area: number; // in square meters
}

export interface PropertyLocation {
  address: string;
  city: string;
  district: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PropertyPrice {
  amount: number;
  currency: string;
  period?: 'month' | 'year' | 'total';
  isNegotiable: boolean;
}

export interface PropertyImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  location: PropertyLocation;
  price: PropertyPrice;
  features: PropertyFeature;
  images: PropertyImage[];
  isFeatured: boolean;
  status: 'available' | 'pending' | 'sold' | 'rented';
  listedAt: string; // ISO date string
  updatedAt: string; // ISO date string
  slug: string;
  amenities?: string[];
  agent?: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
}
