import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleProperties } from "@/data/properties";
import type { Property as PropertyType, PropertyImage, PropertyLocation, PropertyFeature } from "@/types/property";
import { ArrowLeft, Bath, Bed, Home, Layers, MapPin, MessageCircle, Phone, Ruler } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Using sampleProperties as fallback if showcaseProperties doesn't exist
const showcaseProperties = sampleProperties;

// Extend the Property type to include our additional fields
type ExtendedProperty = Omit<PropertyType, 'features'> & {
  image?: string;
  features?: PropertyFeature & {
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
  };
};

// Helper function to get image URL from various formats
const getImageUrl = (image: string | PropertyImage): string => {
  if (typeof image === 'string') return image;
  if ('url' in image) return image.url;
  return '';
};

// Helper to get location string from various formats
const getLocationString = (location: string | PropertyLocation): string => {
  if (typeof location === 'string') return location;
  return [location.address, location.city].filter(Boolean).join(', ');
};

// Helper to get price as number
const getPriceAsNumber = (price: number | { amount: number }): number => {
  if (typeof price === 'number') return price;
  return price.amount;
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Format price with commas
  const formatPrice = (price: number | { amount: number; currency?: string }): string => {
    const amount = typeof price === 'number' ? price : price.amount;
    const currency = typeof price === 'object' && price.currency ? price.currency : 'ZMW';
    return `${currency} ${amount.toLocaleString()}`;
  };

  // Format area based on property type
  const formatArea = (area: number, type: string): string => {
    return type.toLowerCase() === 'plot' || type.toLowerCase() === 'land' 
      ? `${area} acres` 
      : `${area} m²`;
  };

  // Helper function to normalize property data
  const normalizeProperty = (p: any): ExtendedProperty => {
    const baseProperty: ExtendedProperty = {
      ...p,
      images: p.images || (p.image ? [{ url: p.image, alt: p.title, isPrimary: true }] : []),
      features: {
        ...p.features,
        bedrooms: p.bedrooms ?? p.features?.bedrooms,
        bathrooms: p.bathrooms ?? p.features?.bathrooms,
        area: p.area ?? p.features?.area,
      },
      amenities: p.amenities || [],
      description: p.description || '',
      status: p.status || 'available',
      slug: p.slug || p.id
    };

    return baseProperty;
  };

  // Combine and normalize properties from both sources
  const allProperties: ExtendedProperty[] = [
    ...(sampleProperties?.map(normalizeProperty) || []),
    ...(showcaseProperties?.map(normalizeProperty) || [])
  ];

  // Find the property by id or slug
  const property = allProperties.find(
    p => p.id === id || p.slug === id || p.slug === id?.replace(/-\d+$/, '')
  );

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/listings')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  // Get main image URL with fallback to a placeholder if no images are available
  const mainImage = property.images?.[0]?.url || '/placeholder-property.jpg';

  // Get gallery images (excluding the first one if it's the main image)
  const galleryImages = property.images && property.images.length > 1 
    ? property.images.slice(1).map(img => ({
        url: typeof img === 'string' ? img : img.url || '',
        alt: typeof img === 'string' ? property.title : img.alt || property.title
      }))
    : [];

  // Get property features with fallbacks
  const features = {
    bedrooms: property.features?.bedrooms,
    bathrooms: property.features?.bathrooms,
    area: property.features?.area ?? 0,
    parking: property.features?.parking
  };

  // Get location as string
  const locationString = getLocationString(property.location);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="bg-gray-50 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                {/* Property Image */}
                <div className="h-64 bg-gray-200 relative">
                  <img
                    src={mainImage}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="default" className="bg-white text-gray-800 font-medium">
                      {property.status === 'available' ? 'Available' : property.status}
                    </Badge>
                  </div>
                </div>
                
                {/* Property Header */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{locationString}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(property.price)}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 bg-gray-50 border-t">
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                    <Ruler className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-500">Area</span>
                    <span className="font-semibold">{formatArea(features.area, property.type)}</span>
                  </div>
                  {features.bedrooms !== undefined && (
                    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                      <Bed className="h-6 w-6 text-blue-600 mb-2" />
                      <span className="text-sm text-gray-500">Bedrooms</span>
                      <span className="font-semibold">{features.bedrooms}</span>
                    </div>
                  )}
                  {features.bathrooms !== undefined && (
                    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                      <Bath className="h-6 w-6 text-blue-600 mb-2" />
                      <span className="text-sm text-gray-500">Bathrooms</span>
                      <span className="font-semibold">{features.bathrooms}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {property.description && (
                  <div className="p-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                    <div className="prose max-w-none text-gray-600">
                      {property.description.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gallery */}
                {galleryImages.length > 0 && (
                  <div className="p-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {galleryImages.map((img, index) => {
                        const imageObj: PropertyImage = typeof img === 'string' 
                          ? { 
                              url: img, 
                              alt: `${property.title} - ${index + 2}`, 
                              isPrimary: false 
                            } 
                          : {
                              url: img.url || '',
                              alt: img.alt || `${property.title} - ${index + 2}`,
                              isPrimary: img.isPrimary || false
                            };
                        return (
                          <div key={index} className="aspect-square overflow-hidden rounded-lg">
                            <img
                              src={imageObj.url}
                              alt={imageObj.alt}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="p-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></div>
                          <span className="text-gray-600">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Buttons */}
                <div className="p-6 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Send Message
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Property Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-500">Property ID</span>
                    <span className="text-sm font-medium text-gray-900">{property.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-500">Price</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(property.price)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-500">Type</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {property.type}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm text-gray-500">Status</span>
                    <Badge 
                      variant={property.status === 'available' ? 'default' : 'destructive'}
                      className="text-xs capitalize"
                    >
                      {property.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Agent</h3>
                <div className="space-y-3">
                  <Button 
                    className="w-full h-12"
                    onClick={() => {
                      // Scroll to contact form if it exists, otherwise navigate to contact page
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate('/contact');
                      }
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-12"
                    onClick={() => {
                      // Default phone number - replace with your actual business number
                      window.location.href = 'tel:+260971203578';
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate(-1)}
                  className="w-full text-blue-600 hover:bg-blue-50 flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Listings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyDetail;
