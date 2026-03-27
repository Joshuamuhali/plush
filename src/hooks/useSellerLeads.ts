import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface SellerLead {
  id: string;
  seller_id: string;
  buyer_id: string;
  listing_id: string;
  lead_type: 'inquiry' | 'viewing' | 'offer' | 'application';
  lead_data: {
    message?: string;
    viewing_date?: string;
    viewing_time?: string;
    offer_amount?: number;
    offer_currency?: string;
    offer_terms?: string;
    contact_info?: {
      name: string;
      email: string;
      phone: string;
    };
  };
  status: 'new' | 'contacted' | 'qualified' | 'closed' | 'rejected';
  created_at: string;
  updated_at: string;
  buyer_profile?: {
    full_name: string;
    email: string;
    phone: string;
  };
  listing?: {
    title: string;
    location: string;
    price: number;
    images: string[];
  };
}

export function useSellerLeads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<SellerLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchLeads();
  }, [user]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('seller_leads')
        .select(`
          *,
          buyer_profile:profiles!seller_leads_buyer_id_fkey (
            full_name,
            email,
            phone
          ),
          listing:seller_listings (
            title,
            location,
            price,
            images
          )
        `)
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setLeads(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, status: SellerLead['status']) => {
    try {
      const { data, error: updateError } = await supabase
        .from('seller_leads')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('seller_id', user?.id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      setLeads(prev => prev.map(lead => 
        lead.id === id ? data : lead
      ));
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update lead status');
    }
  };

  const getLeadsByType = (type: SellerLead['lead_type']) => {
    return leads.filter(lead => lead.lead_type === type);
  };

  const getLeadsByStatus = (status: SellerLead['status']) => {
    return leads.filter(lead => lead.status === status);
  };

  const getLeadStats = () => {
    const stats = {
      total: leads.length,
      inquiries: getLeadsByType('inquiry').length,
      viewings: getLeadsByType('viewing').length,
      offers: getLeadsByType('offer').length,
      applications: getLeadsByType('application').length,
      new: getLeadsByStatus('new').length,
      qualified: getLeadsByStatus('qualified').length,
      closed: getLeadsByStatus('closed').length,
    };
    return stats;
  };

  return {
    leads,
    loading,
    error,
    fetchLeads,
    updateLeadStatus,
    getLeadsByType,
    getLeadsByStatus,
    getLeadStats,
  };
}
