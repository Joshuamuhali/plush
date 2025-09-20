import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Home, Building2, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

import { Property, PropertyPrice, PropertyLocation, PropertyType } from "@/types/property";

type PropertyCardProps = Omit<Property, 'features'> & {
  // Additional props specific to the card component
  className?: string;
  key?: string;
  // Make some required props from Property optional for backward compatibility
  status?: Property['status'];
  slug: string;
  // For backward compatibility with direct props
  image?: string;
  currency?: string;
  // Include features as an optional property
  features?: Property['features'];
};

const PropertyCard = ({
  id,
  title,
  type,
  price,
  currency = 'ZMW',
  location,
  images = [],
  image,
  bedrooms,
  bathrooms,
  area,
  features = {},
  status = 'available',
  slug,
  className = ''
}: PropertyCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(slug ? `/property/${slug}` : `/property/${id}`);
  };

  const formatPrice = (price: number | PropertyPrice, currency: string) => {
    try {
      if (typeof price === 'number') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(price);
      } else if (typeof price === 'object' && price !== null) {
        const formattedAmount = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: price.currency || currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(price.amount);
        
        const period = price.period && price.period !== 'total' ? `/${price.period}` : '';
        
        return `${formattedAmount}${period}`;
      }
      return 'Price on request';
    } catch (error) {
      console.error('Error formatting price:', error);
      return 'Price on request';
    }
  };

  // Format location to string if it's a PropertyLocation object
  const formatLocation = (location: string | PropertyLocation): string => {
    if (typeof location === 'string') return location;
    return [location.address, location.city, location.district]
      .filter(Boolean)
      .join(', ');
  };

  // Get property type icon
  const getPropertyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'house':
        return <Home className="w-4 h-4 mr-1.5" />;
      case 'apartment':
        return <Building2 className="w-4 h-4 mr-1.5" />;
      case 'plot':
      case 'land':
        return <Layers className="w-4 h-4 mr-1.5" />;
      default:
        return <Home className="w-4 h-4 mr-1.5" />;
    }
  };

  // Get primary image or first image
  const getPrimaryImage = () => {
    // If there's a direct image prop, use it first
    if (image) return image;
    
    // If no images array, use placeholder
    if (!images || images.length === 0) {
      return '/placeholder-property.jpg';
    }
    
    // Handle string array format
    if (typeof images[0] === 'string') {
      return (images as string[])[0];
    }
    
    // Handle PropertyImage array format
    const imageArray = images as Array<{url: string, isPrimary?: boolean}>;
    const primary = imageArray.find(img => img.isPrimary);
    return primary ? primary.url : imageArray[0].url;
  };
  
  const primaryImage = getPrimaryImage();
  
  // Get area from features or direct prop
  const propertyArea = area || features?.area || 0;
  
  // Get bedrooms and bathrooms from features or direct props
  const propertyBedrooms = bedrooms ?? features?.bedrooms;
  const propertyBathrooms = bathrooms ?? features?.bathrooms;

  return (
    <Card className={`overflow-hidden border border-border/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col ${className}`}>
      {/* Property Image */}
      <div className="relative aspect-[4/3] overflow-hidden group">
        <img
          src={primaryImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-property.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <Badge 
            variant={status === 'available' ? 'default' : 'destructive'}
            className="px-3 py-1 text-xs font-medium capitalize"
          >
            {status}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            {getPropertyTypeIcon(type)}
            <span className="capitalize">{type}</span>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 h-14">{title}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">{formatLocation(location)}</span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xl font-bold text-primary">
              {formatPrice(price, currency)}
              {!['plot', 'land'].includes(type.toLowerCase()) && (
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              )}
            </p>
            
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              {propertyBedrooms !== undefined && (
                <div className="flex items-center" title={`${propertyBedrooms} ${propertyBedrooms === 1 ? 'Bedroom' : 'Bedrooms'}`}>
                  <Bed className="w-4 h-4 mr-1" />
                  <span className="sr-only">Bedrooms: </span>
                  <span>{propertyBedrooms}</span>
                </div>
              )}
              {propertyBathrooms !== undefined && (
                <div className="flex items-center" title={`${propertyBathrooms} ${propertyBathrooms === 1 ? 'Bathroom' : 'Bathrooms'}`}>
                  <Bath className="w-4 h-4 mr-1" />
                  <span className="sr-only">Bathrooms: </span>
                  <span>{propertyBathrooms}</span>
                </div>
              )}
              <div className="flex items-center" title="Area">
                <Square className="w-4 h-4 mr-1" />
                <span className="sr-only">Area: </span>
                <span>{propertyArea} m²</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleViewDetails}
            variant="default"
            className="w-full bg-primary hover:bg-primary/90 transition-colors"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;