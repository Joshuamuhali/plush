import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useSystemAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSystemAdmin = async (adminData: {
    email: string;
    password: string;
    fullName: string;
    companyName?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Create admin user with NO metadata to avoid trigger issues
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: adminData.email,
        password: adminData.password,
        options: {
          data: {} // Empty object to avoid trigger
        }
      });

      if (signUpError) throw signUpError;

      // Wait for user creation
      if (authData.user) {
        // Wait a moment for auth to complete
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create profile manually with admin role
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: adminData.fullName,
            role: 'admin',
            company_name: adminData.companyName,
            seller_verification_status: 'verified', // Use correct enum value
            is_active: true
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }
      }

      return authData.user;
    } catch (err) {
      console.error('System admin creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create system admin');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createSystemAdmin, loading, error };
};
