import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Search, Filter, Clock, CheckCircle, XCircle, AlertTriangle, MapPin, User, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Appointment {
  id: string;
  property_id: string;
  property_title: string;
  property_address?: string;
  buyer_id: string;
  buyer_name: string;
  buyer_phone?: string;
  buyer_email?: string;
  seller_id: string;
  seller_name: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  created_at: string;
  updated_at: string;
}

const AdminAppointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          properties (
            title,
            address
          ),
          buyer_profile:buyer_id (
            full_name,
            phone,
            email
          ),
          seller_profile:seller_id (
            full_name,
            phone,
            email
          )
        `)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;

      const formattedAppointments: Appointment[] = data?.map(item => ({
        id: item.id,
        property_id: item.property_id,
        property_title: item.properties?.title || 'Unknown Property',
        property_address: item.properties?.address,
        buyer_id: item.buyer_id,
        buyer_name: item.buyer_profile?.full_name || 'Unknown Buyer',
        buyer_phone: item.buyer_profile?.phone,
        buyer_email: item.buyer_profile?.email,
        seller_id: item.seller_id,
        seller_name: item.seller_profile?.full_name || 'Unknown Seller',
        date: item.date,
        time: item.time,
        status: item.status || 'scheduled',
        notes: item.notes,
        created_at: item.created_at,
        updated_at: item.updated_at
      })) || [];

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.property_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.seller_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;

      setAppointments(prev => prev.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: newStatus as Appointment['status'] }
          : appointment
      ));
    } catch (error) {
      console.error('Error updating appointment status:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'no_show':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStats = () => {
    return {
      total: appointments.length,
      scheduled: appointments.filter(a => a.status === 'scheduled').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
      today: appointments.filter(a => {
        const today = new Date().toDateString();
        const appointmentDate = new Date(a.date).toDateString();
        return today === appointmentDate;
      }).length,
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-2">Manage property viewing appointments and schedules</p>
        </div>
        <Button onClick={() => navigate('/dashboard/admin/overview')}>
          Back to Dashboard
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-orange-600">{stats.today}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search appointments, properties, or people..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Schedule</CardTitle>
          <CardDescription>
            {filteredAppointments.length} of {appointments.length} appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {new Date(appointment.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">{appointment.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.property_title}</p>
                        {appointment.property_address && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {appointment.property_address}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.buyer_name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          {appointment.buyer_phone && (
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {appointment.buyer_phone}
                            </div>
                          )}
                          {appointment.buyer_email && (
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {appointment.buyer_email}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.seller_name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={appointment.status}
                        onValueChange={(value) => updateAppointmentStatus(appointment.id, value)}
                        disabled={processing}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue>
                            <Badge className={getStatusColor(appointment.status)}>
                              <span className="flex items-center">
                                {getStatusIcon(appointment.status)}
                                <span className="ml-1 capitalize">
                                  {appointment.status.replace('_', ' ')}
                                </span>
                              </span>
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="no_show">No Show</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setDetailsDialogOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/property/${appointment.property_id}`)}
                        >
                          View Property
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No appointments found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Appointments will appear here when users schedule property viewings.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Full appointment information and management options
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Date & Time</Label>
                <p className="font-medium">
                  {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Property</Label>
                <p className="font-medium">{selectedAppointment.property_title}</p>
                {selectedAppointment.property_address && (
                  <p className="text-sm text-muted-foreground">{selectedAppointment.property_address}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Buyer</Label>
                  <div>
                    <p className="font-medium">{selectedAppointment.buyer_name}</p>
                    {selectedAppointment.buyer_phone && (
                      <p className="text-sm text-muted-foreground">{selectedAppointment.buyer_phone}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Seller</Label>
                  <p className="font-medium">{selectedAppointment.seller_name}</p>
                </div>
              </div>
              {selectedAppointment.notes && (
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.notes}</p>
                </div>
              )}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setDetailsDialogOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // Navigate to messages
                    setDetailsDialogOpen(false);
                    navigate('/dashboard/messages');
                  }}
                  className="flex-1"
                >
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAppointments;
