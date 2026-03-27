import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useState, useEffect, createContext, useContext } from 'react';

// Create context for profile
const ProfileContext = createContext<any>(null);

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: 'admin' | 'staff' | 'seller' | 'buyer';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, isInitialized } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);

  useEffect(() => {
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
        setLoadedUserId(null);
        return;
      }

      // Prevent duplicate fetches for same user
      if (loadedUserId === user.id) {
        console.log('ProtectedRoute: Profile already loaded for user, skipping fetch');
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        setProfileError(null);
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
        );

        const fetchPromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

        if (error) {
          // If it's a timeout error, create a minimal profile
          if (error.message === 'Profile fetch timeout') {
            console.log('ProtectedRoute: Profile fetch timed out, creating minimal profile');
            const minimalProfile = {
              id: user.id,
              email: user.email,
              role: 'seller', // Default to seller for testing
              full_name: user.email?.split('@')[0] || 'Seller',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            setUserProfile(minimalProfile);
            setLoadedUserId(user.id);
          } else {
            throw error;
          }
        } else {
          console.log('ProtectedRoute: Profile fetched:', data);
          setUserProfile(data);
          setLoadedUserId(user.id);
        }
      } catch (error) {
        console.error('ProtectedRoute: Error fetching profile:', error);
        setProfileError(error instanceof Error ? error.message : 'Failed to fetch profile');
        
        // Create minimal profile on error
        const minimalProfile = {
          id: user.id,
          email: user.email,
          role: 'seller', // Default to seller for testing
          full_name: user.email?.split('@')[0] || 'Seller',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUserProfile(minimalProfile);
        setLoadedUserId(user.id);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, isInitialized, loading]);

  // Show loader until auth is initialized and profile is loaded or errored
  if (!isInitialized || loading || (profileLoading && !profileError)) {
    console.log('ProtectedRoute: Still loading, showing spinner', { 
      isInitialized, 
      loading, 
      profileLoading,
      profileError 
    });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error state if profile fetch failed
  if (profileError) {
    console.log('ProtectedRoute: Profile fetch error, but continuing with minimal profile');
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
  return (
    <ProfileContext.Provider value={userProfile}>
      {children}
    </ProfileContext.Provider>
  );
}

// Export hook to use profile context
export const useProfileContext = () => useContext(ProfileContext);
