import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Pause,
  Play,
  Archive,
  MoreHorizontal,
  Building,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSellerListings } from '@/hooks/useSellerListings';

type ListingStatus = 'draft' | 'submitted' | 'approved' | 'active' | 'paused' | 'sold' | 'archived';

interface StatusBadgeProps {
  status: ListingStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
    submitted: { color: 'bg-yellow-100 text-yellow-800', label: 'Submitted' },
    approved: { color: 'bg-blue-100 text-blue-800', label: 'Approved' },
    active: { color: 'bg-green-100 text-green-800', label: 'Active' },
    paused: { color: 'bg-orange-100 text-orange-800', label: 'Paused' },
    sold: { color: 'bg-purple-100 text-purple-800', label: 'Sold' },
    archived: { color: 'bg-gray-100 text-gray-800', label: 'Archived' },
  };

  const config = statusConfig[status];
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}

export default function ManageListings() {
  const { listings, loading, deleteListing, updateListingStatus } = useSellerListings();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ListingStatus | 'all'>('all');
  const [selectedListings, setSelectedListings] = useState<string[]>([]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (listingId: string, newStatus: ListingStatus) => {
    try {
      await updateListingStatus(listingId, newStatus);
    } catch (error) {
      console.error('Failed to update listing status:', error);
    }
  };

  const handleDelete = async (listingId: string) => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        await deleteListing(listingId);
      } catch (error) {
        console.error('Failed to delete listing:', error);
      }
    }
  };

  const toggleSelection = (listingId: string) => {
    setSelectedListings(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  const selectAll = () => {
    if (selectedListings.length === filteredListings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(filteredListings.map(listing => listing.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-2">Manage your property listings</p>
          </div>
          <Link to="/seller/listings/create">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Listing
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ListingStatus | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="sold">Sold</option>
              <option value="archived">Archived</option>
            </select>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {filteredListings.length} listings
              </span>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedListings.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedListings.length} listing{selectedListings.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  Bulk Action
                </button>
                <button 
                  onClick={() => setSelectedListings([])}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Listings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Get started by creating your first property listing'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link
                  to="/seller/listings/create"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Listing
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedListings.length === filteredListings.length}
                        onChange={selectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inquiries
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedListings.includes(listing.id)}
                          onChange={() => toggleSelection(listing.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={listing.images[0] || '/placeholder-property.jpg'}
                            alt={listing.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{listing.title}</h3>
                            <p className="text-sm text-gray-500">{listing.location}</p>
                            <p className="text-xs text-gray-400">{listing.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={listing.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${listing.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {listing.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {listing.inquiries}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(listing.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/seller/listings/${listing.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/seller/listings/${listing.id}/edit`}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          {listing.status === 'active' ? (
                            <button
                              onClick={() => handleStatusChange(listing.id, 'paused')}
                              className="text-orange-600 hover:text-orange-800"
                              title="Pause listing"
                            >
                              <Pause className="h-4 w-4" />
                            </button>
                          ) : listing.status === 'paused' ? (
                            <button
                              onClick={() => handleStatusChange(listing.id, 'active')}
                              className="text-green-600 hover:text-green-800"
                              title="Resume listing"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          ) : null}
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete listing"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
