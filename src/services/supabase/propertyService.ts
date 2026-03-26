import { supabase } from '@/lib/supabase';
import type { Property, ListingType, ReviewStatus, PublishStatus } from '@/types/database';

export interface PropertyFilters {
  property_type?: ListingType;
  city?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export interface CreatePropertyDto {
  seller_id: string;
  title: string;
  description?: string;
  property_type: ListingType;
  price: number;
  currency: string;
  is_negotiable: boolean;
  bedrooms?: number;
  bathrooms?: number;
  area_m2: number;
  parking_spaces?: number;
  furnished?: boolean;
  has_pool?: boolean;
  has_garden?: boolean;
  has_security?: boolean;
  has_electricity?: boolean;
  has_water?: boolean;
  has_internet?: boolean;
  address_line?: string;
  location: string;
  city: string;
  district?: string;
  province?: string;
  postal_code?: string;
}

export class PropertyService {
  // PUBLISHED PROPERTIES (Public) - Uses public_properties_feed view
  static async getPublishedProperties(filters?: PropertyFilters) {
    let query = supabase.from('public_properties_feed').select('*');
    
    if (filters?.property_type) {
      query = query.eq('property_type', filters.property_type);
    }
    if (filters?.city) {
      query = query.eq('city', filters.city);
    }
    if (filters?.min_price) {
      query = query.gte('price', filters.min_price);
    }
    if (filters?.max_price) {
      query = query.lte('price', filters.max_price);
    }
    if (filters?.bedrooms) {
      query = query.gte('bedrooms', filters.bedrooms);
    }
    if (filters?.bathrooms) {
      query = query.gte('bathrooms', filters.bathrooms);
    }
    
    return await query;
  }

  // SELLER PROPERTIES (Owner only) - RLS handles access control
  static async getSellerProperties(sellerId: string) {
    return supabase
      .from('properties')
      .select('*')
      .eq('seller_id', sellerId)
      .eq('deleted_at', null); // RLS ensures seller only sees own
  }

  // ADMIN PROPERTIES (All) - Admin bypasses RLS
  static async getAllProperties() {
    return supabase.from('properties').select('*');
  }

  // CREATE PROPERTY - Uses correct schema fields
  static async createProperty(property: CreatePropertyDto) {
    return await supabase
      .from('properties')
      .insert({
        seller_id: property.seller_id,
        title: property.title,
        description: property.description,
        property_type: property.property_type,
        price: property.price,
        currency: property.currency,
        is_negotiable: property.is_negotiable,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area_m2: property.area_m2,
        parking_spaces: property.parking_spaces,
        furnished: property.furnished,
        has_pool: property.has_pool,
        has_garden: property.has_garden,
        has_security: property.has_security,
        has_electricity: property.has_electricity,
        has_water: property.has_water,
        has_internet: property.has_internet,
        address_line: property.address_line,
        location: property.location,
        city: property.city,
        district: property.district,
        province: property.province,
        postal_code: property.postal_code,
        review_status: 'draft', // Schema default
        publish_status: 'unpublished' // Schema default
      })
      .select()
      .single();
  }

  // UPDATE REVIEW STATUS
  static async updateReviewStatus(propertyId: string, status: ReviewStatus, approvedBy?: string) {
    const updateData: any = {
      review_status: status,
      approved_at: status === 'approved' ? new Date().toISOString() : null,
      approved_by: status === 'approved' ? approvedBy : null,
      rejected_at: status === 'rejected' ? new Date().toISOString() : null,
      rejected_by: status === 'rejected' ? approvedBy : null,
      rejection_reason: status === 'rejected' ? 'Needs revision' : null
    };

    return await supabase
      .from('properties')
      .update(updateData)
      .eq('id', propertyId)
      .select()
      .single();
  }

  // UPDATE PUBLISH STATUS
  static async updatePublishStatus(propertyId: string, status: PublishStatus) {
    return await supabase
      .from('properties')
      .update({ publish_status: status })
      .eq('id', propertyId)
      .select()
      .single();
  }

  // DELETE PROPERTY (Soft delete)
  static async deleteProperty(propertyId: string) {
    return await supabase
      .from('properties')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', propertyId)
      .select()
      .single();
  }
}
