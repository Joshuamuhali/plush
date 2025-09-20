export type PropertyType = 'shop' | 'villa' | 'apartment' | 'townhouse' | 'office' | 'land' | 'plot' | 'house';

export interface PropertyFeature {
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  area: number; // in square meters
  dimensions?: string;
  zoning?: string;
  terrain?: string;
  accessibility?: string;
  fencing?: string;
  topography?: string;
  view?: string;
  soilType?: string;
  vegetation?: string;
}

export interface PropertyLocation {
  address: string;
  city: string;
  district: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  landmarks?: string[];
}

export interface PropertyPrice {
  amount: number;
  currency: string;
  period?: 'month' | 'year' | 'total';
  isNegotiable: boolean;
  paymentTerms?: string[];
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
  category?: string;
  location: string | PropertyLocation;  // Allow string for backward compatibility
  price: number | PropertyPrice;       // Allow number for backward compatibility
  currency?: string;                   // For simplified price format
  features: Partial<PropertyFeature>;   // Make all features optional
  images: PropertyImage[] | string[];  // Allow string array for image URLs
  isFeatured?: boolean;
  status: 'available' | 'pending' | 'sold' | 'rented';
  listedAt?: string;
  updatedAt?: string;
  slug: string;
  amenities?: string[];
  bedrooms?: number;                   // For simplified access
  bathrooms?: number;                  // For simplified access
  yearBuilt?: number;                  // Year the property was built
  garage?: boolean;                    // Whether the property has a garage
  area?: number;                       // Total area in square meters
  parkingSpaces?: number;              // Number of parking spaces available
  floors?: number;                     // Number of floors
  hasPool?: boolean;                   // Whether the property has a pool
  hasGarden?: boolean;                 // Whether the property has a garden
  hasAirConditioning?: boolean;        // Whether the property has air conditioning
  hasHeating?: boolean;                // Whether the property has heating
  furnished?: boolean;                 // Whether the property is furnished
  agent?: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  image?: string;                     // For simplified image access
  additionalInfo?: {
    ownership?: string;
    planningPermission?: string;
    infrastructure?: {
      water?: string;
      electricity?: string;
      roads?: string;
      internet?: string;
      sewerage?: string;
    };
    developmentPotential?: string;
    investmentPotential?: string;
    neighborhood?: string;
    security?: string;
    futureDevelopment?: string;
  };
  documents?: Array<{
    name: string;
    type: string;
    url: string;
  }>;
  virtualTour?: string;
  videoTour?: string;
  contactPerson?: {
    name: string;
    phone: string;
    email: string;
    role?: string;
    availableHours?: string;
    languages?: string[];
  };
  similarProperties?: string[];
}
