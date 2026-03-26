import { supabase } from '@/lib/supabase';

export interface LeadFormData {
  property_id?: string;
  buyer_name: string;
  buyer_email?: string;
  buyer_phone?: string;
  inquiry_message?: string;
  source?: 'property_form' | 'contact_form' | 'whatsapp' | 'phone' | 'walk_in' | 'agent' | 'other';
  preferred_viewing_date?: string;
  preferred_viewing_time?: string;
}

export interface LeadUpdateData {
  stage?: 'new' | 'contacted' | 'qualified' | 'viewing_scheduled' | 'negotiation' | 'won' | 'lost';
  assigned_to?: string;
  last_contacted_at?: string;
  next_followup_at?: string;
  lost_reason?: string;
  won_amount?: number;
}

export class LeadService {
  // Public: Create new lead (from property inquiry)
  static async createLead(leadData: LeadFormData): Promise<any> {
    const { data, error } = await supabase
      .from('crm_leads')
      .insert({
        ...leadData,
        stage: 'new',
        source: leadData.source || 'property_form',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Admin: Get all leads
  static async getAllLeads(filters?: {
    stage?: string;
    assigned_to?: string;
    property_id?: string;
  }): Promise<any[]> {
    let query = supabase
      .from('crm_leads')
      .select(`
        *,
        properties (
          id,
          title,
          slug
        ),
        assigned_to_profile:profiles!crm_leads_assigned_to_fkey (
          id,
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.stage) {
      query = query.eq('stage', filters.stage);
    }
    if (filters?.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to);
    }
    if (filters?.property_id) {
      query = query.eq('property_id', filters.property_id);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  // Admin: Get lead by ID
  static async getLeadById(leadId: string): Promise<any> {
    const { data, error } = await supabase
      .from('crm_leads')
      .select(`
        *,
        properties (
          id,
          title,
          slug,
          seller_id
        ),
        assigned_to_profile:profiles!crm_leads_assigned_to_fkey (
          id,
          full_name,
          email
        ),
        crm_notes (
          id,
          body,
          author_id,
          created_at,
          profiles:crm_notes_author_id_fkey (
            full_name
          )
        ),
        crm_lead_events (
          id,
          event_type,
          payload,
          created_at,
          profiles:crm_lead_events_actor_id_fkey (
            full_name
          )
        )
      `)
      .eq('id', leadId)
      .single();

    if (error) throw error;
    return data;
  }

  // Admin: Update lead
  static async updateLead(leadId: string, updateData: LeadUpdateData): Promise<any> {
    const { data, error } = await supabase
      .from('crm_leads')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Admin: Add note to lead
  static async addLeadNote(leadId: string, authorId: string, body: string): Promise<any> {
    const { data, error } = await supabase
      .from('crm_notes')
      .insert({
        lead_id: leadId,
        author_id: authorId,
        body,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Admin: Log lead event
  static async logLeadEvent(leadId: string, actorId: string, eventType: string, payload?: any): Promise<any> {
    const { data, error } = await supabase
      .from('crm_lead_events')
      .insert({
        lead_id: leadId,
        actor_id: actorId,
        event_type: eventType,
        payload,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Seller: Get lead references for their properties (no PII)
  static async getSellerLeadRefs(sellerId: string, propertyId?: string): Promise<any[]> {
    let query = supabase
      .from('seller_lead_refs')
      .select(`
        *,
        properties (
          id,
          title,
          slug
        )
      `)
      .order('created_at', { ascending: false });

    // Filter by seller's properties
    if (propertyId) {
      query = query.eq('property_id', propertyId);
    } else {
      // Get all lead refs for seller's properties
      const { data: sellerProperties } = await supabase
        .from('properties')
        .select('id')
        .eq('seller_id', sellerId);

      if (sellerProperties) {
        const propertyIds = sellerProperties.map(p => p.id);
        query = query.in('property_id', propertyIds);
      }
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  // Get lead statistics
  static async getLeadStats(filters?: {
    assigned_to?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<any> {
    let query = supabase
      .from('crm_leads')
      .select('stage, created_at, assigned_to');

    // Apply filters
    if (filters?.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to);
    }
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate statistics
    const stats = {
      total: data?.length || 0,
      by_stage: {} as Record<string, number>,
      new_this_month: 0,
      qualified: 0,
      won: 0,
      lost: 0,
    };

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    data?.forEach(lead => {
      // Count by stage
      stats.by_stage[lead.stage] = (stats.by_stage[lead.stage] || 0) + 1;

      // Count new leads this month
      const leadDate = new Date(lead.created_at);
      if (leadDate.getMonth() === currentMonth && leadDate.getFullYear() === currentYear) {
        stats.new_this_month++;
      }

      // Count specific stages
      if (lead.stage === 'qualified') stats.qualified++;
      if (lead.stage === 'won') stats.won++;
      if (lead.stage === 'lost') stats.lost++;
    });

    return stats;
  }
}
