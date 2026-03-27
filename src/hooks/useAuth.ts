import { useAuthContext } from '@/app/providers/AuthProvider';

export const useAuth = () => {
  const { user, loading, isInitialized, signIn, signUp, signOut } = useAuthContext();
  
  return { 
    user, 
    loading, 
    isInitialized, 
    signIn: signIn as any, 
    signUp: signUp as any, 
    signOut: signOut as any 
  };
};

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (email: string, password: string, fullName: string, role: 'buyer' | 'seller' | 'admin' = 'buyer') => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        },
      });

      if (signUpError) throw signUpError;

      // Create profile manually since we can't modify auth triggers
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
            role: role,
            seller_verification_status: role === 'admin' ? 'verified' : 'pending',
            is_active: true
          });

        if (profileError) throw profileError;
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading, error };
};

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string, navigate?: (path: string) => void) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Attempting sign in for:', email);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw signInError;
      }
      
      console.log('Sign in successful:', data);
      
      // Wait a moment for the auth state to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get user profile to determine role-based redirect
      if (data.user && navigate) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          const userRole = profile?.role || 'buyer';
          
          console.log('User role detected:', userRole);
          
          if (userRole === 'buyer') {
            console.log('Redirecting buyer to unified dashboard...');
            navigate('/dashboard');
          } else if (['seller', 'admin', 'staff'].includes(userRole)) {
            console.log('Redirecting seller/admin to dashboard...');
            navigate('/dashboard');
          } else {
            console.log('Unknown role, redirecting to explore...');
            navigate('/explore');
          }
        } catch (profileError) {
          console.error('Error fetching profile for redirect:', profileError);
          // Fallback to explore if profile fetch fails
          console.log('Profile fetch failed, redirecting to explore...');
          navigate('/explore');
        }
      }
      
      return data;
    } catch (err) {
      console.error('Sign in failed:', err);
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, error };
};

export const useSignOut = () => {
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  return { signOut, loading };
};
