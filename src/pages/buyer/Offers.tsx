import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Eye, 
  MapPin, 
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

interface Offer {
  id: string;
  property_id: string;
  property_title: string;
  offer_amount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  created_at: string;
  expires_at?: string;
  message?: string;
  property?: {
    id: string;
    title: string;
    price: number;
    location: string;
    property_type: string;
    images: string[];
    seller: {
      full_name: string;
    };
  };
}

export default function BuyerOffers() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'countered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOffers();
  }, [user, filter]);

  const fetchOffers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      let query = supabase
        .from('offers')
        .select(`
          *,
          property:properties(title, price, location, property_type, images),
          property:properties!inner(seller:profiles(full_name))
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      // Apply status filter
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers.filter(offer => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        offer.property_title.toLowerCase().includes(searchLower) ||
        offer.message?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'countered':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'accepted':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      case 'countered':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const OfferCard = ({ offer }: { offer: Offer }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {offer.property_title}
            </h3>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{offer.property?.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(offer.status)}>
              {React.createElement(getStatusIcon(offer.status), { className: "w-3 h-3 mr-1" })}
              {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
            </Badge>
            <span className="text-xs text-gray-500">
              {new Date(offer.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Property Info */}
        {offer.property && (
          <div className="flex gap-4 mb-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={offer.property.images[0] || '/placeholder.svg'}
                alt={offer.property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">
                {offer.property.title}
              </p>
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">
                  List Price: <span className="font-semibold">{formatPrice(offer.property.price)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Your Offer: <span className="font-semibold text-blue-600">{formatPrice(offer.offer_amount)}</span>
                </p>
              </div>
              {offer.offer_amount !== offer.property.price && (
                <div className="flex items-center mt-1">
                  {offer.offer_amount < offer.property.price ? (
                    <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                  ) : (
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  )}
                  <span className="text-xs text-gray-600">
                    {Math.abs(((offer.offer_amount - offer.property.price) / offer.property.price) * 100).toFixed(1)}% {offer.offer_amount < offer.property.price ? 'below' : 'above'} asking
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Offer Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Offer Amount</span>
            <span className="text-lg font-bold text-blue-600">{formatPrice(offer.offer_amount)}</span>
          </div>
          
          {offer.expires_at && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Expires</span>
              <span className="text-sm text-gray-700">
                {new Date(offer.expires_at).toLocaleDateString()}
              </span>
            </div>
          )}
          
          {offer.message && (
            <div className="mt-3">
              <p className="text-sm text-gray-700">{offer.message}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/property/${offer.property_id}`}>
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              View Property
            </Button>
          </Link>
          
          {offer.status === 'pending' && (
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Modify Offer
            </Button>
          )}
          
          {offer.status === 'countered' && (
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Respond
            </Button>
          )}
        </div>
      </CardContent>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Offers</h1>
        <p className="text-gray-600">Track and manage your property offers</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-full sm:w-64"
            />
          </div>
          
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'accepted', label: 'Accepted' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'countered', label: 'Countered' },
            ].map((statusFilter) => (
              <Button
                key={statusFilter.value}
                variant={filter === statusFilter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(statusFilter.value as any)}
              >
                {statusFilter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>

      {filteredOffers.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">You haven't made any offers</h3>
            <p className="text-gray-500 mb-6">
              Make an offer when you're ready to proceed with a property. This shows sellers you're serious and helps you stand out from other buyers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/explore">
                  Browse Properties
                </Link>
              </Button>
            </div>
            
            {/* Trust building section */}
            <div className="bg-blue-50 rounded-lg p-6 text-left mt-8">
              <h4 className="text-lg font-medium text-blue-700 mb-4">Why make an offer?</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Shows serious intent</p>
                    <p className="text-sm text-gray-600">Sellers prioritize buyers with written offers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Locks in the price</p>
                    <p className="text-sm text-gray-600">Prevents price increases while you review</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Starts the conversation</p>
                    <p className="text-sm text-gray-600">Opens negotiation channels with the seller</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
