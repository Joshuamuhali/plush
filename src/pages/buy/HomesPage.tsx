import { useSearchParams } from "react-router-dom";
import { useProperties } from "@/hooks/useProperties";
import PropertyCard from "@/components/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function HomesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = searchParams.get('location') || '';
  const { data: properties, isLoading } = useProperties();
  
  const homes = properties?.filter(property => {
    const locationStr = typeof property.location === 'string' 
      ? property.location 
      : property.location?.address || '';
    
    return (
      ['house', 'apartment', 'townhouse'].includes(property.type) &&
      (location ? locationStr.toLowerCase().includes(location.toLowerCase()) : true)
    );
  }) || [];

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Homes for Sale</h1>
          <p className="text-muted-foreground mt-2">Find your dream home in Zambia</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by location..."
            className="pl-10"
            value={location}
            onChange={(e) => setSearchParams({ location: e.target.value })}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-lg" />
          ))}
        </div>
      ) : homes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homes.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="mt-2 text-lg font-medium">No homes available</h3>
          <p className="mt-1 text-muted-foreground">
            No homes are currently listed. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
}
