import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Search, MessageSquare, TrendingUp, Home, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SavedProperty {
  id: string;
  title: string;
  price: number;
  city: string;
  location: string;
  images: { url: string }[];
  created_at: string;
}

interface Inquiry {
  id: string;
  property_title: string;
  status: string;
  created_at: string;
  property_id: string;
}

const BuyerOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    savedProperties: 0,
    activeInquiries: 0,
    totalViews: 0,
    messages: 0
  });
  const [recentSaved, setRecentSaved] = useState<SavedProperty[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load saved properties
      const { data: savedData, error: savedError } = await supabase
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
            images
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (savedError) throw savedError;

      // Load inquiries
      const { data: inquiryData, error: inquiryError } = await supabase
        .from('inquiries')
        .select(`
          id,
          status,
          created_at,
          property_id,
          properties (
            title
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (inquiryError) throw inquiryError;

      // Set stats
      setStats({
        savedProperties: savedData?.length || 0,
        activeInquiries: inquiryData?.filter(i => i.status === 'active').length || 0,
        totalViews: 0, // Would need to implement property view tracking
        messages: 0 // Would need to implement message system
      });

      // Set recent data
      setRecentSaved(savedData?.map(item => ({
        ...item.properties,
        saved_at: item.created_at
      })) || []);

      setRecentInquiries(inquiryData?.map(item => ({
        id: item.id,
        property_title: item.properties?.title || 'Unknown Property',
        status: item.status,
        created_at: item.created_at,
        property_id: item.property_id
      })) || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your property search.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savedProperties}</div>
            <p className="text-xs text-muted-foreground">Properties you've saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Inquiries</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeInquiries}</div>
            <p className="text-xs text-muted-foreground">Pending responses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties Viewed</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messages}</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Saved Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Saved</CardTitle>
            <CardDescription>Your latest saved properties</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSaved.length > 0 ? (
              recentSaved.map((property) => (
                <div key={property.id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    {property.images?.[0]?.url ? (
                      <img
                        src={property.images[0].url}
                        alt={property.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Home className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{property.title}</p>
                    <p className="text-xs text-muted-foreground">
                      ZMW {property.price.toLocaleString()} • {property.city}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/property/${property.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No saved properties yet.</p>
            )}

            {recentSaved.length > 0 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/dashboard/buyer/saved')}
              >
                View All Saved Properties
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>Your latest property inquiries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{inquiry.property_title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={inquiry.status === 'active' ? 'default' : 'secondary'}>
                    {inquiry.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No inquiries yet.</p>
            )}

            {recentInquiries.length > 0 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/dashboard/buyer/inquiries')}
              >
                View All Inquiries
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump back into your property search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              className="h-20 flex-col"
              onClick={() => navigate('/marketplace')}
            >
              <Search className="h-6 w-6 mb-2" />
              Browse Properties
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate('/dashboard/buyer/saved')}
            >
              <Heart className="h-6 w-6 mb-2" />
              Saved Properties
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate('/dashboard/messages')}
            >
              <MessageSquare className="h-6 w-6 mb-2" />
              Messages
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerOverview;
