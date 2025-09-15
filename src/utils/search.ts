import { Property, PropertyType } from '@/types/property';

export const searchProperties = (properties: Property[], query: string): Property[] => {
  if (!query.trim()) return [];
  
  const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
  
  return properties.filter(property => {
    const searchText = `${property.title} ${property.description} ${property.location.district} ${property.location.city} ${property.type}`.toLowerCase();
    return searchTerms.every(term => searchText.includes(term));
  });
};

export const groupPropertiesByType = (properties: Property[]): Record<string, Property[]> => {
  return properties.reduce<Record<string, Property[]>>((acc, property) => {
    const type = property.type === 'plot' ? 'Plot' : 
                 property.type === 'house' ? 'House' :
                 property.type.charAt(0).toUpperCase() + property.type.slice(1);
    
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(property);
    return acc;
  }, {});
};
