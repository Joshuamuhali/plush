import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useDashboard } from '@/hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Building, 
  Users, 
  Settings, 
  BarChart3,
  FileText,
  Calendar,
  MessageSquare,
  Shield,
  UserCheck,
  Plus,
  Search,
  Bell,
  LogOut,
  RefreshCw
} from 'lucide-react';

// Role-specific dashboard components
function BuyerDashboard() {
  return <div>Buyer Dashboard - Coming Soon</div>;
}

function PropertyAdminDashboard() {
  const { data, loading, error, refreshData } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Total Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{data.totalProperties || 0}</div>
            <p className="text-sm text-gray-600">Properties managed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Pending Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{data.pendingListings || 0}</div>
            <p className="text-sm text-gray-600">Awaiting approval</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Tours Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{data.toursToday || 0}</div>
            <p className="text-sm text-gray-600">Scheduled visits</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{data.inquiries || 0}</div>
            <p className="text-sm text-gray-600">Buyer messages</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.propertiesData?.slice(0, 3).map((property, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{property.title}</p>
                    <p className="text-sm text-gray-600">
                      Listed {new Date(property.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                    {property.status || 'Pending'}
                  </Badge>
                </div>
              )) || <p className="text-gray-500">No properties found</p>}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                New Listing
              </Button>
              <Button variant="outline" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Tours
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SystemAdminDashboard() {
  const { data, loading, error, refreshData } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{data.totalUsers || 0}</div>
            <p className="text-sm text-gray-600">Registered users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-green-600" />
              Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{data.totalProperties || 0}</div>
            <p className="text-sm text-gray-600">Total listings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-purple-600" />
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{data.totalAdmins || 0}</div>
            <p className="text-sm text-gray-600">System & property admins</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">${(data.monthlyRevenue || 0).toLocaleString()}</div>
            <p className="text-sm text-gray-600">This month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Database</span>
                <Badge variant="default">{data.systemHealth?.database || 'Unknown'}</Badge>
              </div>
              <div className="flex justify-between">
                <span>API</span>
                <Badge variant="default">{data.systemHealth?.api || 'Unknown'}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Storage</span>
                <Badge variant="secondary">{data.systemHealth?.storage || 'Unknown'}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Active Today</span>
                <span className="font-medium">{data.systemHealth?.activeUsersToday || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>New This Week</span>
                <span className="font-medium">{data.systemHealth?.newUsersThisWeek || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion Rate</span>
                <span className="font-medium">{(data.systemHealth?.conversionRate || 0).toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
              <Button variant="outline" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Unauthorized() {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <Shield className="h-5 w-5" />
          Access Denied
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          You don't have permission to access this dashboard. Please contact your administrator.
        </p>
        <Button variant="outline" className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user, loading, isInitialized } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  console.log('Dashboard: state', { 
    isInitialized, 
    loading, 
    profileLoading, 
    userId: user?.id, 
    hasUser: !!user,
    hasProfile: !!profile 
  });

  // Show loader until auth is initialized and profile is loaded
  if (!isInitialized || loading || profileLoading) {
    console.log('Dashboard: Still loading auth or profile, showing spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  // Only show login redirect if auth is ready and there's no user
  if (isInitialized && !user) {
    console.log('Dashboard: Auth ready, no user found');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No user found. Please log in again.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If auth is ready but no profile found
  if (!profile) {
    console.log('Dashboard: Auth ready, but no profile found for user:', user.id);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Profile not found. Please contact support.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const role = profile?.role || 'buyer';
  const fullName = profile?.full_name || user?.email || 'User';

  console.log('Dashboard: Checking role:', role);

  // Only sellers, staff, and admins should see the management dashboard
  if (!['seller', 'staff', 'admin'].includes(role)) {
    console.log('Dashboard: Buyer detected, showing buyer dashboard');
    return <BuyerDashboard />;
  }

  console.log('Dashboard: Rendering management dashboard for role:', role);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {fullName}</h1>
              <div className="text-sm text-gray-600">
                Account type: <Badge variant="secondary">{role.replace('_', ' ').toUpperCase()}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {role === 'admin' && <SystemAdminDashboard />}
        {role === 'staff' && <PropertyAdminDashboard />}
        {role === 'seller' && <PropertyAdminDashboard />}
      </main>
    </div>
  );
}
