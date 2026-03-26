import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

// Buyer Dashboard Components
import BuyerOverview from '@/pages/dashboard/buyer/Overview';
import BuyerSavedProperties from '@/pages/dashboard/buyer/SavedProperties';
import BuyerInquiries from '@/pages/dashboard/buyer/Inquiries';

// Seller Dashboard Components
import SellerOverview from '@/pages/dashboard/seller/Overview';
import SellerListings from '@/pages/dashboard/seller/Listings';
import SellerLeads from '@/pages/dashboard/seller/Leads';
import SellerAppointments from '@/pages/dashboard/seller/Appointments';

// Admin Dashboard Components
import AdminOverview from '@/pages/dashboard/admin/Overview';
import AdminReviewQueue from '@/pages/dashboard/admin/ReviewQueue';
import AdminLeadPipeline from '@/pages/dashboard/admin/LeadPipeline';
import AdminAppointments from '@/pages/dashboard/admin/Appointments';
import AdminAnalytics from '@/pages/dashboard/admin/Analytics';
import AdminUsers from '@/pages/dashboard/admin/Users';

// Shared Components
import Messages from '@/pages/dashboard/Messages';
import Profile from '@/pages/dashboard/Profile';

interface UserProfile {
  id: string;
  role: 'buyer' | 'seller' | 'staff' | 'admin';
}

const DashboardRouter = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', user!.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      {/* Role-based dashboard routes */}
      {profile.role === 'buyer' && (
        <>
          <Route path="/dashboard/buyer/overview" element={<BuyerOverview />} />
          <Route path="/dashboard/buyer/saved" element={<BuyerSavedProperties />} />
          <Route path="/dashboard/buyer/inquiries" element={<BuyerInquiries />} />
          <Route path="/dashboard/buyer/*" element={<Navigate to="/dashboard/buyer/overview" replace />} />
        </>
      )}

      {profile.role === 'seller' && (
        <>
          <Route path="/dashboard/seller/overview" element={<SellerOverview />} />
          <Route path="/dashboard/seller/listings" element={<SellerListings />} />
          <Route path="/dashboard/seller/leads" element={<SellerLeads />} />
          <Route path="/dashboard/seller/appointments" element={<SellerAppointments />} />
          <Route path="/dashboard/seller/*" element={<Navigate to="/dashboard/seller/overview" replace />} />
        </>
      )}

      {(profile.role === 'staff' || profile.role === 'admin') && (
        <>
          <Route path="/dashboard/admin/overview" element={<AdminOverview />} />
          <Route path="/dashboard/admin/review" element={<AdminReviewQueue />} />
          <Route path="/dashboard/admin/leads" element={<AdminLeadPipeline />} />
          <Route path="/dashboard/admin/appointments" element={<AdminAppointments />} />
          <Route path="/dashboard/admin/analytics" element={<AdminAnalytics />} />
          {profile.role === 'admin' && (
            <Route path="/dashboard/admin/users" element={<AdminUsers />} />
          )}
          <Route path="/dashboard/admin/*" element={<Navigate to="/dashboard/admin/overview" replace />} />
        </>
      )}

      {/* Shared routes for all roles */}
      <Route path="/dashboard/messages" element={<Messages />} />
      <Route path="/dashboard/profile" element={<Profile />} />

      {/* Default redirect based on role */}
      <Route
        path="/dashboard"
        element={<Navigate to={`/dashboard/${profile.role}/overview`} replace />}
      />

      {/* Catch all - redirect to role-specific overview */}
      <Route
        path="/dashboard/*"
        element={<Navigate to={`/dashboard/${profile.role}/overview`} replace />}
      />
    </Routes>
  );
};

export default DashboardRouter;
