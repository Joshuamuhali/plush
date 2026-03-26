import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  BarChart3,
  Settings,
  TrendingUp,
  Shield,
  UserCheck,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const userRole = profile?.role || 'staff'; // Default to staff if no profile
  
  const isSystemAdmin = userRole === 'admin';
  const isPropertyAdmin = userRole === 'staff' || isSystemAdmin;

  // Placeholder stats - replace with real queries
  const stats = {
    totalProperties: 150,
    publishedProperties: 120,
    pendingReview: 25,
    rejectedListings: 8,
    activeSellers: 45,
    totalBuyers: 1200,
    newLeadsToday: 18,
    openInquiries: 7,
    scheduledAppointments: 12
  };

  const loading = false;

  const ExecutiveOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-8 w-8 text-blue-600" />
            Platform Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600">{stats.totalProperties}</div>
              <div className="text-sm text-gray-600">Total Properties</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-green-600">{stats.publishedProperties}</div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingReview}</div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-red-600">{stats.rejectedListings}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-purple-600">{stats.activeSellers}</div>
              <div className="text-sm text-gray-600">Active Sellers</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-indigo-600">{stats.totalBuyers}</div>
              <div className="text-sm text-gray-600">Total Buyers</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-orange-600">{stats.newLeadsToday}</div>
              <div className="text-sm text-gray-600">New Leads Today</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-teal-600">{stats.openInquiries}</div>
              <div className="text-sm text-gray-600">Open Inquiries</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-cyan-600">{stats.scheduledAppointments}</div>
              <div className="text-sm text-gray-600">Scheduled Appointments</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('/admin/listings')}
              className="w-full"
              variant="outline"
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Listings
            </Button>
            <Button 
              onClick={() => navigate('/admin/users')}
              className="w-full"
              variant="outline"
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button 
              onClick={() => navigate('/admin/leads')}
              className="w-full"
              variant="outline"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              CRM Leads
            </Button>
            <Button 
              onClick={() => navigate('/admin/inquiries')}
              className="w-full"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Contact Inquiries
            </Button>
            <Button 
              onClick={() => navigate('/admin/appointments')}
              className="w-full"
              variant="outline"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Appointments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">System Admin Dashboard</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {isPropertyAdmin && <TabsTrigger value="listings">Listings</TabsTrigger>}
            {isPropertyAdmin && <TabsTrigger value="leads">Leads</TabsTrigger>}
            {isPropertyAdmin && <TabsTrigger value="inquiries">Inquiries</TabsTrigger>}
            {isPropertyAdmin && <TabsTrigger value="appointments">Appointments</TabsTrigger>}
            {isSystemAdmin && <TabsTrigger value="users">Users</TabsTrigger>}
            {isSystemAdmin && <TabsTrigger value="roles">Roles</TabsTrigger>}
            {isSystemAdmin && <TabsTrigger value="activity">Activity Logs</TabsTrigger>}
            {isSystemAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview">
            {profileLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
              </div>
            ) : (
              <ExecutiveOverview />
            )}
          </TabsContent>

          <TabsContent value="listings">
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Listings moderation interface coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>User management interface coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>CRM leads interface coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="inquiries">
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Contact inquiries interface coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="appointments">
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Appointment management interface coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Admin messaging interface coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Activity logs interface coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="text-center py-12 text-gray-500">
              <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>System settings interface coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
