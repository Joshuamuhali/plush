import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { DashboardService } from '@/services/dashboardService';

export const useDashboard = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !profile || profileLoading) return;

      setLoading(true);
      setError(null);

      try {
        const role = profile.role;
        let dashboardData = {};

        switch (role) {
          case 'buyer':
          case 'seller':
            dashboardData = await DashboardService.getBuyerStats(user.id);
            break;
          case 'staff':
            dashboardData = await DashboardService.getPropertyAdminStats(user.id);
            break;
          case 'admin':
            dashboardData = await DashboardService.getSystemAdminStats();
            break;
          default:
            dashboardData = { error: 'Unknown role' };
        }

        // Add recent activity for all roles
        const recentActivity = await DashboardService.getRecentActivity(user.id, role);
        
        // Add system health for system admin
        let systemHealth = null;
        if (role === 'admin') {
          systemHealth = await DashboardService.getSystemHealth();
        }

        setData({
          ...dashboardData,
          recentActivity,
          systemHealth,
          role,
          userId: user.id
        });

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, profile, profileLoading]);

  const refreshData = async () => {
    if (!user || !profile) return;

    setLoading(true);
    setError(null);

    try {
      const role = profile.role;
      let dashboardData = {};

      switch (role) {
        case 'buyer':
        case 'seller':
          dashboardData = await DashboardService.getBuyerStats(user.id);
          break;
        case 'staff':
          dashboardData = await DashboardService.getPropertyAdminStats(user.id);
          break;
        case 'admin':
          dashboardData = await DashboardService.getSystemAdminStats();
          break;
        default:
          dashboardData = { error: 'Unknown role' };
      }

      const recentActivity = await DashboardService.getRecentActivity(user.id, role);
      let systemHealth = null;
      if (role === 'admin') {
        systemHealth = await DashboardService.getSystemHealth();
      }

      setData({
        ...dashboardData,
        recentActivity,
        systemHealth,
        role,
        userId: user.id
      });

    } catch (err) {
      console.error('Dashboard refresh error:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refreshData };
};
