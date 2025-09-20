import { useQuery } from "@tanstack/react-query";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/types/property";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";

export const BuyLand = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = searchParams.get('location') || '';
  const { data: properties, isLoading } = useProperties();

  const filteredProperties = properties?.filter(property => {
    const locationStr = typeof property.location === 'string' 
      ? property.location 
      : property.location?.address || '';
    
    return (
      property.type === 'land' && 
      (location ? locationStr.toLowerCase().includes(location.toLowerCase()) : true)
    );
  }) || [];

  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Plot of Land</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse our selection of premium land plots available for purchase. Find the perfect location for your dream home or investment.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by location..."
              className="pl-10"
              value={location}
              onChange={(e) => setSearchParams({ location: e.target.value })}
            />
          </div>
          <Button className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-lg" />
          ))}
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            const { id, title, type, price, location: locationStr, image, bedrooms, bathrooms, area, status, slug } = property;
            const location = typeof locationStr === 'string' ? locationStr : locationStr.address;
            return (
              <PropertyCard 
                key={id}
                id={id}
                title={title}
                description={property.description || ''}
                type={type}
                price={typeof price === 'number' ? price : price.amount}
                currency={typeof price === 'object' ? price.currency : property.currency || 'ZMW'}
                location={location}
                image={Array.isArray(property.images) 
                  ? (typeof property.images[0] === 'string' ? property.images[0] : property.images[0]?.url || '') 
                  : (property.image || '')}
                images={Array.isArray(property.images) ? property.images : []}
                bedrooms={bedrooms}
                bathrooms={bathrooms}
                area={area}
                status={status}
                slug={slug}
                features={property.features || {}}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="mt-2 text-lg font-medium">No properties found</h3>
          <p className="mt-1 text-muted-foreground">
            {location 
              ? `No land properties found in ${location}. Try adjusting your search.`
              : 'No land properties available at the moment. Please check back later.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BuyLand;
