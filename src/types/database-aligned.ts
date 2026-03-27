// Database-aligned types for canonical schema usage

export interface PropertyListing {
  id: string;
  seller_id: string;
  title: string;
  description?: string;
  slug: string;
  property_type: 'house' | 'apartment' | 'townhouse' | 'villa' | 'land' | 'plot' | 'commercial' | 'office' | 'shop' | 'warehouse' | 'industrial' | 'other';
  review_status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  publish_status: 'unpublished' | 'published' | 'paused' | 'sold' | 'archived';
  price: number;
  currency: string;
  is_negotiable: boolean;
  bedrooms: number;
  bathrooms: number;
  area_m2: number;
  parking_spaces: number;
  furnished: boolean;
  has_pool: boolean;
  has_garden: boolean;
  has_security: boolean;
  has_electricity: boolean;
  has_water: boolean;
  has_internet: boolean;
  address_line?: string;
  location: string;
  city: string;
  district?: string;
  province?: string;
  postal_code?: string;
  featured_image_url?: string;
  views_count: number;
  inquiries_count: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface PropertyImageRecord {
  id: string;
  property_id: string;
  image_url: string;
  storage_path?: string;
  alt_text?: string;
  description?: string;
  is_primary: boolean;
  display_order: number;
  uploaded_by?: string;
  file_size?: number;
  dimensions?: string;
  created_at: string;
}

export interface PublicPropertyFeed {
  id: string;
  seller_id: string;
  title: string;
  description?: string;
  slug: string;
  property_type: string;
  price: number;
  currency: string;
  location: string;
  city: string;
  featured_image_url?: string;
  views_count: number;
  inquiries_count: number;
  created_at: string;
  // Additional fields from the public view
  seller_name?: string;
  seller_avatar_url?: string;
}
