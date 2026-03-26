import { sampleProperties } from '@/data/properties';
import { buildBuyerPropertyFeed } from '@/utils/buildBuyerPropertyFeed';

// Export the shared property feed builder
export { buildBuyerPropertyFeed };

// Export the protected properties from properties.ts
export const demoProperties = sampleProperties;

export const locations = [
  'Lusaka',
  'Kabwe', 
  'Kitwe',
  'Livingstone',
  'Chilanga',
  'Ndola',
  'Mufulira',
  'Silverest'
];

export const propertyTypes = [
  'house',
  'apartment', 
  'plot',
  'commercial'
];

export const priceRanges = [
  { label: 'Under ZMW 300,000', min: 0, max: 300000 },
  { label: 'ZMW 300,000 - 500,000', min: 300000, max: 500000 },
  { label: 'ZMW 500,000 - 800,000', min: 500000, max: 800000 },
  { label: 'ZMW 800,000 - 1,200,000', min: 800000, max: 1200000 },
  { label: 'Over ZMW 1,200,000', min: 1200000, max: 9999999 }
];
