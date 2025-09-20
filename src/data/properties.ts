import { Property } from '@/types/property';

// Images for Chilanga property
const chilangaImages = [
  { url: '/chilanga1.jpeg', alt: '25x40m Plot in Chilanga - Main Entrance', isPrimary: true },
  { url: '/chilanga2.jpeg', alt: '25x40m Plot in Chilanga - Plot Layout', isPrimary: false },
  { url: '/chilanga3.jpeg', alt: '25x40m Plot in Chilanga - Scenic View', isPrimary: false },
  { url: '/chilanga4.jpeg', alt: '25x40m Plot in Chilanga - Nearby Development', isPrimary: false },
];

// Images for Silverest property
const silverestImages = [
  { url: '/Silverest%201.5km1.jpeg', alt: 'Silverest Plot - Front View', isPrimary: true },
  { url: '/Silverest%201.5km2.jpeg', alt: 'Silverest Plot - Side View', isPrimary: false },
  { url: '/Silverest%201.5km3.jpeg', alt: 'Silverest Plot - Location View', isPrimary: false },
  { url: '/Silverest%201.5km4.jpeg', alt: 'Silverest Plot - Surrounding Area', isPrimary: false },
];

// Images for Luxury Home
const luxuryHomeImages = [
  { url: '/IMG_3908.jpeg', alt: 'Luxury Home - Front View', isPrimary: true },
  { url: '/IMG_3909.jpeg', alt: 'Luxury Home - Living Area', isPrimary: false },
  { url: '/IMG_3910.jpeg', alt: 'Luxury Home - Bedroom', isPrimary: false },
  { url: '/IMG_3911.jpeg', alt: 'Luxury Home - Backyard', isPrimary: false },
];

export const sampleProperties: Property[] = [
  // Plot 1: 25x40 Plot in Chilanga
  {
    id: '1',
    title: '25x40m Prime Plot in Chilanga',
    description: 'A premium 1000 square meter (25m x 40m) residential plot located in the rapidly developing area of Chilanga. This prime property offers a perfect opportunity to build your dream home in a serene environment with easy access to major amenities. The plot is situated in a well-planned neighborhood with excellent road infrastructure and all necessary utilities available nearby.',
    type: 'plot',
    category: 'residential',
    location: {
      address: 'Chilanga District, Off Leopards Hill Road',
      city: 'Lusaka',
      district: 'Chilanga',
      coordinates: {
        lat: -15.5515,
        lng: 28.3036
      },
      landmarks: [
        '2km from Leopards Hill Mall',
        '3km from Makeni Shopping Center',
        '5km from University of Zambia (UNZA)',
        '15km from Lusaka City Center'
      ]
    },
    price: { 
      amount: 180000, 
      currency: 'ZMW', 
      isNegotiable: true,
      paymentTerms: ['Cash', 'Bank Transfer', 'Payment Plan Available']
    },
    features: { 
      area: 1000, // 25m x 40m = 1000 sqm
      dimensions: '25m x 40m',
      zoning: 'Residential',
      terrain: 'Flat and well-drained',
      accessibility: 'All-weather road access',
      fencing: 'Not fenced',
      topography: 'Slightly elevated with good natural drainage',
      view: 'Panoramic views of surrounding area',
      soilType: 'Stable clay-loam soil',
      vegetation: 'Minimal clearing required'
    },
    area: 1000, // For backward compatibility
    images: chilangaImages,
    isFeatured: true,
    status: 'available',
    listedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: '25x40-plot-chilanga',
    amenities: [
      'Title Deed Available',
      'Access to Paved Road',
      'Water Connection Available',
      'Electricity Available',
      'Sewer System Available',
      'Security Patrolled Area',
      'Nearby Schools',
      'Shopping Centers in Proximity',
      'Public Transport Access',
      'Quiet Neighborhood',
      'Good Road Network',
      'Drainage System',
      'Street Lighting',
      'Nearby Medical Facilities'
    ],
    additionalInfo: {
      ownership: 'Freehold',
      planningPermission: 'Residential development approved',
      infrastructure: {
        water: 'Mains connection available',
        electricity: 'Grid connection available',
        roads: 'Paved access road',
        internet: 'Fiber optic available',
        sewerage: 'Mains connection available'
      },
      developmentPotential: 'Ideal for residential housing development',
      investmentPotential: 'High appreciation potential in the area',
      neighborhood: 'Growing residential area with mixed development',
      security: 'Low crime rate, community watch program',
      futureDevelopment: 'Planned commercial center within 2km radius'
    },
    documents: [
      { name: 'Title Deed', type: 'pdf', url: '/documents/chilanga-title-deed.pdf' },
      { name: 'Zoning Certificate', type: 'pdf', url: '/documents/chilanga-zoning.pdf' },
      { name: 'Survey Diagram', type: 'jpg', url: '/documents/chilanga-survey.jpg' }
    ],
    virtualTour: 'https://my.matterport.com/show/?m=1234567890',
    videoTour: 'https://www.youtube.com/embed/example123',
    contactPerson: {
      name: 'John Banda',
      phone: '+260 97 123 4567',
      email: 'john.banda@plushproperties.com',
      role: 'Sales Executive',
      availableHours: 'Mon-Fri 8:00 AM - 5:00 PM',
      languages: ['English', 'Nyanja', 'Bemba']
    },
    similarProperties: ['2', '3']
  },
  // Luxury Home in Lusaka
  {
    id: 'home-lux-1',
    title: 'Luxury 4-Bedroom Home',
    description: 'Stunning 4-bedroom luxury home with all self-contained en-suite bathrooms. Features include a swimming pool, laundry room, TV room, workers quarters, study room, extra room, and pantry. Situated on a 1709 sqm plot size near American International School.',
    type: 'house',
    bedrooms: 4,
    bathrooms: 4,
    location: {
      address: 'Near American International School',
      city: 'Lusaka',
      district: 'Lusaka'
    },
    price: { amount: 350000, currency: 'USD', isNegotiable: false },
    features: { 
      area: 1709,
      bedrooms: 4,
      bathrooms: 4,
      parking: 2
    },
    area: 1709,
    images: luxuryHomeImages,
    isFeatured: true,
    status: 'available',
    listedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: 'luxury-4-bedroom-home-lusaka',
    amenities: [
      'Swimming Pool',
      'All En-suite Bathrooms',
      'Laundry Room',
      'TV Room',
      'Workers Quarters',
      'Study Room',
      'Pantry',
      'Large Plot (1709 sqm)',
      'Near American International School'
    ]
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
    area: 900, // For backward compatibility
    images: silverestImages,
    isFeatured: true,
    status: 'available',
    listedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: 'silverest-plot-unilus',
    amenities: ['Title Deed', 'Access Road', 'Gated Community', 'Near UNILUS']
  },
];
