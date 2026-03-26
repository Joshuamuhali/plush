import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PropertyService, type PropertyFormData } from '@/services/supabase';
import type { Property } from '@/types/property';

export const useProperties = (filters?: {
  property_type?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
}) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => PropertyService.getPublishedProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProperty = (slug: string) => {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: () => PropertyService.getPropertyBySlug(slug),
    enabled: !!slug,
  });
};

export const useSellerProperties = (sellerId: string) => {
  return useQuery({
    queryKey: ['seller-properties', sellerId],
    queryFn: () => PropertyService.getSellerProperties(sellerId),
    enabled: !!sellerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sellerId, propertyData }: { sellerId: string; propertyData: PropertyFormData }) =>
      PropertyService.createProperty(sellerId, propertyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ propertyId, propertyData }: { propertyId: string; propertyData: Partial<PropertyFormData> }) =>
      PropertyService.updateProperty(propertyId, propertyData),
    onSuccess: (_, { propertyId }) => {
      queryClient.invalidateQueries({ queryKey: ['seller-properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
    },
  });
};

export const useSubmitForReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (propertyId: string) => PropertyService.submitForReview(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-properties'] });
      queryClient.invalidateQueries({ queryKey: ['pending-review-properties'] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (propertyId: string) => PropertyService.deleteProperty(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

// Admin hooks
export const usePendingReviewProperties = () => {
  return useQuery({
    queryKey: ['pending-review-properties'],
    queryFn: () => PropertyService.getPendingReviewProperties(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useApproveProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ propertyId, adminId }: { propertyId: string; adminId: string }) =>
      PropertyService.approveProperty(propertyId, adminId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-review-properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useRejectProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ propertyId, adminId, rejectionReason }: { 
      propertyId: string; 
      adminId: string; 
      rejectionReason: string;
    }) => PropertyService.rejectProperty(propertyId, adminId, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-review-properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const usePublishProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (propertyId: string) => PropertyService.publishProperty(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['seller-properties'] });
    },
  });
};
