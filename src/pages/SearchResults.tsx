import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, MapPin, BedDouble, Bath, Ruler } from 'lucide-react';
import { Property } from '@/types/property';
import { getAllProperties, searchProperties } from '@/services/propertySearchService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';

// Helper function to safely access nested properties
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || '';
};

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // Initialize search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    setHasSearched(!!query);
  }, [location.search]);

  // Load all properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const properties = await getAllProperties();
        setAllProperties(properties);
        
        // If there's a search query, perform the search
        if (searchQuery) {
          const results = searchProperties(searchQuery, properties);
          setSearchResults(results);
        }
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [searchQuery]);

  // Group results by property type for display
  const groupedResults = searchResults.reduce((acc, property) => {
    const type = property.type || 'other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(property);
    return acc;
  }, {} as Record<string, Property[]>);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setHasSearched(true);
    }
  };

  const renderPropertyCard = (property: Property) => (
    <div key={property.id} className="group">
      <Link to={`/property/${property.id}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
          <div className="relative h-48 bg-gray-100">
            <img
              src={property.images[0]?.url || '/placeholder.svg'}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded">
              {property.status}
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{property.title}</CardTitle>
                <div className="flex items-center text-muted-foreground text-sm mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location.address}, {property.location.city}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {property.price.currency} {property.price.amount.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {property.price.period === 'month' ? 'per month' : 
                   property.price.period === 'year' ? 'per year' : 'total'}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4 pt-4 border-t">
              <div className="flex items-center text-sm text-muted-foreground">
                <BedDouble className="h-5 w-5 text-muted-foreground mr-1" />
                <span>{property.features.bedrooms || 0} Beds</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Bath className="h-5 w-5 text-muted-foreground mr-1" />
                <span>{property.features.bathrooms || 0} Baths</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Ruler className="h-5 w-5 text-muted-foreground mr-1" />
                <span>{property.features.area || 0} m²</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background">
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-12 border-b">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse All Properties'}
            </h1>
            
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="w-full pl-10"
                    placeholder="Search by title, location, type, or features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search properties"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="w-full md:w-auto">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      navigate('/search');
                    }}
                    disabled={!searchQuery}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          ) : !hasSearched ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium">Search for properties</h3>
              <p className="text-muted-foreground mt-2">
                Use the search bar to find properties that match your criteria.
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium">No properties found</h3>
              <p className="text-muted-foreground mt-2">
                We couldn't find any properties matching your search criteria.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  navigate('/search');
                }}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="text-sm text-muted-foreground mb-4">
                Found {searchResults.length} propert{searchResults.length === 1 ? 'y' : 'ies'} matching "{searchQuery}"
              </div>
              {Object.entries(groupedResults).map(([type, properties]) => (
                <div key={type} className="space-y-6">
                  <h3 className="text-xl font-semibold border-b pb-2">
                    {type.charAt(0).toUpperCase() + type.slice(1)}s <span className="text-muted-foreground">({properties.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map(renderPropertyCard)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
