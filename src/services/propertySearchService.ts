import { Property } from '@/types/property';
import { sampleProperties } from '@/data/properties';

// Get all properties (in a real app, this would be an API call)
export const getAllProperties = (): Property[] => {
  return sampleProperties;
};

// Search properties with Ctrl+F like functionality
export const searchProperties = (query: string, properties: Property[]): Property[] => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  return properties.filter(property => {
    // Search in multiple fields
    const searchableText = [
      property.title,
      property.description,
      property.location.address,
      property.location.city,
      property.type,
      property.status,
      property.features.bedrooms?.toString(),
      property.features.bathrooms?.toString(),
      property.features.area?.toString(),
      property.price.amount.toString(),
      property.price.currency,
    ].join(' ').toLowerCase();
    
    return searchableText.includes(searchTerm);
  });
};
