import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Eye, Search, Filter, AlertTriangle, Building2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PendingProperty {
  id: string;
  title: string;
  price: number;
  property_type: string;
  city: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  description: string;
  created_at: string;
  seller_profile: {
    full_name: string;
    phone?: string;
    email: string;
    company_name?: string;
  };
  images: { url: string }[];
}

const AdminReviewQueue = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<PendingProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PendingProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<PendingProperty | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPendingProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm]);

  const loadPendingProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:seller_id (
            full_name,
            phone,
            email,
            company_name
          )
        `)
        .eq('status', 'pending_review')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProperties: PendingProperty[] = data?.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        property_type: item.property_type,
        city: item.city,
        location: item.location,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        area: item.area,
        description: item.description,
        created_at: item.created_at,
        seller_profile: {
          full_name: item.profiles?.full_name || 'Unknown Seller',
          phone: item.profiles?.phone,
          email: item.profiles?.email || '',
          company_name: item.profiles?.company_name
        },
        images: item.images || []
      })) || [];

      setProperties(formattedProperties);
    } catch (error) {
      console.error('Error loading pending properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    if (!searchTerm) {
      setFilteredProperties(properties);
      return;
    }

    const filtered = properties.filter(property =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.seller_profile.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProperties(filtered);
  };

  const handleReview = async () => {
    if (!selectedProperty || !reviewAction) return;

    setProcessing(true);
    try {
      const newStatus = reviewAction === 'approve' ? 'published' : 'rejected';

      const { error } = await supabase
        .from('properties')
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user!.id,
          review_notes: reviewNotes
        })
        .eq('id', selectedProperty.id);

      if (error) throw error;

      // Send notification to seller (would implement notification system)
      // For now, just reload the list
      await loadPendingProperties();

      setReviewDialogOpen(false);
      setSelectedProperty(null);
      setReviewAction(null);
      setReviewNotes('');
    } catch (error) {
      console.error('Error processing review:', error);
    } finally {
      setProcessing(false);
    }
  };

  const openReviewDialog = (property: PendingProperty, action: 'approve' | 'reject') => {
    setSelectedProperty(property);
    setReviewAction(action);
    setReviewDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Queue</h1>
          <p className="text-gray-600 mt-2">Review and approve property listings submitted by sellers</p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {properties.length} pending
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold text-yellow-600">{properties.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Review Time</p>
                <p className="text-2xl font-bold">2.3 days</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-green-600">24 approved</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties, sellers, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Property Reviews</CardTitle>
          <CardDescription>
            {filteredProperties.length} of {properties.length} properties awaiting review
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProperties.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                          {property.images?.[0]?.url ? (
                            <img
                              src={property.images[0].url}
                              alt={property.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                              <Building2 className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium line-clamp-1">{property.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {property.bedrooms && `${property.bedrooms} bed • `}
                            {property.bathrooms && `${property.bathrooms} bath • `}
                            {property.area && `${property.area} sqm`}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{property.seller_profile.full_name}</p>
                        {property.seller_profile.company_name && (
                          <p className="text-sm text-muted-foreground">{property.seller_profile.company_name}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{property.property_type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ZMW {property.price.toLocaleString()}
                    </TableCell>
                    <TableCell>{property.city}</TableCell>
                    <TableCell>
                      {new Date(property.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/property/${property.id}`)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => openReviewDialog(property, 'approve')}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => openReviewDialog(property, 'reject')}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">All caught up!</h3>
              <p className="text-gray-500">
                {searchTerm ? 'No properties match your search.' : 'No properties are currently pending review.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve Property' : 'Reject Property'}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve'
                ? 'This property will be published and visible to buyers.'
                : 'This property will be rejected and returned to the seller for corrections.'
              }
            </DialogDescription>
          </DialogHeader>

          {selectedProperty && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{selectedProperty.title}</h4>
                <p className="text-sm text-muted-foreground">
                  Submitted by {selectedProperty.seller_profile.full_name}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-notes">Review Notes (Optional)</Label>
                <Textarea
                  id="review-notes"
                  placeholder={reviewAction === 'approve'
                    ? 'Add any notes for the seller...'
                    : 'Explain why this property was rejected...'
                  }
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setReviewDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReview}
                  disabled={processing}
                  className={`flex-1 ${
                    reviewAction === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {processing ? 'Processing...' : reviewAction === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReviewQueue;
