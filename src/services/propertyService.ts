import { Property, PropertyType, PropertyLocation, PropertyPrice } from "@/types/property";
import { properties as showcaseProperties } from '../components/PropertyShowcase';

// Map the showcase properties to our Property type
interface ShowcaseProperty {
  id: string;
  title: string;
  type: string;
  price: number | string;
  location: string;
  image: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number | string;
  status: 'active' | 'inactive';
  slug: string;
}

/**
 * Parse a price string and extract amount and period
 */
function parsePrice(price: number | string): { amount: number; period: 'month' | 'year' | 'total' } {
  const priceStr = String(price);
  const priceMatch = priceStr.match(/K?\s*([\d,]+)(?:\s*\/\s*(\w+))?/);
  const amount = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
  
  // Default to total if no period is specified
  let period: 'month' | 'year' | 'total' = 'total';
  if (priceMatch && priceMatch[2]) {
    const periodStr = priceMatch[2].toLowerCase();
    if (periodStr.startsWith('month')) period = 'month';
    else if (periodStr.startsWith('year')) period = 'year';
  }
  
  return { amount, period };
}

/**
 * Parse area value from string or number to square meters
 */
function parseArea(area: number | string | undefined): number {
  if (typeof area === 'number') return area;
  if (!area) return 0;
  
  const areaStr = String(area).toLowerCase();
  if (areaStr.includes('sq ft')) {
    return parseInt(areaStr.replace(/[^0-9]/g, '')) * 0.092903; // Convert sq ft to sq m
  }
  if (areaStr.includes('acre')) {
    const acres = parseFloat(areaStr.replace(/[^0-9.]/g, '')) || 0;
    return Math.round(acres * 4046.86); // Convert acres to square meters
  }
  
  // Try to parse as a plain number
  return parseFloat(areaStr) || 0;
}

/**
 * Convert showcase properties to our internal Property type
 */
export const getProperties = (): Property[] => {
  const typeMap: Record<string, PropertyType> = {
    'House': 'house',
    'Apartment': 'apartment',
    'Shop': 'shop',
    'Plot': 'plot',
    'Townhouse': 'townhouse',
    'Office': 'office',
    'Villa': 'villa',
    'Land': 'land'
  };

  return showcaseProperties.map((property) => {
    const { amount, period } = parsePrice(property.price);
    const area = parseArea(property.area);
    
    // Convert location string to PropertyLocation
    const [address, city = 'Lusaka'] = property.location.split(',').map(s => s.trim());
    const location: PropertyLocation = {
      address,
      city,
      district: address // Using address as district for now
    };

    // Create property object
    const price: PropertyPrice = {
      amount: typeof property.price === 'number' ? property.price : amount,
      period,
      currency: 'ZMW',
      isNegotiable: false
    };

    return {
      id: property.id,
      title: property.title,
      description: `${property.type} in ${property.location}`,
      type: typeMap[property.type] || 'house',
      location,
      price,
      features: {
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        area,
        parking: property.bedrooms ? Math.ceil((property.bedrooms || 1) / 2) : 1 // Estimate parking spaces
      },
      images: [{
        url: property.image || '/placeholder.svg',
        alt: property.title,
        isPrimary: true
      }],
      isFeatured: property.status === 'active',
      status: property.status === 'active' ? 'available' : 'unavailable',
      listedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slug: property.slug || property.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
    } as Property;
  });
};

// For backward compatibility
export const initializePropertyData = getProperties;
