import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Home, Building2, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  id: string;
  title: string;
  type: string;
  price: number;
  currency?: string;
  location: string;
  image: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  status: string;
  slug: string;
}

const PropertyCard = ({
  id,
  title,
  type,
  price,
  currency = 'ZMW',
  location,
  image,
  bedrooms,
  bathrooms,
  area,
  status = 'available',
  slug
}: PropertyCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(slug ? `/property/${slug}` : `/property/${id}`);
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

  return (
    <Card className="overflow-hidden border border-border/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      {/* Property Image */}
      <div className="relative aspect-[4/3] overflow-hidden group">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xl font-bold text-primary">
              {currency} {price.toLocaleString()}
              {!['plot', 'land'].includes(type.toLowerCase()) && (
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              )}
            </p>
            
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              {bedrooms !== undefined && (
                <div className="flex items-center" title={`${bedrooms} ${bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}`}>
                  <Bed className="w-4 h-4 mr-1" />
                  <span className="sr-only">Bedrooms: </span>
                  <span>{bedrooms}</span>
                </div>
              )}
              {bathrooms !== undefined && (
                <div className="flex items-center" title={`${bathrooms} ${bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}`}>
                  <Bath className="w-4 h-4 mr-1" />
                  <span className="sr-only">Bathrooms: </span>
                  <span>{bathrooms}</span>
                </div>
              )}
              <div className="flex items-center" title="Area">
                <Square className="w-3.5 h-3.5 mr-1" />
                <span className="sr-only">Area: </span>
                <span>{type.toLowerCase() === 'plot' || type.toLowerCase() === 'land' 
                  ? `${area} acres` 
                  : `${area} m²`}
                </span>
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