import { useProperties } from "@/hooks/useProperties";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyListings() {
  // In a real app, this would fetch only the current user's properties
  const { data: properties } = useProperties();
  
  // Mock user's listings (in a real app, this would be filtered by the current user)
  const myListings = properties?.slice(0, 4) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Button asChild>
          <Link to="/sell/list-property" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Property
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search your listings..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button variant="outline">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {myListings.length > 0 ? (
          myListings.map((property) => (
            <div key={property.id} className="border rounded-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/4 h-48 bg-gray-100">
                  {property.image && (
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{property.title}</h3>
                      <p className="text-muted-foreground">{property.location}</p>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-2xl font-bold text-primary">
                          ZMW {property.price?.toLocaleString()}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link to={`/property/${property.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    {property.bedrooms && (
                      <span>{property.bedrooms} beds</span>
                    )}
                    {property.bathrooms && (
                      <span>{property.bathrooms} baths</span>
                    )}
                    {property.area && (
                      <span>{property.area} m²</span>
                    )}
                    <span>Listed 2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-medium">No properties listed yet</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              You haven't listed any properties yet. Get started by adding your first property.
            </p>
            <Button asChild>
              <Link to="/sell/list-property" className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Add Property
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple Search icon component
function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
