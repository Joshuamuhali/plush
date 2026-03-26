import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home as HomeIcon, 
  Heart, 
  MessageCircle, 
  Calendar,
  FileText,
  Eye,
  TrendingUp,
  Clock,
  Search,
  Building,
  Star,
  ArrowUp,
  ArrowDown,
  Activity,
  MapPin,
  Users
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import GuidedPlaceholderCard from '@/components/GuidedPlaceholderCard';

interface DashboardStats {
  savedProperties: number;
  inquiries: number;
  viewingRequests: number;
  offers: number;
  recentViews: number;
}

interface RecentActivity {
  id: string;
  type: 'saved' | 'inquiry' | 'viewing' | 'offer';
  propertyTitle: string;
  timestamp: string;
  status?: string;
}

export default function BuyerDashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    savedProperties: 0,
    inquiries: 0,
    viewingRequests: 0,
    offers: 0,
    recentViews: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch saved properties count
        const { count: savedCount } = await supabase
          .from('saved_properties')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Fetch inquiries count
        const { count: inquiriesCount } = await supabase
          .from('inquiries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Fetch viewing requests count
        const { count: viewingCount } = await supabase
          .from('viewing_requests')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Fetch offers count
        const { count: offersCount } = await supabase
          .from('offers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Fetch recent activity (mock data for now)
        const mockActivity: RecentActivity[] = [
          {
            id: '1',
            type: 'saved',
            propertyTitle: 'Modern 3-Bedroom Apartment',
            timestamp: '2 hours ago',
          },
          {
            id: '2',
            type: 'inquiry',
            propertyTitle: 'Luxury Villa with Pool',
            timestamp: '5 hours ago',
            status: 'Pending',
          },
          {
            id: '3',
            type: 'viewing',
            propertyTitle: 'Cozy Downtown Studio',
            timestamp: '1 day ago',
            status: 'Scheduled',
          },
        ];

        setStats({
          savedProperties: savedCount || 0,
          inquiries: inquiriesCount || 0,
          viewingRequests: viewingCount || 0,
          offers: offersCount || 0,
          recentViews: 12, // Mock data
        });

        setRecentActivity(mockActivity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.user_metadata?.full_name || user?.email || 'User'}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your property search today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saved Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.savedProperties}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">12%</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inquiries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inquiries}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">8%</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Viewing Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.viewingRequests}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-red-500">3%</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Offers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.offers}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">15%</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        activity.type === 'saved' ? 'bg-red-500' :
                        activity.type === 'inquiry' ? 'bg-blue-500' :
                        activity.type === 'viewing' ? 'bg-purple-500' :
                        'bg-green-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{activity.propertyTitle}</p>
                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {activity.status && (
                        <Badge variant="outline" className="text-xs">
                          {activity.status}
                        </Badge>
                      )}
                      <Link to={`/property/${activity.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <GuidedPlaceholderCard
                icon={<Activity className="h-8 w-8 text-gray-400" />}
                title="No recent activity"
                description="Start exploring properties to see your activity here."
                actionText="Browse Properties"
                actionLink="/explore"
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/explore">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Properties
                </Button>
              </Link>
              <Link to="/saved">
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Saved Properties
                </Button>
              </Link>
              <Link to="/inquiries">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  My Inquiries
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
