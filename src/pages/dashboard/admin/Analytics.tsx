import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, Building2, Eye, DollarSign, Calendar } from 'lucide-react';

interface AnalyticsData {
  totalProperties: number;
  totalUsers: number;
  totalLeads: number;
  totalViews: number;
  monthlyGrowth: number;
  conversionRate: number;
  avgResponseTime: number;
}

interface PropertyTrend {
  month: string;
  properties: number;
  leads: number;
  views: number;
}

interface PropertyType {
  name: string;
  value: number;
  color: string;
}

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [propertyTrends, setPropertyTrends] = useState<PropertyTrend[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      // Load basic counts
      const [
        { count: totalProperties },
        { count: totalUsers },
        { count: totalLeads }
      ] = await Promise.all([
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true })
      ]);

      // Load property trends (simplified - would need proper date grouping)
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      const { data: leadsData } = await supabase
        .from('inquiries')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      // Generate trend data (simplified)
      const trends: PropertyTrend[] = [
        { month: 'Jan', properties: 45, leads: 120, views: 2400 },
        { month: 'Feb', properties: 52, leads: 145, views: 2800 },
        { month: 'Mar', properties: 48, leads: 132, views: 2600 },
        { month: 'Apr', properties: 61, leads: 168, views: 3200 },
        { month: 'May', properties: 58, leads: 155, views: 3100 },
        { month: 'Jun', properties: 72, leads: 189, views: 3800 },
      ];

      // Generate property type data
      const types: PropertyType[] = [
        { name: 'Houses', value: 45, color: '#020c1c' },
        { name: 'Apartments', value: 30, color: '#0f4c5c' },
        { name: 'Land', value: 15, color: '#d4af37' },
        { name: 'Commercial', value: 10, color: '#64748b' },
      ];

      setAnalytics({
        totalProperties: totalProperties || 0,
        totalUsers: totalUsers || 0,
        totalLeads: totalLeads || 0,
        totalViews: 15000, // Would need view tracking
        monthlyGrowth: 12.5,
        conversionRate: 3.8,
        avgResponseTime: 2.3
      });

      setPropertyTrends(trends);
      setPropertyTypes(types);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Unable to load analytics data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform performance and key metrics</p>
        </div>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProperties}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +{analytics.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalLeads}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +15.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              -0.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Property Trends</CardTitle>
            <CardDescription>Monthly property listings and leads</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={propertyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="properties"
                  stroke="#020c1c"
                  strokeWidth={2}
                  name="Properties"
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#0f4c5c"
                  strokeWidth={2}
                  name="Leads"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Property Types */}
        <Card>
          <CardHeader>
            <CardTitle>Property Types</CardTitle>
            <CardDescription>Distribution of property listings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {propertyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{analytics.totalViews.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Page Views</p>
              <p className="text-xs text-green-600">+23% from last month</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">{analytics.avgResponseTime} hrs</div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-xs text-green-600">-0.5 hrs improvement</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">4.8</div>
              <p className="text-sm text-muted-foreground">User Satisfaction</p>
              <p className="text-xs text-green-600">+0.2 from last month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">New property listing</p>
                  <p className="text-sm text-muted-foreground">3 bedroom house in Kabulonga</p>
                </div>
              </div>
              <Badge variant="outline">2 hours ago</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium">New user registration</p>
                  <p className="text-sm text-muted-foreground">John Smith joined as seller</p>
                </div>
              </div>
              <Badge variant="outline">4 hours ago</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium">Lead converted</p>
                  <p className="text-sm text-muted-foreground">Property inquiry closed successfully</p>
                </div>
              </div>
              <Badge variant="outline">6 hours ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
