import { useProperties } from "@/hooks/useProperties";
import PropertyCard from "@/components/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Building2, Layers } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import { clearHighlights } from "@/utils/searchUtils";

export default function PropertiesPage() {
  const { data: properties, isLoading } = useProperties();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Handle initial search from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }

    // Cleanup highlights when component unmounts
    return () => {
      clearHighlights();
    };
  }, [location.search]);

  // Handle no search results
  const handleNoResults = () => {
    navigate(`/no-results?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src="/src/assets/hero-properties.jpg" 
          alt="Luxury Properties" 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Find Your Perfect Property
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl">
            Discover a wide range of properties that match your lifestyle and budget.
          </p>
          
          <div className="w-full max-w-3xl">
            <SearchBar 
              onNoResults={handleNoResults}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/buy/homes" className="flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors">
              <Home className="h-5 w-5 mr-2" />
              Houses
            </Link>
            <Link to="/buy/land" className="flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors">
              <Layers className="h-5 w-5 mr-2" />
              Land & Plots
            </Link>
            <Link to="/buy/commercial" className="flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors">
              <Building2 className="h-5 w-5 mr-2" />
              Commercial
            </Link>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties?.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
