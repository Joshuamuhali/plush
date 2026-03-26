import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AuthGate() {
  const { user, loading, isInitialized } = useAuth();

  console.log('AuthGate: Checking auth state', { 
    isInitialized, 
    loading, 
    userId: user?.id,
    hasUser: !!user 
  });

  // Show loading while checking auth
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to auth
  if (!user) {
    console.log('AuthGate: No user session, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // User is authenticated, redirect to dashboard (single canonical dashboard route)
  console.log('AuthGate: User authenticated, redirecting to dashboard');
  return <Navigate to="/dashboard" replace />;
}
