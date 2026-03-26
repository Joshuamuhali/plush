import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Heart, 
  Eye, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  Filter,
  Grid,
  List,
  Home,
  MessageCircle,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { demoProperties, buildBuyerPropertyFeed, locations, propertyTypes, priceRanges } from '@/data/demoProperties';
import { Property } from '@/types/property';
import EmptyState from '@/components/EmptyState';

export default function BuyerExplore() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [supabaseProperties, setSupabaseProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('foryou');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: '',
  });

  useEffect(() => {
    fetchProperties();
    fetchSavedProperties();
  }, [user]);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch Supabase properties
      let { data: supabaseData, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
      }

      // Transform Supabase data to match Property interface
      const transformedSupabase = supabaseData ? supabaseData.map(prop => ({
        id: prop.id,
        title: prop.title || '',
        description: prop.description || '',
        type: prop.property_type || 'house',
        location: prop.location || '',
        price: prop.price || 0,
        currency: 'ZMW',
        features: {
          area: prop.size,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
        },
        images: prop.images || [],
        status: prop.status || 'available',
        slug: prop.id,
        listedAt: prop.created_at || new Date().toISOString(),
      })) as Property[] : [];

      // Use the shared property feed builder
      const allProperties = buildBuyerPropertyFeed(transformedSupabase) as Property[];
      setProperties(allProperties);
      setSupabaseProperties(transformedSupabase);

    } catch (error) {
      console.error('Error fetching properties:', error);
      // Use demo properties as fallback
      const allProperties = buildBuyerPropertyFeed() as Property[];
      setProperties(allProperties);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedProperties = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select('property_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const saved = new Set(data?.map(item => item.property_id) || []);
      setSavedProperties(saved);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    }
  };

  const toggleSaveProperty = async (propertyId: string) => {
    if (!user) return;

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
      console.error('Error toggling save property:', error);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      location: '',
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: '',
    });
  };

  const filteredProperties = properties.filter(property => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const locationStr = typeof property.location === 'string' ? property.location : property.location.address;
      const matchesSearch = (
        property.title.toLowerCase().includes(searchLower) ||
        locationStr.toLowerCase().includes(searchLower) ||
        property.type.toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }
    return true;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const PropertyCard = ({ property }: { property: Property }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image Gallery */}
      <div className="relative h-64 bg-gray-200">
        <img
          src={
            Array.isArray(property.images) && property.images.length > 0
              ? (typeof property.images[0] === 'string' 
                  ? property.images[0] 
                  : property.images[0].url || '/placeholder.svg')
              : '/placeholder.svg'
          }
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.isFeatured && (
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
      </div>

      {/* Property Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {property.title}
          </h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(typeof property.price === 'number' ? property.price : property.price.amount)}
            </p>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {typeof property.location === 'string' ? property.location : property.location.address}
          </span>
        </div>

        <div className="flex gap-4 text-sm text-gray-600 mb-3">
          {property.bedrooms && <span>{property.bedrooms} bed</span>}
          {property.bathrooms && <span>{property.bathrooms} bath</span>}
          {(property.area || property.features.area) && <span>{property.area || property.features.area}m²</span>}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Link to={`/property/${property.slug}`}>
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => toggleSaveProperty(property.id)}
          >
            <Heart className={`w-4 h-4 mr-2 ${savedProperties.has(property.id) ? 'fill-current' : ''}`} />
            {savedProperties.has(property.id) ? 'Saved' : 'Save Property'}
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 text-xs"
            onClick={() => {/* TODO: Open inquiry modal */}}
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Quick Inquiry
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 text-xs"
            onClick={() => {/* TODO: Schedule viewing */}}
          >
            <Calendar className="w-3 h-3 mr-1" />
            Schedule
          </Button>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Properties</h1>
        <p className="text-gray-600">Discover your perfect property from our curated collection</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search location..."
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="pl-10 h-10 w-full sm:w-48"
              />
            </div>
            
            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.minPrice !== undefined && filters.maxPrice !== undefined ? `${filters.minPrice}-${filters.maxPrice}` : ''} onValueChange={(value) => {
              const range = priceRanges.find(r => r.label === value);
              setFilters({ 
                ...filters, 
                minPrice: range?.min,
                maxPrice: range?.max
              });
            }}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Prices</SelectItem>
                {priceRanges.map((range) => (
                  <SelectItem key={range.label} value={range.label}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => setFilters({ type: '', location: '', minPrice: '', maxPrice: '', bedrooms: '' })}
              className="w-full sm:w-auto"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex space-x-1 p-1">
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
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {filteredProperties.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
            <p className="text-gray-500 mb-6">
              {filters.location || filters.type || filters.minPrice !== undefined || filters.maxPrice !== undefined 
                ? "Your filters might be too specific. Try adjusting them or browse all available properties."
                : "We're adding new properties daily. Check back soon or browse our featured listings below."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(filters.location || filters.type || filters.minPrice || filters.maxPrice) && (
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ type: '', location: '', minPrice: undefined, maxPrice: undefined, bedrooms: '' })}
                >
                  Clear Filters
                </Button>
              )}
              <Button asChild>
                <Link to="/explore?featured=true">
                  Browse All Properties
                </Link>
              </Button>
            </div>
            
            {/* Show featured properties as fallback */}
            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Featured Properties</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demoProperties.slice(0, 3).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
