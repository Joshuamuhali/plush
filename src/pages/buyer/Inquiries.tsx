import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageCircle, 
  Eye, 
  MapPin, 
  Clock,
  Search,
  Filter,
  Send,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Archive
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { demoProperties } from '@/data/demoProperties';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/EmptyState';
import GuidedPlaceholderCard from '@/components/GuidedPlaceholderCard';

interface Inquiry {
  id: string;
  property_id: string;
  property_title: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  created_at: string;
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

export default function BuyerInquiries() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'responded' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, [user]);

  const fetchInquiries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      let query = supabase
        .from('inquiries')
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
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        inquiry.message.toLowerCase().includes(searchLower) ||
        inquiry.property_title.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'responded':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'responded':
        return MessageCircle;
      case 'closed':
        return Archive;
      default:
        return Clock;
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    const IconComponent = getStatusIcon(status);
    return <IconComponent className="w-3 h-3 mr-1" />;
  };

  const InquiryCard = ({ inquiry }: { inquiry: Inquiry }) => (
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
              {inquiry.property_title}
            </h3>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{inquiry.property?.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(inquiry.status)}>
              <StatusIcon status={inquiry.status} />
              {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
            </Badge>
            <span className="text-xs text-gray-500">
              {new Date(inquiry.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Property Info */}
        {inquiry.property && (
          <div className="flex gap-4 mb-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={inquiry.property.images[0] || '/placeholder.svg'}
                alt={inquiry.property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">
                {inquiry.property.title}
              </p>
              <p className="text-lg font-bold text-blue-600">
                ZMW {inquiry.property.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">
                {inquiry.property.property_type} • {inquiry.property.location}
              </p>
            </div>
          </div>
        )}

        {/* Message */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 mb-3">{inquiry.message}</p>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              From: {inquiry.property?.seller?.full_name || 'Unknown'}
            </span>
            
            {inquiry.status === 'pending' && (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Follow Up
              </Button>
            )}
          </div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Inquiries</h1>
        <p className="text-gray-600">Track your property inquiries and responses</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-full sm:w-64"
            />
          </div>
          
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'responded', label: 'Responded' },
              { value: 'closed', label: 'Closed' },
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

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.map((inquiry) => (
          <InquiryCard key={inquiry.id} inquiry={inquiry} />
        ))}
      </div>

      {filteredInquiries.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">You haven't made any inquiries</h3>
            <p className="text-gray-500 mb-6">
              Send inquiries to get more information about properties you're interested in. Sellers typically respond within 24 hours.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild>
                <Link to="/explore">
                  Explore Properties
                </Link>
              </Button>
            </div>
            
            {/* How it works */}
            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <h4 className="text-lg font-medium text-gray-700 mb-4">How inquiries work</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">1</div>
                  <p className="text-sm text-gray-600">Find a property you're interested in</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">2</div>
                  <p className="text-sm text-gray-600">Click "Inquire" and ask your questions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">3</div>
                  <p className="text-sm text-gray-600">Get a response from the seller within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
