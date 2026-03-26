import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LeadService, type LeadFormData, type LeadUpdateData } from '@/services/supabase';

export const useLeads = (filters?: {
  stage?: string;
  assigned_to?: string;
  property_id?: string;
}) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: () => LeadService.getAllLeads(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useLead = (leadId: string) => {
  return useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => LeadService.getLeadById(leadId),
    enabled: !!leadId,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (leadData: LeadFormData) => LeadService.createLead(leadData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ leadId, updateData }: { leadId: string; updateData: LeadUpdateData }) =>
      LeadService.updateLead(leadId, updateData),
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
    },
  });
};

export const useAddLeadNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ leadId, authorId, body }: { leadId: string; authorId: string; body: string }) =>
      LeadService.addLeadNote(leadId, authorId, body),
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
    },
  });
};

export const useLogLeadEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ leadId, actorId, eventType, payload }: { 
      leadId: string; 
      actorId: string; 
      eventType: string; 
      payload?: any;
    }) => LeadService.logLeadEvent(leadId, actorId, eventType, payload),
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
    },
  });
};

export const useSellerLeadRefs = (sellerId: string, propertyId?: string) => {
  return useQuery({
    queryKey: ['seller-lead-refs', sellerId, propertyId],
    queryFn: () => LeadService.getSellerLeadRefs(sellerId, propertyId),
    enabled: !!sellerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useLeadStats = (filters?: {
  assigned_to?: string;
  date_from?: string;
  date_to?: string;
}) => {
  return useQuery({
    queryKey: ['lead-stats', filters],
    queryFn: () => LeadService.getLeadStats(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
