import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Calendar, TrendingUp, BarChart3, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  pendingReviews: number;
  totalListings: number;
  activeLeads: number;
  upcomingAppointments: number;
  totalUsers: number;
}

interface RecentActivity {
  id: string;
  type: 'listing' | 'user' | 'inquiry' | 'appointment';
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

const AdminOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    pendingReviews: 0,
    totalListings: 0,
    activeLeads: 0,
    upcomingAppointments: 0,
    totalUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load stats
      const [
        { count: pendingReviews },
        { count: totalListings },
        { count: activeLeads },
        { count: totalUsers }
      ] = await Promise.all([
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending_review'),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('profiles').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        pendingReviews: pendingReviews || 0,
        totalListings: totalListings || 0,
        activeLeads: activeLeads || 0,
        upcomingAppointments: 0, // Would need appointments table
        totalUsers: totalUsers || 0
      });

      // Load recent activity
      const { data: recentListings, error: listingsError } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          status,
          created_at,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (listingsError) throw listingsError;

      const activity: RecentActivity[] = recentListings?.map(listing => ({
        id: listing.id,
        type: 'listing' as const,
        title: listing.title,
        description: `Submitted by ${listing.profiles?.full_name || 'Unknown'}`,
        timestamp: listing.created_at,
        status: listing.status
      })) || [];

      setRecentActivity(activity);

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage the platform, review content, and oversee operations.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">Listings awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalListings}</div>
            <p className="text-xs text-muted-foreground">Active property listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLeads}</div>
            <p className="text-xs text-muted-foreground">Open inquiries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Button
              className="h-20 flex-col"
              onClick={() => navigate('/dashboard/admin/review')}
            >
              <CheckCircle className="h-6 w-6 mb-2" />
              Review Queue
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate('/dashboard/admin/leads')}
            >
              <Users className="h-6 w-6 mb-2" />
              Lead Pipeline
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate('/dashboard/admin/appointments')}
            >
              <Calendar className="h-6 w-6 mb-2" />
              Appointments
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate('/dashboard/admin/analytics')}
            >
              <BarChart3 className="h-6 w-6 mb-2" />
              Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Listings</CardTitle>
            <CardDescription>Latest property submissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      activity.status === 'published' ? 'default' :
                      activity.status === 'pending_review' ? 'secondary' :
                      'outline'
                    }
                  >
                    {activity.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No recent activity.</p>
            )}
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Platform health and key metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalListings - stats.pendingReviews}
                </div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.activeLeads}</div>
                <div className="text-sm text-muted-foreground">Active Leads</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.upcomingAppointments}</div>
                <div className="text-sm text-muted-foreground">Appointments</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((stats.pendingReviews / Math.max(stats.totalListings, 1)) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Pending Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Administrative Tools</CardTitle>
          <CardDescription>Advanced platform management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="justify-start h-12"
              onClick={() => navigate('/dashboard/admin/users')}
            >
              <Users className="mr-3 h-4 w-4" />
              User Management
            </Button>
            <Button
              variant="outline"
              className="justify-start h-12"
              onClick={() => navigate('/dashboard/admin/analytics')}
            >
              <BarChart3 className="mr-3 h-4 w-4" />
              Advanced Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
