import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Home as HomeIcon,
  Bed,
  Bath,
  Square,
  MapPin,
  Eye,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProperties } from '@/hooks/useProperties';
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

interface Property {
  id: string;
  title: string;
  type: string;
  price: number | { amount: number; currency: string; isNegotiable?: boolean; period?: string };
  currency?: string;
  location: string | { address: string; city: string; district: string };
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  description: string;
  featured_image_url?: string;
  images: any[];
  is_featured?: boolean;
  is_negotiable?: boolean;
  status: string;
  views_count?: number;
  amenities?: string[];
  year_built?: number | null;
  parking_spaces?: number;
  slug: string;
  listedAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

interface PropertyCardProps {
  property: Property;
  onLike: (propertyId: string) => void;
  onSave: (propertyId: string) => void;
  isLiked: boolean;
  isSaved: boolean;
}

function PropertyCard({ property, onLike, onSave, isLiked, isSaved }: PropertyCardProps) {
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = () => {
    navigate(`/property/${property.slug}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(property.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(property.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.origin + `/property/${property.slug}`
      });
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image Section */}
      <div className="relative aspect-square">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        )}
        
        <img
          src={property.featured_image_url || '/api/placeholder/800/600'}
          alt={property.title}
          className="w-full h-full object-cover cursor-pointer"
          onClick={handleImageClick}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
        
        {/* Overlay Actions */}
        <div className="absolute top-2 right-2 flex gap-2">
          {property.is_featured && (
            <Badge className="bg-yellow-500 text-white px-2 py-1 text-xs font-semibold">
              Featured
            </Badge>
          )}
        </div>
        
        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className="text-white hover:bg-white/20 p-2 h-auto"
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-white hover:bg-white/20 p-2 h-auto"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-white hover:bg-white/20 p-2 h-auto"
              >
                <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-blue-500 text-blue-500' : ''}`} />
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span className="text-sm">{property.views_count || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            {typeof property.location === 'string' ? property.location : `${property.location?.city || property.location?.address || 'Location'}`}
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.area}m²</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {typeof property.price === 'number' 
                ? `${property.currency || 'ZMW'} ${property.price.toLocaleString()}`
                : `${property.price.currency} ${property.price.amount.toLocaleString()}`
              }
            </span>
            {(property.is_negotiable || (typeof property.price === 'object' && property.price.isNegotiable)) && (
              <span className="text-sm text-gray-500 ml-2">(Negotiable)</span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleImageClick}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PropertyFeed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allProperties, setAllProperties] = useState(sampleProperties);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedProperties, setLikedProperties] = useState<Set<string>>(new Set());
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set());

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch Supabase properties
  const { data: supabaseResponse, isLoading: supabaseIsLoading } = useProperties({
    limit: 20,
    offset: (page - 1) * 20,
    status: 'active'
  });

  useEffect(() => {
    if (supabaseResponse?.data && Array.isArray(supabaseResponse.data)) {
      const supabaseProperties = supabaseResponse.data.map(normalizeSupabaseProperty);
      const merged = mergeProperties(sampleProperties, supabaseProperties);
      setAllProperties(merged);
      setHasMore(supabaseResponse.data.length === 20);
    }
  }, [supabaseResponse, page]);

  const handleLike = useCallback((propertyId: string) => {
    setLikedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  }, []);

  const handleSave = useCallback((propertyId: string) => {
    setSavedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  }, []);

  const loadMore = useCallback(() => {
    if (!supabaseIsLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [supabaseIsLoading, hasMore]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Property Feed</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {allProperties.length} properties
            </div>
            {supabaseIsLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading more...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onLike={handleLike}
              onSave={handleSave}
              isLiked={likedProperties.has(property.id)}
              isSaved={savedProperties.has(property.id)}
            />
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-8">
            <Button
              onClick={loadMore}
              disabled={supabaseIsLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {supabaseIsLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Properties'
              )}
            </Button>
          </div>
        )}

        {/* End of Feed */}
        {!hasMore && allProperties.length > 0 && (
          <div className="text-center mt-8 text-gray-500">
            <p>You've reached the end of the feed</p>
            <p className="text-sm">Check back later for new properties</p>
          </div>
        )}
      </div>
    </div>
  );
}
