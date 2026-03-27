import { useState } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  Reply,
  Archive,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSellerLeads } from '@/hooks/useSellerLeads';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed' | 'rejected';

interface StatusBadgeProps {
  status: LeadStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    new: { color: 'bg-blue-100 text-blue-800', label: 'New', icon: Clock },
    contacted: { color: 'bg-yellow-100 text-yellow-800', label: 'Contacted', icon: MessageSquare },
    qualified: { color: 'bg-green-100 text-green-800', label: 'Qualified', icon: CheckCircle },
    closed: { color: 'bg-gray-100 text-gray-800', label: 'Closed', icon: Archive },
    rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected', icon: XCircle },
  };

  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </span>
  );
}

export default function InquiriesPage() {
  const { leads, loading, updateLeadStatus, getLeadsByType } = useSellerLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null);

  const inquiries = getLeadsByType('inquiry');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.buyer_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.buyer_profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.listing?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.lead_data.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (inquiryId: string, newStatus: LeadStatus) => {
    try {
      await updateLeadStatus(inquiryId, newStatus);
    } catch (error) {
      console.error('Failed to update inquiry status:', error);
    }
  };

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Buyer Inquiries</h1>
            <p className="text-gray-600 mt-2">Manage inquiries from interested buyers</p>
          </div>
          {newInquiriesCount > 0 && (
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
              <MessageSquare className="h-5 w-5 inline mr-2" />
              {newInquiriesCount} new inquiries
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{inquiries.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Qualified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inquiries.filter(i => i.status === 'qualified').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inquiries.filter(i => ['new', 'contacted'].includes(i.status)).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-full">
                <Archive className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Closed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inquiries.filter(i => ['closed', 'rejected'].includes(i.status)).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="closed">Closed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredInquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Inquiries from interested buyers will appear here'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900 mr-3">
                          {inquiry.buyer_profile?.full_name || 'Unknown Buyer'}
                        </h3>
                        <StatusBadge status={inquiry.status} />
                        {inquiry.status === 'new' && (
                          <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            New
                          </span>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <Link 
                          to={`/property/${inquiry.listing_id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {inquiry.listing?.title}
                        </Link>
                        <span className="text-gray-500 ml-2">
                          • {inquiry.listing?.location}
                        </span>
                      </div>

                      <div className="mb-3">
                        <p className="text-gray-700">{inquiry.lead_data.message}</p>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {inquiry.buyer_profile?.email}
                        </div>
                        {inquiry.buyer_profile?.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {inquiry.buyer_profile.phone}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="ml-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedInquiry(inquiry.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Reply"
                        >
                          <Reply className="h-4 w-4" />
                        </button>
                        <Link
                          to={`/property/${inquiry.listing_id}`}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                          title="View Property"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        
                        <select
                          value={inquiry.status}
                          onChange={(e) => handleStatusChange(inquiry.id, e.target.value as LeadStatus)}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="closed">Closed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Reply Form - shown when inquiry is selected */}
                  {selectedInquiry === inquiry.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Quick Reply</h4>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Type your reply..."
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={() => setSelectedInquiry(null)}
                          className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            // Handle reply logic here
                            setSelectedInquiry(null);
                          }}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Send Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
