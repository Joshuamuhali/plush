import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService, type ProfileUpdateData } from '@/services/supabase';

export const useMyProfile = () => {
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: () => ProfileService.getMyProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProfile = (profileId: string) => {
  return useQuery({
    queryKey: ['profile', profileId],
    queryFn: () => ProfileService.getProfileById(profileId),
    enabled: !!profileId,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updateData: ProfileUpdateData) => ProfileService.updateMyProfile(updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useAllProfiles = (filters?: {
  role?: string;
  is_active?: boolean;
  seller_verification_status?: string;
}) => {
  return useQuery({
    queryKey: ['profiles', filters],
    queryFn: () => ProfileService.getAllProfiles(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'buyer' | 'seller' | 'admin' | 'staff' }) =>
      ProfileService.updateUserRole(userId, role),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
};

export const useUpdateSellerVerification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, status }: { 
      userId: string; 
      status: 'pending' | 'verified' | 'rejected';
    }) => ProfileService.updateSellerVerificationStatus(userId, status),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      ProfileService.updateUserStatus(userId, isActive),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
};

export const useSellers = () => {
  return useQuery({
    queryKey: ['sellers'],
    queryFn: () => ProfileService.getSellers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStaff = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: () => ProfileService.getStaff(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) =>
      ProfileService.uploadAvatar(userId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => ProfileService.deleteAvatar(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useSearchProfiles = () => {
  return useQuery({
    queryKey: ['profiles', 'search'],
    queryFn: () => ProfileService.searchProfiles(''),
    enabled: false, // Only run when explicitly called with search term
  });
};

export const useProfileStats = () => {
  return useQuery({
    queryKey: ['profile-stats'],
    queryFn: () => ProfileService.getProfileStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
