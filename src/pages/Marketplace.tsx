import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Home as HomeIcon, Eye, Lock, MessageSquare } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { sampleProperties } from '@/data/properties';

// Helper function to normalize Supabase properties to match hardcoded structure
function normalizeSupabaseProperty(supabaseProperty: any) {
  return {
    id: supabaseProperty.id,
    title: supabaseProperty.title || 'Property',
    type: supabaseProperty.type || 'house',
    price: supabaseProperty.price || 0,
    currency: supabaseProperty.currency || 'ZMW',
    location: supabaseProperty.location || 'Location',
    city: supabaseProperty.city || 'City',
    bedrooms: supabaseProperty.bedrooms || 0,
    bathrooms: supabaseProperty.bathrooms || 0,
    area: supabaseProperty.area || 0,
    description: supabaseProperty.description || 'No description available',
    featured_image_url: supabaseProperty.featured_image_url || '/api/placeholder/800/600',
    images: supabaseProperty.images || ['/api/placeholder/800/600'],
    is_featured: supabaseProperty.is_featured || false,
    is_negotiable: supabaseProperty.is_negotiable || false,
    status: supabaseProperty.status || 'active',
    views_count: supabaseProperty.views_count || 0,
    amenities: supabaseProperty.amenities || [],
    year_built: supabaseProperty.year_built,
    parking_spaces: supabaseProperty.parking_spaces || 0,
    slug: supabaseProperty.slug || supabaseProperty.id,
    created_at: supabaseProperty.created_at || new Date().toISOString(),
    updated_at: supabaseProperty.updated_at || new Date().toISOString()
  };
}

// Helper function to merge properties without duplicates
function mergeProperties(hardcoded: any[], supabase: any[]) {
  const merged = [...hardcoded];
  const existingIds = new Set(hardcoded.map(p => p.id));
  
  supabase.forEach(supabaseProperty => {
    if (!existingIds.has(supabaseProperty.id)) {
      merged.push(normalizeSupabaseProperty(supabaseProperty));
    }
  });
  
  return merged;
}

export default function Marketplace() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });

  // State for merged properties
  const [allProperties, setAllProperties] = useState(sampleProperties);
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseLoading, setSupabaseLoading] = useState(false);

  // Fetch Supabase properties
  const { data: supabaseResponse, isLoading: supabaseIsLoading } = useProperties({
    type: filters.type || undefined,
    city: filters.location || undefined,
    min_price: filters.minPrice ? parseInt(filters.minPrice) : undefined,
    max_price: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
    bedrooms: filters.bedrooms ? parseInt(filters.bedrooms) : undefined,
  });

  useEffect(() => {
    setIsLoading(supabaseIsLoading);
    setSupabaseLoading(supabaseIsLoading);
    
    if (supabaseResponse?.data && Array.isArray(supabaseResponse.data)) {
      const supabaseProperties = supabaseResponse.data.map(normalizeSupabaseProperty);
      const merged = mergeProperties(sampleProperties, supabaseProperties);
      setAllProperties(merged);
    } else {
      // If Supabase fails, keep only hardcoded properties
      setAllProperties(sampleProperties);
    }
  }, [supabaseResponse, supabaseIsLoading]);

  // Redirect unauthenticated users to login
  if (!user && !profileLoading) {
    navigate('/login');
    return null;
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const userRole = profile?.role || 'buyer';

  // Redirect non-buyer/seller users
  if (!['buyer', 'seller'].includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-4">
              Only buyers and sellers can browse properties
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
    });
  };

  const filteredProperties = allProperties.filter(property =>
    searchTerm === '' ||
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (property.location && typeof property.location === 'string' && property.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    property.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Browse Properties</h1>
          <p className="text-xl text-blue-100 mb-8">
            Find your perfect property from our curated collection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <HomeIcon className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Button>
            {userRole === 'seller' && (
              <Button
                size="lg"
                onClick={() => navigate('/list-property')}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <HomeIcon className="mr-2 h-5 w-5" />
                List Property
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="plot">Plot</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange('bedrooms', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-32"
              />
              <Input
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-32"
              />
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {allProperties?.length || 0} properties found
            {supabaseLoading && <span className="ml-2 text-blue-600">(Loading more...)</span>}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
            <p className="text-gray-600 text-sm">Premium listings from our database</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-80 rounded-lg"></div>
              ))
            ) : allProperties && Array.isArray(allProperties) && allProperties.length > 0 ? (
              allProperties
                .filter(property => (property as any).isFeatured || ((property as any).views_count && (property as any).views_count > 500))
                .slice(0, 3)
                .map((property) => (
                  <Card
                    key={`featured-${property.id}`}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border-2 border-blue-200"
                    onClick={() => navigate(`/property/${property.slug}`)}
                  >
                    <div className="aspect-video bg-gray-200 relative">
                      {(property as any).featured_image_url ? (
                        <img
                          src={(property as any).featured_image_url}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <HomeIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                        ⭐ Premium
                      </div>
                      <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        {property.type}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 line-clamp-1">{property.title}</h3>
                      <p className="text-gray-600 mb-2">
                        {typeof (property as any).location === 'string' ? (property as any).location : `${(property as any).location?.city}, ${(property as any).location?.address}`}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary">
                          {property.currency} {property.price.toLocaleString()}
                          {(property as any).is_negotiable && <span className="text-sm text-gray-500 ml-1">(Negotiable)</span>}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-500 mb-4">
                        {property.bedrooms && <span>{property.bedrooms} beds</span>}
                        {property.bathrooms && <span>{property.bathrooms} baths</span>}
                        {property.area && <span>{property.area} sqm</span>}
                      </div>
                      
                      {/* Role-specific actions */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/property/${property.slug}`)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        
                        {userRole === 'buyer' && (
                          <Button size="sm" variant="outline">
                            <HomeIcon className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        )}
                        
                        {userRole === 'seller' && (
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Inquire
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No featured properties available</h3>
                <p className="text-gray-500">Featured properties will appear here when available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* All Properties */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Properties</h2>
            <p className="text-gray-600">Browse our complete collection</p>
          </div>
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-80 rounded-lg"></div>
              ))}
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <Card
                  key={property.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/property/${property.slug}`)}
                >
                  <div className="aspect-video bg-gray-200 relative">
                    {(property as any).featured_image_url || (property as any).images?.[0]?.url ? (
                      <img
                        src={(property as any).featured_image_url || (property as any).images?.[0]?.url}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <HomeIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {property.type}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1">{property.title}</h3>
                    <p className="text-gray-600 mb-2">
                      {typeof (property as any).location === 'string' ? (property as any).location : `${(property as any).location?.city}, ${(property as any).location?.address}`}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {property.currency} {property.price.toLocaleString()}
                        {(property as any).is_negotiable && <span className="text-sm text-gray-500 ml-1">(Negotiable)</span>}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-500 mb-4">
                      {property.bedrooms && <span>{property.bedrooms} beds</span>}
                      {property.bathrooms && <span>{property.bathrooms} baths</span>}
                      {property.area && <span>{property.area} sqm</span>}
                    </div>
                    
                    {/* Role-specific actions */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/property/${property.slug}`)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      
                      {userRole === 'buyer' && (
                        <Button size="sm" variant="outline">
                          <HomeIcon className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      )}
                      
                      {userRole === 'seller' && (
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Inquire
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
