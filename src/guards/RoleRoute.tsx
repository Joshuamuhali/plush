import { Navigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';

interface RoleRouteProps {
  children: React.ReactNode;
  requiredRole: 'buyer' | 'seller' | 'admin' | 'staff' | 'system_admin';
}

export default function RoleRoute({ children, requiredRole }: RoleRouteProps) {
  const { profile, loading, error } = useProfile();

  // Show loading while checking profile
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Show error state if profile fetch failed
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Unable to verify permissions</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Check if user has required role (admin can access all roles)
  const hasRequiredRole = profile.role === requiredRole || profile.role === 'admin' || profile.role === 'system_admin';
  
  // Special case: system_admin can access all admin routes
  if (requiredRole === 'admin' && profile.role === 'system_admin') {
    return <>{children}</>;
  }

  if (!hasRequiredRole) {
    // Redirect to appropriate dashboard based on role
    const redirectMap: Record<string, string> = {
      buyer: '/dashboard',
      seller: '/dashboard', 
      admin: '/admin/properties',
      staff: '/admin/properties',
      system_admin: '/admin/system'
    };
    
    const redirectPath = redirectMap[profile.role] || '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
