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

export default function BuyerDashboard() {
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
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

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
        .eq('buyer_id', user.id);

      // Fetch viewing requests count (assuming there's a table for this)
      const { count: viewingCount } = await supabase
        .from('viewing_requests')
        .select('*', { count: 'exact', head: true })
        .eq('buyer_id', user.id);

      // Fetch offers count (assuming there's a table for this)
      const { count: offersCount } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .eq('buyer_id', user.id);

      // Fetch recent activity
      const { data: recentData } = await supabase
        .from('recent_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(10);

      setStats({
        savedProperties: savedCount || 0,
        inquiries: inquiriesCount || 0,
        viewingRequests: viewingCount || 0,
        offers: offersCount || 0,
        recentViews: recentData?.length || 0,
      });

      setRecentActivity(recentData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    changeType,
    link 
  }: {
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    change?: number;
    changeType?: 'increase' | 'decrease';
    link?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            {change && (
              <div className={`flex items-center text-sm ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {changeType === 'increase' ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                {change}%
              </div>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className="text-sm text-gray-600">{title}</p>
          </div>
          {link && (
            <Link to={link}>
              <Button variant="ghost" size="sm" className="mt-4">
                View Details
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
    const getIcon = (type: string) => {
      switch (type) {
        case 'saved':
          return Heart;
        case 'inquiry':
          return MessageCircle;
        case 'viewing':
          return Calendar;
        case 'offer':
          return FileText;
        default:
          return Activity;
      }
    };

    const Icon = getIcon(activity.type);
    const getColor = (type: string) => {
      switch (type) {
        case 'saved':
          return 'bg-red-100 text-red-600';
        case 'inquiry':
          return 'bg-blue-100 text-blue-600';
        case 'viewing':
          return 'bg-green-100 text-green-600';
        case 'offer':
          return 'bg-purple-100 text-purple-600';
        default:
          return 'bg-gray-100 text-gray-600';
      }
    };

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getColor(activity.type)}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {activity.propertyTitle}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(activity.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
        {activity.status && (
          <Badge variant="outline">{activity.status}</Badge>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buyer Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your property activity overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.savedProperties > 0 || stats.inquiries > 0 || stats.viewingRequests > 0 || stats.offers > 0 || stats.recentViews > 0 ? (
          <>
            <StatCard
              title="Saved Properties"
              value={stats.savedProperties}
              icon={Heart}
              change={12}
              changeType="increase"
              link="/saved"
            />
            <StatCard
              title="Inquiries"
              value={stats.inquiries}
              icon={MessageCircle}
              change={8}
              changeType="increase"
              link="/inquiries"
            />
            <StatCard
              title="Viewing Requests"
              value={stats.viewingRequests}
              icon={Calendar}
              change={5}
              changeType="increase"
              link="/viewings"
            />
            <StatCard
              title="Offers Made"
              value={stats.offers}
              icon={FileText}
              change={3}
              changeType="decrease"
              link="/offers"
            />
            <StatCard
              title="Recent Views"
              value={stats.recentViews}
              icon={Eye}
              change={15}
              changeType="increase"
            />
          </>
        ) : (
          <div className="col-span-full">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <HomeIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome. Let's get you started</h2>
                </div>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Link to="/explore">
                    <Button className="w-full h-16 flex flex-col items-center justify-center">
                      <Search className="w-6 h-6 mb-2" />
                      <span>Explore Properties</span>
                    </Button>
                  </Link>
                  <Link to="/saved">
                    <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                      <Heart className="w-6 h-6 mb-2" />
                      <span>View Saved</span>
                    </Button>
                  </Link>
                  <Link to="/messages">
                    <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                      <MessageCircle className="w-6 h-6 mb-2" />
                      <span>Check Messages</span>
                    </Button>
                  </Link>
                </div>
                
                {/* Stats Structure (always show) */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Your Activity Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <p className="text-2xl font-bold text-blue-600">0</p>
                      <p className="text-sm text-gray-600">Inquiries</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <p className="text-2xl font-bold text-green-600">0</p>
                      <p className="text-sm text-gray-600">Offers</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <p className="text-2xl font-bold text-purple-600">0</p>
                      <p className="text-sm text-gray-600">Applications</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <p className="text-2xl font-bold text-orange-600">0</p>
                      <p className="text-sm text-gray-600">Viewings</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </span>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))
                ) : (
                  <GuidedPlaceholderCard
                    icon={Activity}
                    title="No recent activity"
                    subtitle="Your journey starts here"
                    description="As you explore, save, and interact with properties, your activity will appear here"
                    actionLabel="Start Exploring"
                    actionLink="/explore"
                    variant="process"
                    steps={[
                      "Browse properties that interest you",
                      "Save your favorites for later",
                      "Make inquiries to connect with sellers",
                      "Schedule viewings to see properties in person"
                    ]}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/explore">
                <Button className="w-full justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  Explore Properties
                </Button>
              </Link>
              <Link to="/saved">
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  View Saved
                </Button>
              </Link>
              <Link to="/inquiries">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  My Inquiries
                </Button>
              </Link>
              <Link to="/viewings">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Viewing
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
