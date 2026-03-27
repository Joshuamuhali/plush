import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export type UserRole = 'buyer' | 'seller' | 'staff' | 'admin' | 'system_admin';

export const useProfile = () => {
  const { user, loading: authLoading, isInitialized } = useAuth();
  const [profile, setProfile] = useState<{
    id: string;
    full_name: string;
    role: UserRole;
    company_name?: string;
    seller_verification_status: string;
    is_active: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't do anything until auth is initialized
    if (!isInitialized || authLoading) {
      return;
    }

    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, isInitialized, authLoading]);

  return { profile, loading, error };
};
