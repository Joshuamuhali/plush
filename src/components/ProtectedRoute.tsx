import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: 'admin' | 'staff' | 'seller' | 'buyer';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, isInitialized } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    console.log('ProtectedRoute: useEffect called', { 
      isInitialized, 
      loading, 
      userId: user?.id,
      hasUser: !!user 
    });

    // Don't do anything until auth is initialized
    if (!isInitialized || loading) {
      console.log('ProtectedRoute: Auth not ready, waiting...');
      return;
    }

    const fetchProfile = async () => {
      console.log('ProtectedRoute: fetchProfile called, user:', user?.id);
      
      if (!user) {
        console.log('ProtectedRoute: No user found, setting profileLoading false');
        setUserProfile(null);
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        console.log('ProtectedRoute: Profile fetched:', profile);
        setUserProfile(profile);
      } catch (error) {
        console.error('ProtectedRoute: Error fetching profile:', error);
        setUserProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user, isInitialized, loading]);

  // Show loader until auth is initialized and profile is loaded
  if (!isInitialized || loading || profileLoading) {
    console.log('ProtectedRoute: Still loading, showing spinner', { 
      isInitialized, 
      loading, 
      profileLoading 
    });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Only redirect to login if auth is initialized and there's no user
  if (isInitialized && !user) {
    console.log('ProtectedRoute: Auth ready, no user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check the user's profile
  if (requiredRole && userProfile) {
    if (userProfile.role !== requiredRole) {
      console.log('ProtectedRoute: Role mismatch, redirecting to dashboard');
      // All authenticated users go to unified dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log('ProtectedRoute: Rendering protected element');
  return children;
}
