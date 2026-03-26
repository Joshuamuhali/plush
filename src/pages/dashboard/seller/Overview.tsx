import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Calendar, TrendingUp, Plus, Eye, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ListingStats {
  total: number;
  published: number;
  pending: number;
  draft: number;
}

interface LeadActivity {
  id: string;
  property_title: string;
  lead_count: number;
  last_activity: string;
}

interface RecentAppointment {
  id: string;
  property_title: string;
  buyer_name: string;
  date: string;
  status: string;
}

const SellerOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ListingStats>({
    total: 0,
    published: 0,
    pending: 0,
    draft: 0
  });
  const [leadActivity, setLeadActivity] = useState<LeadActivity[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load listing stats
      const { data: listings, error: listingsError } = await supabase
        .from('properties')
        .select('status')
        .eq('seller_id', user!.id);

      if (listingsError) throw listingsError;

      const listingStats = {
        total: listings?.length || 0,
        published: listings?.filter(l => l.status === 'published').length || 0,
        pending: listings?.filter(l => l.status === 'pending_review').length || 0,
        draft: listings?.filter(l => l.status === 'draft').length || 0,
      };
      setStats(listingStats);

      // Load lead activity (simplified - would need proper lead tracking)
      const { data: leads, error: leadsError } = await supabase
        .from('inquiries')
        .select(`
          id,
          created_at,
          properties (
            title
          )
        `)
        .eq('properties.seller_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (leadsError) throw leadsError;

      // Group leads by property
      const leadGroups: { [key: string]: LeadActivity } = {};
      leads?.forEach(lead => {
        const propertyTitle = lead.properties?.title || 'Unknown Property';
        if (!leadGroups[propertyTitle]) {
          leadGroups[propertyTitle] = {
            id: lead.id,
            property_title: propertyTitle,
            lead_count: 0,
            last_activity: lead.created_at
          };
        }
        leadGroups[propertyTitle].lead_count++;
      });

      setLeadActivity(Object.values(leadGroups));

      // Load recent appointments (would need appointments table)
      // For now, using placeholder data
      setRecentAppointments([]);

      // Load total views (would need view tracking)
      setTotalViews(0);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your properties and track your success.</p>
        </div>
        <Button onClick={() => navigate('/list-property')}>
          <Plus className="mr-2 h-4 w-4" />
          List New Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.published} published, {stats.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Activity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadActivity.length}</div>
            <p className="text-xs text-muted-foreground">Properties with inquiries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">Across all listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Listing Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Listing Status Overview</CardTitle>
          <CardDescription>Current status of your property listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <div className="text-sm text-muted-foreground">Published</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
              <div className="text-sm text-muted-foreground">Drafts</div>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/dashboard/seller/listings')}
            >
              Manage All Listings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Lead Activity</CardTitle>
            <CardDescription>Properties receiving the most interest</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {leadActivity.length > 0 ? (
              leadActivity.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.property_title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.lead_count} inquiry{activity.lead_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {activity.lead_count}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No lead activity yet.</p>
            )}

            {leadActivity.length > 0 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/dashboard/seller/leads')}
              >
                View All Leads
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Scheduled property viewings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAppointments.length > 0 ? (
              recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{appointment.property_title}</p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.buyer_name} • {new Date(appointment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                    {appointment.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No upcoming appointments.</p>
            )}

            {recentAppointments.length > 0 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/dashboard/seller/appointments')}
              >
                View All Appointments
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common seller tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              className="h-20 flex-col"
              onClick={() => navigate('/list-property')}
            >
              <Plus className="h-6 w-6 mb-2" />
              List New Property
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate('/dashboard/seller/listings')}
            >
              <Building2 className="h-6 w-6 mb-2" />
              Manage Listings
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

export default SellerOverview;
