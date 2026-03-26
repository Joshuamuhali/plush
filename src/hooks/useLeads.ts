import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Lead } from '@/types/database';

export const useSubmitLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

export const useMyLeads = () => {
  return useQuery({
    queryKey: ['leads', 'my'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      // For sellers: get leads on their properties
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          properties (id, title, location, price)
        `)
        .eq('properties.seller_id', user.id) // Leads on seller's properties
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useAllLeads = () => {
  return useQuery({
    queryKey: ['leads', 'all'],
    queryFn: async () => {
      // Only admins can see all leads
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          properties (id, title, location, price, seller_id, users(id, full_name, email))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, status, adminNotes }: {
      leadId: string;
      status: Lead['status'];
      adminNotes?: string;
    }) => {
      const updateData: any = { status };
      if (adminNotes !== undefined) {
        updateData.admin_notes = adminNotes;
      }

      const { data, error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', leadId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
