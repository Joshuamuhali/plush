import { Property } from '@/types/property';

// Images for Chilanga property
const chilangaImages = [
  { url: '/chilanga1.jpeg', alt: 'Chilanga Plot - Front View', isPrimary: true },
  { url: '/chilanga2.jpeg', alt: 'Chilanga Plot - Side View', isPrimary: false },
  { url: '/chilanga3.jpeg', alt: 'Chilanga Plot - Location View', isPrimary: false },
  { url: '/chilanga4.jpeg', alt: 'Chilanga Plot - Surrounding Area', isPrimary: false },
];

// Images for Silverest property
const silverestImages = [
  { url: '/Silverest 1.5km1.jpeg', alt: 'Silverest Plot - Front View', isPrimary: true },
  { url: '/Silverest 1.5km2.jpeg', alt: 'Silverest Plot - Side View', isPrimary: false },
  { url: '/Silverest 1.5km3.jpeg', alt: 'Silverest Plot - Location View', isPrimary: false },
  { url: '/Silverest 1.5km4.jpeg', alt: 'Silverest Plot - Surrounding Area', isPrimary: false },
];

export const sampleProperties: Property[] = [
  // Shops in Kabulonga
  {
    id: 'shop-kab-1',
    title: 'Modern Shop in Kabulonga',
    description: 'Prime location shop in Kabulonga, perfect for retail business. 80 sqm with high foot traffic.',
    type: 'shop',
    location: {
      address: '123 Kabulonga Road',
      city: 'Lusaka',
      district: 'Kabulonga'
    },
    price: { amount: 2000, currency: 'USD', period: 'month', isNegotiable: true },
    features: { area: 80 },
    images: [{ url: '/placeholder.svg', alt: 'Shop in Kabulonga', isPrimary: true }],
    isFeatured: true,
    status: 'available',
    listedAt: '2025-01-15',
    updatedAt: '2025-09-01',
    slug: 'modern-shop-kabulonga-1'
  },
  // Apartments in Kabulonga
  {
    id: 'apt-kab-1',
    title: 'Luxury Apartment in Kabulonga',
    description: 'Beautiful 3-bedroom apartment with modern finishes in the heart of Kabulonga. Close to restaurants and shopping.',
    type: 'apartment',
    location: {
      address: '456 Kabulonga Road',
      city: 'Lusaka',
      district: 'Kabulonga'
    },
    price: { amount: 2500, currency: 'USD', period: 'month', isNegotiable: true },
    features: { bedrooms: 3, bathrooms: 2, area: 150 },
    images: [{ url: '/placeholder.svg', alt: 'Luxury Apartment', isPrimary: true }],
    isFeatured: true,
    status: 'available',
    listedAt: '2025-02-10',
    updatedAt: '2025-08-28',
    slug: 'luxury-apartment-kabulonga-1'
  },
  // Plots in Kabulonga
  {
    id: 'plot-kab-1',
    title: 'Residential Plot in Kabulonga',
    description: 'Prime residential plot in Kabulonga, 50x100 feet with all services available. Ready for construction.',
    type: 'plot',
    location: {
      address: 'Plot 789, Kabulonga',
      city: 'Lusaka',
      district: 'Kabulonga'
    },
    price: { amount: 150000, currency: 'USD', period: 'total', isNegotiable: false },
    features: { area: 5000 },
    images: [{ url: '/placeholder.svg', alt: 'Residential Plot', isPrimary: true }],
    isFeatured: true,
    status: 'available',
    listedAt: '2025-03-05',
    updatedAt: '2025-09-02',
    slug: 'residential-plot-kabulonga-1'
  },
  // Houses in Kabulonga
  {
    id: 'house-kab-1',
    title: '4-Bedroom House in Kabulonga',
    description: 'Spacious family home in a quiet Kabulonga neighborhood. Features a large garden and modern amenities.',
    type: 'house',
    location: {
      address: '101 Kabulonga Close',
      city: 'Lusaka',
      district: 'Kabulonga'
    },
    price: { amount: 3500, currency: 'USD', period: 'month', isNegotiable: true },
    features: { bedrooms: 4, bathrooms: 3, area: 300 },
    images: [{ url: '/placeholder.svg', alt: 'Family House', isPrimary: true }],
    isFeatured: true,
    status: 'available',
    listedAt: '2025-04-12',
    updatedAt: '2025-08-30',
    slug: 'house-kabulonga-1'
  },
  // Plot 1: 25x40 Plot in Chilanga
  {
    id: 'plot-chil-1',
    title: '25x40m Plot in Chilanga',
    description: 'Prime residential plot in Chilanga, 25x40 meters with land title. Only 4 kilometers from Farmers Junction. Perfect for residential development with all necessary utilities available nearby.',
    type: 'plot',
    location: {
      address: 'Near Farmers Junction',
      city: 'Chilanga',
      district: 'Chilanga'
    },
    price: { amount: 180000, currency: 'ZMW', isNegotiable: true },
    features: { area: 1000 }, // 25m x 40m = 1000 sqm
    images: chilangaImages,
    isFeatured: true,
    status: 'available',
    listedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: '25x40-plot-chilanga',
    amenities: ['Title Deed', 'Access Road', 'Near Shopping Center', 'Quiet Neighborhood']
  },
  // Plot 2: Silverest 1.5km from Unilus
  {
    id: 'plot-silverest-1',
    title: '30x30m Plot in Silverest',
    description: 'Premium plot in Silverest, 1.5km from Unilus turn left (south before Ratsa). Each piece of the sub-divided plot is going for K350,000. Ideal for residential development with great potential for appreciation.',
    type: 'plot',
    location: {
      address: '1.5km from Unilus turn left, South before Ratsa',
      city: 'Lusaka',
      district: 'Silverest'
    },
    price: { amount: 350000, currency: 'ZMW', isNegotiable: true },
    features: { area: 900 }, // 30m x 30m = 900 sqm
    images: silverestImages,
    isFeatured: true,
    status: 'available',
    listedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: 'silverest-plot-unilus',
    amenities: ['Title Deed', 'Access Road', 'Gated Community', 'Near UNILUS']
  },
  // Properties in other areas
  {
    id: 'shop-wood-1',
    title: 'Corner Shop in Woodlands',
    description: 'High-traffic corner shop in Woodlands, perfect for retail business.',
    type: 'shop',
    location: {
      address: '200 Woodlands Road',
      city: 'Lusaka',
      district: 'Woodlands'
    },
    price: { amount: 1800, currency: 'USD', period: 'month', isNegotiable: true },
    features: { area: 60 },
    images: [{ url: '/placeholder.svg', alt: 'Corner Shop', isPrimary: true }],
    isFeatured: false,
    status: 'available',
    listedAt: '2025-05-20',
    updatedAt: '2025-08-25',
    slug: 'corner-shop-woodlands-1'
  },
  {
    id: 'apt-avon-1',
    title: 'Modern Apartment in Avondale',
    description: 'Newly renovated 2-bedroom apartment in Avondale, close to amenities.',
    type: 'apartment',
    location: {
      address: '300 Avondale Road',
      city: 'Lusaka',
      district: 'Avondale'
    },
    price: { amount: 1800, currency: 'USD', period: 'month', isNegotiable: false },
    features: { bedrooms: 2, bathrooms: 2, area: 120 },
    images: [{ url: '/placeholder.svg', alt: 'Modern Apartment', isPrimary: true }],
    isFeatured: true,
    status: 'available',
    listedAt: '2025-06-15',
    updatedAt: '2025-08-28',
    slug: 'modern-apartment-avondale-1'
  }
];
