import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

interface Tour {
  id: string;
  property_id: string;
  property_title: string;
  property_image?: string;
  scheduled_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  notes?: string;
  created_at: string;
}

export default function Tours() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with real API call
  const mockTours: Tour[] = [
    {
      id: '1',
      property_id: 'prop1',
      property_title: 'Modern Villa in Lusaka',
      property_image: '/api/placeholder/400/300',
      scheduled_date: '2024-03-25T14:00:00Z',
      status: 'scheduled',
      buyer_name: 'John Doe',
      buyer_email: 'john@example.com',
      buyer_phone: '+260 977 123 456',
      notes: 'Interested in seeing the garden and pool area',
      created_at: '2024-03-24T10:30:00Z'
    },
    {
      id: '2',
      property_id: 'prop2',
      property_title: 'Beach House Paradise',
      property_image: '/api/placeholder/400/300',
      scheduled_date: '2024-03-26T10:00:00Z',
      status: 'scheduled',
      buyer_name: 'Jane Smith',
      buyer_email: 'jane@example.com',
      buyer_phone: '+260 977 789 012',
      notes: 'First-time buyer, needs guidance',
      created_at: '2024-03-24T11:15:00Z'
    },
    {
      id: '3',
      property_id: 'prop3',
      property_title: 'Luxury Apartment Downtown',
      property_image: '/api/placeholder/400/300',
      scheduled_date: '2024-03-20T16:00:00Z',
      status: 'completed',
      buyer_name: 'Mike Johnson',
      buyer_email: 'mike@example.com',
      notes: 'Tour went well, buyer made an offer',
      created_at: '2024-03-20T09:00:00Z'
    }
  ];

  useState(() => {
    setTimeout(() => {
      setTours(mockTours);
      setLoading(false);
    }, 1000);
  });

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.property_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.buyer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tour.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return Clock;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const handleStatusUpdate = (tourId: string, newStatus: 'completed' | 'cancelled') => {
    setTours(prev => prev.map(tour => 
      tour.id === tourId ? { ...tour, status: newStatus } : tour
    ));
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Property Tours</h1>
            <Badge variant="secondary">
              {filteredTours.length} tours
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Tour
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTours.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  {tour.property_image ? (
                    <img
                      src={tour.property_image}
                      alt={tour.property_title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Calendar className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusColor(tour.status)}>
                      {(() => {
                        const Icon = getStatusIcon(tour.status);
                        return <Icon className="h-3 w-3 mr-1" />;
                      })()}
                      {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{tour.property_title}</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span>{tour.buyer_name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(tour.scheduled_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{new Date(tour.scheduled_date).toLocaleTimeString()}</span>
                    </div>
                    {tour.buyer_phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{tour.buyer_phone}</span>
                      </div>
                    )}
                  </div>

                  {tour.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {tour.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTour(tour)}
                    >
                      View Details
                    </Button>
                    {tour.status === 'scheduled' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(tour.id, 'completed')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(tour.id, 'cancelled')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tours found</h3>
            <p className="text-gray-500 mb-6">No tours match your current filters</p>
            <Button onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Tour Detail Modal */}
      {selectedTour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tour Details</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedTour(null)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{selectedTour.property_title}</h3>
                <Badge className={getStatusColor(selectedTour.status)}>
                  {(() => {
                    const Icon = getStatusIcon(selectedTour.status);
                    return <Icon className="h-3 w-3 mr-1" />;
                  })()}
                  {selectedTour.status.charAt(0).toUpperCase() + selectedTour.status.slice(1)}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Buyer Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{selectedTour.buyer_name}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{selectedTour.buyer_email}</span>
                    </div>
                    {selectedTour.buyer_phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedTour.buyer_phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Schedule</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{new Date(selectedTour.scheduled_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{new Date(selectedTour.scheduled_date).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedTour.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600">{selectedTour.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTour(null)}
                >
                  Close
                </Button>
                {selectedTour.status === 'scheduled' && (
                  <>
                    <Button
                      onClick={() => {
                        handleStatusUpdate(selectedTour.id, 'completed');
                        setSelectedTour(null);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark as Completed
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleStatusUpdate(selectedTour.id, 'cancelled');
                        setSelectedTour(null);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      Cancel Tour
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
