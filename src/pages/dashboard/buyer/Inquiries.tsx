import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, Mail, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Inquiry {
  id: string;
  property_id: string;
  property_title: string;
  property_price: number;
  property_city: string;
  property_location: string;
  property_images: { url: string }[];
  status: 'active' | 'responded' | 'closed';
  message: string;
  created_at: string;
  updated_at: string;
  seller_response?: string;
  seller_contact?: {
    name: string;
    phone: string;
    email: string;
  };
}

const BuyerInquiries = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadInquiries();
    }
  }, [user]);

  const loadInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          id,
          property_id,
          status,
          message,
          created_at,
          updated_at,
          properties (
            title,
            price,
            city,
            location,
            images,
            seller_id,
            profiles!properties_seller_id_fkey (
              full_name,
              phone,
              email
            )
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedInquiries: Inquiry[] = data?.map(item => ({
        id: item.id,
        property_id: item.property_id,
        property_title: item.properties?.title || 'Unknown Property',
        property_price: item.properties?.price || 0,
        property_city: item.properties?.city || '',
        property_location: item.properties?.location || '',
        property_images: item.properties?.images || [],
        status: item.status,
        message: item.message,
        created_at: item.created_at,
        updated_at: item.updated_at,
        seller_contact: item.properties?.profiles ? {
          name: item.properties.profiles.full_name,
          phone: item.properties.profiles.phone,
          email: item.properties.profiles.email
        } : undefined
      })) || [];

      setInquiries(formattedInquiries);
    } catch (error) {
      console.error('Error loading inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'responded':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-yellow-100 text-yellow-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">My Inquiries</h1>
          <p className="text-gray-600 mt-2">
            Track your property inquiries and responses from sellers
          </p>
        </div>
        <Button onClick={() => navigate('/marketplace')}>
          Browse More Properties
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {inquiries.filter(i => i.status === 'active').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Responded</p>
                <p className="text-2xl font-bold text-green-600">
                  {inquiries.filter(i => i.status === 'responded').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{inquiries.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inquiries List */}
      {inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Property Info */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                        {inquiry.property_images?.[0]?.url ? (
                          <img
                            src={inquiry.property_images[0].url}
                            alt={inquiry.property_title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                            <MessageSquare className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg line-clamp-1">
                          {inquiry.property_title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {inquiry.property_city}, {inquiry.property_location}
                        </p>
                        <p className="text-lg font-bold text-primary mt-1">
                          ZMW {inquiry.property_price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Inquiry Message */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{inquiry.message}</p>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-start lg:items-end space-y-3">
                    <Badge className={getStatusColor(inquiry.status)}>
                      <span className="flex items-center">
                        {getStatusIcon(inquiry.status)}
                        <span className="ml-1 capitalize">{inquiry.status}</span>
                      </span>
                    </Badge>

                    <div className="text-xs text-muted-foreground">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </div>

                    <div className="flex flex-col space-y-2 w-full lg:w-auto">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/property/${inquiry.property_id}`)}
                      >
                        View Property
                      </Button>

                      {inquiry.seller_contact && (
                        <div className="space-y-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => window.location.href = `tel:${inquiry.seller_contact.phone}`}
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => window.location.href = `mailto:${inquiry.seller_contact.email}`}
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No inquiries yet</h3>
            <p className="text-gray-500 mb-6">
              Start your property search and send inquiries to sellers to track your conversations here.
            </p>
            <Button onClick={() => navigate('/marketplace')}>
              Browse Properties
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Help Card */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Inquiry Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Be specific about your requirements in your inquiry message</li>
            <li>• Include your preferred viewing times and contact preferences</li>
            <li>• Sellers typically respond within 24-48 hours</li>
            <li>• Follow up politely if you haven't heard back within a few days</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerInquiries;
