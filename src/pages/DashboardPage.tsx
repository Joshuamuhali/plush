import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import BuyerDashboard from '@/pages/buyer/Dashboard';

// Role-specific dashboard components
function PropertyAdminDashboard({ profile }: { profile: any }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Property Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {profile?.full_name || 'Admin'}!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Properties</h3>
            <p className="text-gray-600">Add, edit, and manage properties</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Inquiries</h3>
            <p className="text-gray-600">Manage property inquiries</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">View property performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemAdminDashboard({ profile }: { profile: any }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {profile?.full_name || 'System Admin'}!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600">Manage system users and roles</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-600">Configure system settings</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">System Logs</h3>
            <p className="text-gray-600">View system activity logs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Error</h3>
          <p className="text-gray-600 mb-4">{message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { profile, loading, error } = useProfile();

  console.log('DashboardPage: Rendering', { 
    userId: user?.id,
    profileLoading: loading,
    hasProfile: !!profile,
    role: profile?.role,
    error 
  });

  // Show loading while checking profile
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to auth
  if (!user) {
    console.log('DashboardPage: No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // If profile fetch error
  if (error) {
    console.log('DashboardPage: Profile fetch error', error);
    return <DashboardErrorState message="Failed to load your account profile." />;
  }

  // If no profile exists
  if (!profile) {
    console.log('DashboardPage: No profile found');
    return <DashboardErrorState message="No account profile was found for this user." />;
  }

  // Render dashboard based on role
  const role = String(profile.role || 'buyer').toLowerCase();
  console.log('DashboardPage: Rendering dashboard for role:', role);

  switch (role) {
    case 'buyer':
      // Use the EXACT existing buyer dashboard component
      return <BuyerDashboard />;
    case 'property_admin':
      return <PropertyAdminDashboard profile={profile} />;
    case 'system_admin':
      return <SystemAdminDashboard profile={profile} />;
    default:
      return <DashboardErrorState message="This account role is not recognized." />;
  }
}
