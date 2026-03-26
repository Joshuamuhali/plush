import { supabase } from '@/lib/supabase';

export interface AppointmentFormData {
  property_id: string;
  lead_id?: string;
  appointment_date: string;
  time_start: string;
  time_end: string;
  seller_id: string;
}

export interface AppointmentUpdateData {
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  feedback?: string;
  rating?: number;
}

export class AppointmentService {
  // Admin: Create new appointment
  static async createAppointment(scheduledBy: string, appointmentData: AppointmentFormData): Promise<any> {
    const { data, error } = await supabase
      .from('viewing_appointments')
      .insert({
        ...appointmentData,
        scheduled_by: scheduledBy,
        status: 'scheduled',
      })
      .select(`
        *,
        properties (
          id,
          title,
          slug,
          address_line,
          location
        ),
        crm_leads (
          id,
          buyer_name,
          buyer_email,
          buyer_phone
        ),
        seller:profiles!viewing_appointments_seller_id_fkey (
          id,
          full_name,
          email,
          phone
        )
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Admin: Get all appointments
  static async getAllAppointments(filters?: {
    status?: string;
    seller_id?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<any[]> {
    let query = supabase
      .from('viewing_appointments')
      .select(`
        *,
        properties (
          id,
          title,
          slug,
          address_line,
          location
        ),
        crm_leads (
          id,
          buyer_name,
          buyer_email,
          buyer_phone
        ),
        seller:profiles!viewing_appointments_seller_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        scheduled_by_profile:profiles!viewing_appointments_scheduled_by_fkey (
          full_name
        )
      `)
      .order('appointment_date', { ascending: true })
      .order('time_start', { ascending: true });

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.seller_id) {
      query = query.eq('seller_id', filters.seller_id);
    }
    if (filters?.date_from) {
      query = query.gte('appointment_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('appointment_date', filters.date_to);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  // Seller: Get their appointments
  static async getSellerAppointments(sellerId: string, filters?: {
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<any[]> {
    let query = supabase
      .from('viewing_appointments')
      .select(`
        *,
        properties (
          id,
          title,
          slug,
          address_line,
          location
        )
      `)
      .eq('seller_id', sellerId)
      .order('appointment_date', { ascending: true })
      .order('time_start', { ascending: true });

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.date_from) {
      query = query.gte('appointment_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('appointment_date', filters.date_to);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  // Get appointment by ID
  static async getAppointmentById(appointmentId: string): Promise<any> {
    const { data, error } = await supabase
      .from('viewing_appointments')
      .select(`
        *,
        properties (
          id,
          title,
          slug,
          address_line,
          location
        ),
        crm_leads (
          id,
          buyer_name,
          buyer_email,
          buyer_phone
        ),
        seller:profiles!viewing_appointments_seller_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        scheduled_by_profile:profiles!viewing_appointments_scheduled_by_fkey (
          full_name
        )
      `)
      .eq('id', appointmentId)
      .single();

    if (error) throw error;
    return data;
  }

  // Update appointment
  static async updateAppointment(appointmentId: string, updateData: AppointmentUpdateData): Promise<any> {
    const { data, error } = await supabase
      .from('viewing_appointments')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Admin: Update appointment status
  static async updateAppointmentStatus(appointmentId: string, status: string): Promise<any> {
    const { data, error } = await supabase
      .from('viewing_appointments')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Cancel appointment
  static async cancelAppointment(appointmentId: string, reason?: string): Promise<any> {
    const { data, error } = await supabase
      .from('viewing_appointments')
      .update({
        status: 'cancelled',
        feedback: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Complete appointment with feedback
  static async completeAppointment(appointmentId: string, feedback?: string, rating?: number): Promise<any> {
    const { data, error } = await supabase
      .from('viewing_appointments')
      .update({
        status: 'completed',
        feedback,
        rating,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get upcoming appointments
  static async getUpcomingAppointments(sellerId?: string): Promise<any[]> {
    const today = new Date().toISOString().split('T')[0];
    
    let query = supabase
      .from('viewing_appointments')
      .select(`
        *,
        properties (
          id,
          title,
          slug,
          address_line,
          location
        ),
        crm_leads (
          id,
          buyer_name,
          buyer_email,
          buyer_phone
        )
      `)
      .gte('appointment_date', today)
      .in('status', ['scheduled', 'confirmed'])
      .order('appointment_date', { ascending: true })
      .order('time_start', { ascending: true });

    if (sellerId) {
      query = query.eq('seller_id', sellerId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  // Get appointment statistics
  static async getAppointmentStats(filters?: {
    seller_id?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<any> {
    let query = supabase
      .from('viewing_appointments')
      .select('status, appointment_date, seller_id, rating');

    // Apply filters
    if (filters?.seller_id) {
      query = query.eq('seller_id', filters.seller_id);
    }
    if (filters?.date_from) {
      query = query.gte('appointment_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('appointment_date', filters.date_to);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate statistics
    const stats = {
      total: data?.length || 0,
      by_status: {} as Record<string, number>,
      completed: 0,
      cancelled: 0,
      no_show: 0,
      average_rating: 0,
    };

    const ratings: number[] = [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    data?.forEach(appointment => {
      // Count by status
      stats.by_status[appointment.status] = (stats.by_status[appointment.status] || 0) + 1;

      // Count specific statuses
      if (appointment.status === 'completed') stats.completed++;
      if (appointment.status === 'cancelled') stats.cancelled++;
      if (appointment.status === 'no_show') stats.no_show++;

      // Collect ratings for average
      if (appointment.rating) {
        ratings.push(appointment.rating);
      }
    });

    // Calculate average rating
    if (ratings.length > 0) {
      stats.average_rating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    }

    return stats;
  }

  // Check for time conflicts
  static async checkTimeConflict(
    sellerId: string, 
    appointmentDate: string, 
    timeStart: string, 
    timeEnd: string,
    excludeAppointmentId?: string
  ): Promise<boolean> {
    let query = supabase
      .from('viewing_appointments')
      .select('id, time_start, time_end')
      .eq('seller_id', sellerId)
      .eq('appointment_date', appointmentDate)
      .in('status', ['scheduled', 'confirmed']);

    if (excludeAppointmentId) {
      query = query.neq('id', excludeAppointmentId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Check for overlapping appointments
    for (const appointment of data || []) {
      if (this.isTimeOverlap(timeStart, timeEnd, appointment.time_start, appointment.time_end)) {
        return true; // Conflict found
      }
    }

    return false; // No conflict
  }

  // Helper: Check if time ranges overlap
  private static isTimeOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const start1Min = toMinutes(start1);
    const end1Min = toMinutes(end1);
    const start2Min = toMinutes(start2);
    const end2Min = toMinutes(end2);

    return start1Min < end2Min && start2Min < end1Min;
  }
}
