import { sampleProperties } from '@/data/properties';
import { Property } from '@/types/property';

// Shared property feed builder for all buyer-facing property displays
export function buildBuyerPropertyFeed<T extends { slug?: string; id?: string }>(
  supabaseProperties: T[] = []
) {
  // RULE: properties.ts is the protected seed inventory source. Supabase is the live inventory source.
  // Buyer-facing property feeds must render properties.ts first, then append Supabase results below.
  return [...sampleProperties, ...supabaseProperties];
}

// Filter function that works with combined property feed
export function filterBuyerProperties(
  properties: Property[],
  filters: {
    location?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    searchQuery?: string;
  }
): Property[] {
  return properties.filter(property => {
    // Always include protected demo properties unless explicitly filtered out
    const isProtectedDemo = sampleProperties.some(p => p.id === property.id);
    if (isProtectedDemo && !filters.location && !filters.propertyType && !filters.minPrice && !filters.maxPrice && !filters.minSize && !filters.searchQuery) {
      return true;
    }
    
    // Apply filters to all properties
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const locationStr = typeof property.location === 'string' ? property.location : property.location.address;
      const matchesSearch = (
        property.title.toLowerCase().includes(searchLower) ||
        locationStr.toLowerCase().includes(searchLower) ||
        property.type.toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }
    
    if (filters.location) {
      const locationStr = typeof property.location === 'string' ? property.location : property.location.address;
      const locationMatch = locationStr.toLowerCase().includes(filters.location.toLowerCase());
      if (!locationMatch) return false;
    }
    
    if (filters.propertyType) {
      if (property.type !== filters.propertyType) return false;
    }
    
    const propertyPrice = typeof property.price === 'number' ? property.price : property.price.amount;
    if (filters.minPrice !== undefined && propertyPrice < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && propertyPrice > filters.maxPrice) return false;
    
    const propertyArea = property.area || property.features.area;
    if (filters.minSize !== undefined && propertyArea && propertyArea < filters.minSize) return false;
    
    return true;
  });
}

// Get only Supabase properties (excluding protected demo properties)
export function getSupabasePropertiesOnly(properties: Property[]): Property[] {
  return properties.filter(property => 
    !sampleProperties.some(p => p.id === property.id)
  );
}
