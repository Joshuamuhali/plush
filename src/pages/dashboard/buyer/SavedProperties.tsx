import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Bed, Bath, Square, X, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SavedProperty {
  id: string;
  title: string;
  price: number;
  city: string;
  location: string;
  images: { url: string }[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  property_type: string;
  saved_at: string;
}

const SavedProperties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSavedProperties();
    }
  }, [user]);

  const loadSavedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select(`
          id,
          created_at,
          properties (
            id,
            title,
            price,
            city,
            location,
            images,
            bedrooms,
            bathrooms,
            area,
            property_type
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProperties: SavedProperty[] = data?.map(item => ({
        id: item.properties.id,
        title: item.properties.title,
        price: item.properties.price,
        city: item.properties.city,
        location: item.properties.location,
        images: item.properties.images || [],
        bedrooms: item.properties.bedrooms,
        bathrooms: item.properties.bathrooms,
        area: item.properties.area,
        property_type: item.properties.property_type,
        saved_at: item.created_at
      })) || [];

      setProperties(formattedProperties);
    } catch (error) {
      console.error('Error loading saved properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedProperty = async (propertyId: string) => {
    setRemoving(propertyId);
    try {
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', user!.id)
        .eq('property_id', propertyId);

      if (error) throw error;

      setProperties(prev => prev.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error('Error removing saved property:', error);
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Properties</h1>
          <p className="text-gray-600 mt-2">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>
        <Button onClick={() => navigate('/marketplace')}>
          Browse More Properties
        </Button>
      </div>

      {/* Properties Grid */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-video bg-gray-200 relative">
                  {property.images?.[0]?.url ? (
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Home className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Remove button */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-4 right-4 h-8 w-8 p-0"
                  onClick={() => removeSavedProperty(property.id)}
                  disabled={removing === property.id}
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Property type badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {property.property_type}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Title and location */}
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.city}, {property.location}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-2xl font-bold text-primary">
                    ZMW {property.price.toLocaleString()}
                  </div>

                  {/* Property details */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      {property.bedrooms && (
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {property.bedrooms}
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {property.bathrooms}
                        </div>
                      )}
                      {property.area && (
                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          {property.area} sqm
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Saved date */}
                  <div className="text-xs text-muted-foreground">
                    Saved {new Date(property.saved_at).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      className="flex-1"
                      onClick={() => navigate(`/property/${property.id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/contact')}
                    >
                      Contact Agent
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No saved properties yet</h3>
            <p className="text-gray-500 mb-6">
              Start browsing properties and save your favorites for easy access later.
            </p>
            <Button onClick={() => navigate('/marketplace')}>
              Browse Properties
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      {properties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>💡 Pro Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Set up property alerts to get notified when similar properties are listed</li>
              <li>• Compare saved properties side-by-side to make informed decisions</li>
              <li>• Contact agents directly for private viewings and negotiations</li>
              <li>• Keep track of market trends for your saved property types</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SavedProperties;
