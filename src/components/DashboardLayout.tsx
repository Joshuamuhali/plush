import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useSignOut } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Heart,
  MessageSquare,
  Settings,
  Building2,
  Calendar,
  Users,
  BarChart3,
  CheckCircle,
  Clock,
  LogOut,
  User,
  Bell,
  Search,
  Plus,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'buyer' | 'seller' | 'staff' | 'admin';
  avatar_url?: string;
  phone?: string;
  company_name?: string;
  verification_status?: string;
}

const DashboardLayout = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useAuth();
  const { signOut } = useSignOut();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      navigate('/login');
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) throw error;

      setProfile(data);
      // Route based on role
      if (location.pathname === '/dashboard') {
        navigate(`/dashboard/${data.role}/overview`);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Handle missing profile - could trigger profile creation flow
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Profile Not Found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find your profile. Please contact support or try signing up again.
            </p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getNavigationItems = () => {
    const baseItems = [
      { path: `/dashboard/${profile.role}/overview`, label: 'Overview', icon: Home },
      { path: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
      { path: '/dashboard/profile', label: 'Profile', icon: User },
    ];

    if (profile.role === 'buyer') {
      return [
        ...baseItems,
        { path: `/dashboard/${profile.role}/saved`, label: 'Saved Properties', icon: Heart },
        { path: `/dashboard/${profile.role}/inquiries`, label: 'My Inquiries', icon: Search },
      ];
    }

    if (profile.role === 'seller') {
      return [
        ...baseItems,
        { path: `/dashboard/${profile.role}/listings`, label: 'My Listings', icon: Building2 },
        { path: `/dashboard/${profile.role}/leads`, label: 'Lead Activity', icon: Users },
        { path: `/dashboard/${profile.role}/appointments`, label: 'Appointments', icon: Calendar },
      ];
    }

    if (profile.role === 'staff' || profile.role === 'admin') {
      return [
        ...baseItems,
        { path: `/dashboard/${profile.role}/review`, label: 'Review Queue', icon: CheckCircle },
        { path: `/dashboard/${profile.role}/leads`, label: 'Lead Pipeline', icon: Users },
        { path: `/dashboard/${profile.role}/appointments`, label: 'Appointments', icon: Calendar },
        { path: `/dashboard/${profile.role}/analytics`, label: 'Analytics', icon: BarChart3 },
        ...(profile.role === 'admin' ? [{ path: `/dashboard/${profile.role}/users`, label: 'User Management', icon: Settings }] : []),
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'tween' }}
        className="fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-lg lg:translate-x-0 lg:static lg:inset-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-primary">Plush</h1>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>
                  {profile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{profile.full_name}</p>
                <Badge variant="secondary" className="text-xs capitalize">
                  {profile.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <h2 className="ml-4 lg:ml-0 text-lg font-semibold text-gray-900 capitalize">
                  {profile.role} Dashboard
                </h2>
              </div>

              <div className="flex items-center space-x-4">
                {/* Quick actions */}
                {profile.role === 'seller' && (
                  <Button
                    size="sm"
                    onClick={() => navigate('/list-property')}
                    className="hidden sm:flex"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    List Property
                  </Button>
                )}

                {/* Notifications */}
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>

                {/* User menu */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback>
                      {profile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
