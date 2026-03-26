import { supabase } from '@/lib/supabase';

// Dashboard statistics service
export class DashboardService {
  
  // Buyer Dashboard Data
  static async getBuyerStats(userId: string) {
    try {
      const [
        savedProperties,
        scheduledTours,
        messages
      ] = await Promise.all([
        // Saved properties
        supabase
          .from('saved_properties')
          .select('id, property_id, created_at')
          .eq('user_id', userId),
        
        // Scheduled tours
        supabase
          .from('tours')
          .select('id, property_id, scheduled_date, status')
          .eq('user_id', userId)
          .eq('status', 'scheduled'),
        
        // Messages
        supabase
          .from('messages')
          .select('id, sender_id, receiver_id, created_at, read_at')
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      ]);

      return {
        savedProperties: savedProperties.data?.length || 0,
        scheduledTours: scheduledTours.data?.length || 0,
        messages: messages.data?.length || 0,
        savedPropertiesData: savedProperties.data || [],
        toursData: scheduledTours.data || [],
        messagesData: messages.data || []
      };
    } catch (error) {
      console.error('Error fetching buyer stats:', error);
      return {
        savedProperties: 0,
        scheduledTours: 0,
        messages: 0,
        savedPropertiesData: [],
        toursData: [],
        messagesData: []
      };
    }
  }

  // Property Admin Dashboard Data
  static async getPropertyAdminStats(userId: string) {
    try {
      const [
        totalProperties,
        pendingListings,
        toursToday,
        inquiries
      ] = await Promise.all([
        // Total properties managed by this admin
        supabase
          .from('properties')
          .select('id, title, status, created_at')
          .eq('admin_id', userId),
        
        // Pending listings
        supabase
          .from('properties')
          .select('id, title, created_at')
          .eq('admin_id', userId)
          .eq('status', 'pending'),
        
        // Tours scheduled for today
        supabase
          .from('tours')
          .select('id, property_id, user_id, scheduled_date')
          .eq('admin_id', userId)
          .eq('status', 'scheduled')
          .gte('scheduled_date', new Date().toISOString().split('T')[0])
          .lte('scheduled_date', new Date().toISOString().split('T')[0]),
        
        // Inquiries for properties managed by this admin
        supabase
          .from('inquiries')
          .select('id, property_id, user_id, message, created_at')
          .in('property_id', 
            supabase
              .from('properties')
              .select('id')
              .eq('admin_id', userId)
          )
      ]);

      return {
        totalProperties: totalProperties.data?.length || 0,
        pendingListings: pendingListings.data?.length || 0,
        toursToday: toursToday.data?.length || 0,
        inquiries: inquiries.data?.length || 0,
        propertiesData: totalProperties.data || [],
        pendingListingsData: pendingListings.data || [],
        toursData: toursToday.data || [],
        inquiriesData: inquiries.data || []
      };
    } catch (error) {
      console.error('Error fetching property admin stats:', error);
      return {
        totalProperties: 0,
        pendingListings: 0,
        toursToday: 0,
        inquiries: 0,
        propertiesData: [],
        pendingListingsData: [],
        toursData: [],
        inquiriesData: []
      };
    }
  }

  // System Admin Dashboard Data
  static async getSystemAdminStats() {
    try {
      const [
        totalUsers,
        totalProperties,
        totalAdmins,
        monthlyRevenue
      ] = await Promise.all([
        // Total users
        supabase
          .from('profiles')
          .select('id, role, created_at'),
        
        // Total properties
        supabase
          .from('properties')
          .select('id, status, created_at'),
        
        // Total admins (admin and staff roles)
        supabase
          .from('profiles')
          .select('id, role, full_name, created_at')
          .in('role', ['admin', 'staff']),
        
        // Monthly revenue (placeholder - implement based on your business model)
        supabase
          .from('payments')
          .select('amount, created_at')
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ]);

      const users = totalUsers.data || [];
      const properties = totalProperties.data || [];
      const admins = totalAdmins.data || [];
      const payments = monthlyRevenue.data || [];

      // Calculate monthly revenue
      const currentMonthRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

      return {
        totalUsers: users.length,
        totalProperties: properties.length,
        totalAdmins: admins.length,
        monthlyRevenue: currentMonthRevenue,
        usersData: users,
        propertiesData: properties,
        adminsData: admins,
        paymentsData: payments
      };
    } catch (error) {
      console.error('Error fetching system admin stats:', error);
      return {
        totalUsers: 0,
        totalProperties: 0,
        totalAdmins: 0,
        monthlyRevenue: 0,
        usersData: [],
        propertiesData: [],
        adminsData: [],
        paymentsData: []
      };
    }
  }

  // Recent activity for all roles
  static async getRecentActivity(userId: string, role: string) {
    try {
      let activities = [];

      if (role === 'buyer') {
        // Buyer activities
        const [savedProps, tours] = await Promise.all([
          supabase
            .from('saved_properties')
            .select('*, properties(title)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5),
          
          supabase
            .from('tours')
            .select('*, properties(title)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        activities = [
          ...savedProps.data?.map(item => ({
            type: 'saved_property',
            title: `Saved ${item.properties?.title || 'Property'}`,
            timestamp: item.created_at,
            icon: 'Home'
          })) || [],
          ...tours.data?.map(item => ({
            type: 'tour_scheduled',
            title: `Tour scheduled for ${item.properties?.title || 'Property'}`,
            timestamp: item.created_at,
            icon: 'Calendar'
          })) || []
        ];
      } else if (role === 'staff' || role === 'admin') {
        // Admin activities
        const [properties, inquiries] = await Promise.all([
          supabase
            .from('properties')
            .select('*')
            .eq('admin_id', userId)
            .order('created_at', { ascending: false })
            .limit(5),
          
          supabase
            .from('inquiries')
            .select('*, properties(title), profiles(full_name)')
            .in('property_id', 
              supabase
                .from('properties')
                .select('id')
                .eq('admin_id', userId)
            )
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        activities = [
          ...properties.data?.map(item => ({
            type: 'property_listed',
            title: `Listed ${item.title}`,
            timestamp: item.created_at,
            icon: 'Building'
          })) || [],
          ...inquiries.data?.map(item => ({
            type: 'inquiry_received',
            title: `Inquiry from ${item.profiles?.full_name || 'User'} for ${item.properties?.title || 'Property'}`,
            timestamp: item.created_at,
            icon: 'MessageSquare'
          })) || []
        ];
      }

      // Sort by timestamp and return latest 10
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  // System health for system admin
  static async getSystemHealth() {
    try {
      const [
        activeUsersToday,
        newUsersThisWeek,
        systemMetrics
      ] = await Promise.all([
        // Active users today
        supabase
          .from('user_sessions')
          .select('user_id')
          .gte('created_at', new Date().toISOString().split('T')[0]),
        
        // New users this week
        supabase
          .from('profiles')
          .select('id, created_at')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        
        // System metrics (placeholder - implement based on your monitoring)
        Promise.resolve({
          database: 'Healthy',
          api: 'Operational',
          storage: '78% Used'
        })
      ]);

      return {
        activeUsersToday: activeUsersToday.data?.length || 0,
        newUsersThisWeek: newUsersThisWeek.data?.length || 0,
        conversionRate: 12.4, // Placeholder - calculate based on your metrics
        systemMetrics
      };
    } catch (error) {
      console.error('Error fetching system health:', error);
      return {
        activeUsersToday: 0,
        newUsersThisWeek: 0,
        conversionRate: 0,
        systemMetrics: {
          database: 'Unknown',
          api: 'Unknown',
          storage: 'Unknown'
        }
      };
    }
  }
}
