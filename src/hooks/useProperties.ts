import { useQuery } from '@tanstack/react-query';
import { PropertyService } from '@/services/supabase/propertyService';
import type { Property } from '@/types/database';

export const useProperties = (filters?: PropertyFilters) => {
  return useQuery({
    queryKey: ['published-properties', filters],
    queryFn: () => PropertyService.getPublishedProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSellerProperties = (sellerId: string) => {
  return useQuery({
    queryKey: ['seller-properties', sellerId],
    queryFn: () => PropertyService.getSellerProperties(sellerId),
    enabled: !!sellerId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAllProperties = () => {
  return useQuery({
    queryKey: ['all-properties'],
    queryFn: () => PropertyService.getAllProperties(),
    staleTime: 5 * 60 * 1000,
  });
};
