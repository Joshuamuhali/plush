import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Heart, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Home as HomeIcon, 
  Building,
  Star,
  Eye,
  Bookmark,
  Share2,
  Filter,
  Search
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { sampleProperties } from '@/data/properties';

export default function Explore() {
  const { user } = useAuth();
  const [properties, setProperties] = useState(sampleProperties);
  const [loading, setLoading] = useState(false);
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('foryou');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'all',
  });

  useEffect(() => {
    fetchSavedProperties();
  }, [user]);

  useEffect(() => {
    filterProperties();
  }, [filters, searchQuery]);

  const fetchSavedProperties = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('saved_properties')
        .select('property_id')
        .eq('user_id', user.id);

      if (data) {
        setSavedProperties(new Set(data.map(item => item.property_id)));
      }
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    }
  };

  const filterProperties = () => {
    let filtered = sampleProperties;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(property => property.type === filters.type);
    }
    if (filters.location) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.minPrice) {
      filtered = filtered.filter(property => 
        typeof property.price === 'number' && property.price >= parseInt(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(property => 
        typeof property.price === 'number' && property.price <= parseInt(filters.maxPrice)
      );
    }
    if (filters.bedrooms && filters.bedrooms !== 'all') {
      filtered = filtered.filter(property => 
        property.bedrooms >= parseInt(filters.bedrooms)
      );
    }

    setProperties(filtered);
  };

  const toggleSaveProperty = async (propertyId: string) => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    try {
      if (savedProperties.has(propertyId)) {
        // Remove from saved
        await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);
        
        setSavedProperties(prev => {
          const newSet = new Set(prev);
          newSet.delete(propertyId);
          return newSet;
        });
      } else {
        // Add to saved
        await supabase
          .from('saved_properties')
          .insert({
            user_id: user.id,
            property_id: propertyId
          });
        
        setSavedProperties(prev => new Set(prev).add(propertyId));
      }
    } catch (error) {
      console.error('Error toggling saved property:', error);
    }
  };

  const formatPrice = (price: number | { amount: number; currency: string }) => {
    if (typeof price === 'number') {
      return `ZMW ${price.toLocaleString()}`;
    }
    return `${price.currency} ${price.amount.toLocaleString()}`;
  };

  const formatLocation = (location: string | { city: string; country: string }) => {
    if (typeof location === 'string') {
      return location;
    }
    return `${location.city}, ${location.country}`;
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: 'all',
    });
  };

  const filteredProperties = properties.filter(property => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        property.title.toLowerCase().includes(searchLower) ||
        property.location.toLowerCase().includes(searchLower) ||
        property.type.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const PropertyCard = ({ property }: { property: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image Gallery */}
      <div className="relative h-64 bg-gray-200">
        <img
          src={property.images[0] || '/placeholder.svg'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.verified && (
            <Badge className="bg-blue-600 text-white">
              <Star className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
          {property.featured && (
            <Badge className="bg-purple-600 text-white">
              Featured
            </Badge>
          )}
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleSaveProperty(property.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md"
        >
          <Heart 
            className={`w-5 h-5 ${savedProperties.has(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </motion.button>

        {/* Image Counter */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
            1/{property.images.length}
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {property.title}
          </h3>
          <div className="text-right">
            <p className="text-xl font-bold text-blue-600">
              {formatPrice(property.price)}
            </p>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex gap-3 text-sm text-gray-600 mb-3">
          <span className="flex items-center">
            <HomeIcon className="w-4 h-4 mr-1" />
            {property.bedrooms || 'Studio'} bed
          </span>
          <span className="flex items-center">
            <Building className="w-4 h-4 mr-1" />
            {property.bathrooms || '1'} bath
          </span>
          {property.area && (
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {property.area}m²
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/property/${property.id}`}>
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            <MessageCircle className="w-4 h-4 mr-2" />
            Inquire
          </Button>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Only show on desktop since mobile has separate navigation */}
      <header className="hidden md:block bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Explore Properties</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Filters */}
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
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
                  <SelectItem value="all">Any</SelectItem>
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
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-32 md:top-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
            <div className="flex space-x-8">
              {[
                { id: 'foryou', label: 'For You' },
                { id: 'new', label: 'New Listings' },
                { id: 'featured', label: 'Featured' },
                { id: 'nearby', label: 'Nearby' },
                { id: 'luxury', label: 'Luxury' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="text-sm text-gray-600 mt-2 sm:mt-0">
              {filteredProperties.length} properties found
              {loading && <span className="ml-2 text-blue-600">(Loading...)</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 md:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <HomeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new listings'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
