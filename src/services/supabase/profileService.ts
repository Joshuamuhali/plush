import { supabase } from '@/lib/supabase';

export interface Profile {
  id: string;
  role: 'buyer' | 'seller' | 'admin' | 'staff';
  full_name: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  company_name?: string;
  company_registration?: string;
  seller_verification_status?: 'pending' | 'verified' | 'rejected';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateData {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  company_name?: string;
  company_registration?: string;
}

export class ProfileService {
  // Get current user's profile
  static async getMyProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data as Profile;
  }

  // Get profile by ID
  static async getProfileById(profileId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data as Profile;
  }

  // Update current user's profile
  static async updateMyProfile(updateData: ProfileUpdateData): Promise<Profile> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }

  // Admin: Get all profiles
  static async getAllProfiles(filters?: {
    role?: string;
    is_active?: boolean;
    seller_verification_status?: string;
  }): Promise<Profile[]> {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.role) {
      query = query.eq('role', filters.role);
    }
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }
    if (filters?.seller_verification_status) {
      query = query.eq('seller_verification_status', filters.seller_verification_status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Profile[];
  }

  // Admin: Update user role
  static async updateUserRole(userId: string, role: 'buyer' | 'seller' | 'admin' | 'staff'): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }

  // Admin: Update seller verification status
  static async updateSellerVerificationStatus(
    userId: string, 
    status: 'pending' | 'verified' | 'rejected'
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        seller_verification_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }

  // Admin: Deactivate/activate user
  static async updateUserStatus(userId: string, isActive: boolean): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }

  // Get sellers (for admin dropdowns, etc.)
  static async getSellers(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'seller')
      .eq('is_active', true)
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data as Profile[];
  }

  // Get staff/admin users (for assignment dropdowns)
  static async getStaff(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['admin', 'staff'])
      .eq('is_active', true)
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data as Profile[];
  }

  // Upload avatar
  static async uploadAvatar(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        upsert: true,
        cacheControl: '3600',
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update profile with new avatar URL
    await this.updateMyProfile({ avatar_url: publicUrl });

    return publicUrl;
  }

  // Delete avatar
  static async deleteAvatar(userId: string): Promise<void> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    if (profile?.avatar_url) {
      // Extract file path from URL
      const urlParts = profile.avatar_url.split('/');
      const fileName = urlParts[urlParts.length - 2] + '/' + urlParts[urlParts.length - 1];

      const { error } = await supabase.storage
        .from('avatars')
        .remove([fileName]);

      if (error) throw error;
    }

    // Update profile to remove avatar URL
    await this.updateMyProfile({ avatar_url: null });
  }

  // Search profiles
  static async searchProfiles(query: string, filters?: {
    role?: string;
    is_active?: boolean;
  }): Promise<Profile[]> {
    let dbQuery = supabase
      .from('profiles')
      .select('*')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);

    // Apply filters
    if (filters?.role) {
      dbQuery = dbQuery.eq('role', filters.role);
    }
    if (filters?.is_active !== undefined) {
      dbQuery = dbQuery.eq('is_active', filters.is_active);
    }

    const { data, error } = await dbQuery
      .order('full_name', { ascending: true })
      .limit(50);

    if (error) throw error;
    return data as Profile[];
  }

  // Get profile statistics
  static async getProfileStats(): Promise<any> {
    const { data, error } = await supabase
      .from('profiles')
      .select('role, is_active, seller_verification_status, created_at');

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      by_role: {} as Record<string, number>,
      active: 0,
      inactive: 0,
      sellers_pending: 0,
      sellers_verified: 0,
      sellers_rejected: 0,
      new_this_month: 0,
    };

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    data?.forEach(profile => {
      // Count by role
      stats.by_role[profile.role] = (stats.by_role[profile.role] || 0) + 1;

      // Count active/inactive
      if (profile.is_active) stats.active++;
      else stats.inactive++;

      // Count seller verification statuses
      if (profile.seller_verification_status) {
        if (profile.seller_verification_status === 'pending') stats.sellers_pending++;
        if (profile.seller_verification_status === 'verified') stats.sellers_verified++;
        if (profile.seller_verification_status === 'rejected') stats.sellers_rejected++;
      }

      // Count new users this month
      const createdDate = new Date(profile.created_at);
      if (createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear) {
        stats.new_this_month++;
      }
    });

    return stats;
  }
}
