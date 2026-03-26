import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileCheck, 
  Eye, 
  MapPin, 
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

interface Application {
  id: string;
  property_id: string;
  property_title: string;
  application_type: 'rental' | 'purchase' | 'mortgage';
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'withdrawn';
  created_at: string;
  updated_at: string;
  documents?: string[];
  notes?: string;
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

export default function BuyerApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'under_review' | 'approved' | 'rejected' | 'withdrawn'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [user, filter]);

  const fetchApplications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      let query = supabase
        .from('applications')
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
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(application => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        application.property_title.toLowerCase().includes(searchLower) ||
        application.notes?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'under_review':
        return Eye;
      case 'approved':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      case 'withdrawn':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getApplicationTypeColor = (type: string) => {
    switch (type) {
      case 'rental':
        return 'bg-purple-100 text-purple-800';
      case 'purchase':
        return 'bg-blue-100 text-blue-800';
      case 'mortgage':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const ApplicationCard = ({ application }: { application: Application }) => (
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
              {application.property_title}
            </h3>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{application.property?.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(application.status)}>
              {React.createElement(getStatusIcon(application.status), { className: "w-3 h-3 mr-1" })}
              {application.status.replace('_', ' ').charAt(0).toUpperCase() + application.status.replace('_', ' ').slice(1)}
            </Badge>
            <Badge className={getApplicationTypeColor(application.application_type)}>
              {application.application_type.charAt(0).toUpperCase() + application.application_type.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Property Info */}
        {application.property && (
          <div className="flex gap-4 mb-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={application.property.images[0] || '/placeholder.svg'}
                alt={application.property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">
                {application.property.title}
              </p>
              <p className="text-lg font-bold text-blue-600">
                {formatPrice(application.property.price)}
              </p>
              <p className="text-xs text-gray-600">
                {application.property.property_type} • {application.property.location}
              </p>
            </div>
          </div>
        )}

        {/* Application Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <span className="text-sm text-gray-600">Application Type</span>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {application.application_type}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Submitted</span>
              <p className="text-sm font-medium text-gray-900">
                {new Date(application.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {application.notes && (
            <div className="mt-3">
              <span className="text-sm text-gray-600">Notes</span>
              <p className="text-sm text-gray-700 mt-1">{application.notes}</p>
            </div>
          )}
          
          {application.documents && application.documents.length > 0 && (
            <div className="mt-3">
              <span className="text-sm text-gray-600">Documents</span>
              <div className="flex gap-2 mt-1">
                {application.documents.map((doc, index) => (
                  <Button key={index} variant="outline" size="sm">
                    <FileText className="w-3 h-3 mr-1" />
                    Doc {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/property/${application.property_id}`}>
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              View Property
            </Button>
          </Link>
          
          {application.status === 'pending' && (
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </Button>
          )}
          
          {application.status === 'under_review' && (
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              View Progress
            </Button>
          )}
          
          {application.status === 'approved' && (
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Proceed
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track your property applications and their status</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-full sm:w-64"
            />
          </div>
          
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'under_review', label: 'Under Review' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'withdrawn', label: 'Withdrawn' },
            ].map((statusFilter) => (
              <Button
                key={statusFilter.value}
                variant={filter === statusFilter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(statusFilter.value as any)}
              >
                {statusFilter.label.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </div>

      {filteredApplications.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No applications found</h3>
          <p className="text-gray-500">Start applying for properties you're interested in</p>
          <Link to="/explore">
            <Button className="mt-4">
              <Search className="w-4 h-4 mr-2" />
              Explore Properties
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
