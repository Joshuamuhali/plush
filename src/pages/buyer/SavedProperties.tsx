import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Eye, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  Search,
  Grid,
  List,
  Trash2,
  Home,
  Star,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { demoProperties, buildBuyerPropertyFeed, locations, propertyTypes, priceRanges } from '@/data/demoProperties';
import { Property } from '@/types/property';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/EmptyState';
import GuidedPlaceholderCard from '@/components/GuidedPlaceholderCard';

export default function BuyerSavedProperties() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSavedProperties();
  }, [user]);

  const fetchSavedProperties = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('saved_properties')
        .select(`
          property_id,
          created_at
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch full property details for saved properties
      const propertyIds = data?.map(item => item.property_id) || [];
      if (propertyIds.length === 0) {
        setProperties([]);
        return;
      }

      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select(`
          *,
          seller:profiles(full_name)
        `)
        .in('id', propertyIds)
        .eq('status', 'active');

      if (propertyError) throw propertyError;
      setProperties(propertyData || []);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedProperty = async (propertyId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);
      
      setProperties(prev => prev.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error('Error removing saved property:', error);
    }
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

  const formatPrice = (price: number | { amount: number }) => {
    const priceValue = typeof price === 'number' ? price : price.amount;
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceValue);
  };

  const PropertyCard = ({ property }: { property: Property }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image Gallery */}
      <div className="relative h-48 bg-gray-200">
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
        
        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => removeSavedProperty(property.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md"
        >
          <Heart 
            className={`w-5 h-5 text-gray-600`} 
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
              {formatPrice(property.price)}
            </p>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {typeof property.location === 'string' ? property.location : property.location.address}
          </span>
        </div>

        <div className="flex gap-4 text-sm text-gray-600 mb-4">
          {property.bedrooms && <span>{property.bedrooms} bed</span>}
          {property.bathrooms && <span>{property.bathrooms} bath</span>}
          {property.area && <span>{property.area}m²</span>}
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Properties</h1>
        <p className="text-gray-600">Properties you've saved for later</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search saved properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 w-full"
          />
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
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">You haven't saved any properties yet</h3>
            <p className="text-gray-500 mb-6">
              Save properties you're interested in to easily find them later and track price changes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild>
                <Link to="/explore">
                  Explore Properties
                </Link>
              </Button>
            </div>
            
            {/* Recommended properties */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Recommended for you</h4>
              <p className="text-sm text-gray-500 mb-4">Based on popular searches in your area</p>
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
