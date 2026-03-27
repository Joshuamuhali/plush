import { useState, useEffect } from 'react';
import {
  Building,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  ArrowUp,
  ArrowDown,
  Home,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  DollarSign,
  Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSellerListings } from '@/hooks/useSellerListings';
import { useSellerLeads } from '@/hooks/useSellerLeads';
import { useSellerKYC } from '@/hooks/useSellerKYC';
import { useAuth, useSignOut } from '@/hooks/useAuth';

// Modern Card Components
const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color, 
  trend 
}: {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: any;
  color: string;
  trend?: boolean;
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      {trend && change !== undefined && (
        <div className={`flex items-center text-sm font-medium ${
          changeType === 'increase' ? 'text-green-600' : 'text-red-600'
        }`}>
          {changeType === 'increase' ? (
            <ArrowUp className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 mr-1" />
          )}
          {change}%
        </div>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const QuickActionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  to, 
  primary = false 
}: {
  title: string;
  description: string;
  icon: any;
  color: string;
  to: string;
  primary?: boolean;
}) => (
  <Link to={to} className="block">
    <div className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
      primary 
        ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500 text-white' 
        : 'bg-white border-gray-100 hover:border-gray-200'
    }`}>
      <div className={`p-3 rounded-xl mb-4 ${
        primary ? 'bg-white/20' : color
      }`}>
        <Icon className={`h-6 w-6 ${primary ? 'text-white' : 'text-white'}`} />
      </div>
      <h3 className={`font-semibold mb-2 ${primary ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`text-sm ${primary ? 'text-blue-100' : 'text-gray-500'}`}>
        {description}
      </p>
    </div>
  </Link>
);

const ActivityItem = ({ 
  icon: Icon, 
  title, 
  description, 
  time, 
  color 
}: {
  icon: any;
  title: string;
  description: string;
  time: string;
  color: string;
}) => (
  <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
      <p className="text-xs text-gray-400 mt-1">{time}</p>
    </div>
  </div>
);

const ListingCard = ({ listing }: { listing: any }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
    <div className="aspect-video bg-gray-200 relative">
      <img
        src={listing.images[0] || '/placeholder-property.jpg'}
        alt={listing.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          listing.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {listing.status}
        </span>
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-semibold text-gray-900 mb-2">{listing.title}</h3>
      <p className="text-sm text-gray-500 mb-4">{listing.location}</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">${listing.price.toLocaleString()}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {listing.views}
            </span>
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {listing.saves}
            </span>
            <span className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {listing.inquiries}
            </span>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  </div>
);

export default function SellerDashboard({ children }: { children?: React.ReactNode }) {
  const { user } = useAuth();
  const { signOut } = useSignOut();
  const { listings, loading: listingsLoading } = useSellerListings();
  const { getLeadStats, loading: leadsLoading } = useSellerLeads();
  const { kycStatus, isKYCComplete } = useSellerKYC();
  const [leadStats, setLeadStats] = useState<any>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!leadsLoading) {
      setLeadStats(getLeadStats());
    }
  }, [leadsLoading, getLeadStats]);

  const activeListings = listings.filter(l => l.status === 'active').length;
  const totalViews = listings.reduce((acc, l) => acc + l.views, 0);
  const totalSaves = listings.reduce((acc, l) => acc + l.saves, 0);
  const recentListings = listings.slice(0, 3);

  // If children are provided, this is being used as a layout wrapper
  if (children) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900">Seller Portal</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col h-full">
            {/* User Profile */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                  <p className="text-sm text-gray-500">Seller Account</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2">
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium"
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/seller/listings"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium"
              >
                <Building className="h-5 w-5" />
                <span>My Listings</span>
              </Link>
              <Link
                to="/seller/listings/create"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium"
              >
                <Plus className="h-5 w-5" />
                <span>Add Listing</span>
              </Link>
              <Link
                to="/seller/leads/inquiries"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Inquiries</span>
              </Link>
              <Link
                to="/seller/documents/kyc"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium"
              >
                <User className="h-5 w-5" />
                <span>Verification</span>
              </Link>
              <Link
                to="/seller/settings"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>

            {/* Sign Out */}
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={signOut}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium w-full"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-72">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="flex items-center justify-between h-16 px-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          {children}
        </div>
      </div>
    );
  }

  // Original dashboard content when no children provided
  if (listingsLoading || leadsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">Seller Portal</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col h-full">
          {/* User Profile */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.email}</p>
                <p className="text-sm text-gray-500">Seller Account</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-medium"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/seller/listings"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium"
            >
              <Building className="h-5 w-5" />
              <span>My Listings</span>
            </Link>
            <Link
              to="/seller/listings/create"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>Add Listing</span>
            </Link>
            <Link
              to="/seller/leads/inquiries"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Inquiries</span>
            </Link>
            <Link
              to="/seller/documents/kyc"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium"
            >
              <User className="h-5 w-5" />
              <span>Verification</span>
            </Link>
            <Link
              to="/seller/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Sign Out */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={signOut}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-gray-600">Here's what's happening with your listings today.</p>
          </div>

          {/* KYC Alert */}
          {!isKYCComplete() && (
            <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 mb-1">Complete Your Verification</h3>
                  <p className="text-amber-700 mb-4">
                    Upload required documents to fully activate your seller account and unlock all features.
                  </p>
                  <Link
                    to="/seller/documents/kyc"
                    className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium"
                  >
                    Complete KYC
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Active Listings"
              value={activeListings}
              icon={Building}
              color="bg-blue-500"
              change={12}
              changeType="increase"
              trend
            />
            <MetricCard
              title="Total Inquiries"
              value={leadStats.inquiries || 0}
              icon={MessageSquare}
              color="bg-green-500"
              change={8}
              changeType="increase"
              trend
            />
            <MetricCard
              title="Total Views"
              value={totalViews.toLocaleString()}
              icon={Eye}
              color="bg-purple-500"
              change={15}
              changeType="increase"
              trend
            />
            <MetricCard
              title="Total Saves"
              value={totalSaves.toLocaleString()}
              icon={Heart}
              color="bg-pink-500"
              change={22}
              changeType="increase"
              trend
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QuickActionCard
                title="Add New Listing"
                description="Create a new property listing"
                icon={Plus}
                color="bg-blue-500"
                to="/seller/listings/create"
                primary
              />
              <QuickActionCard
                title="Manage Listings"
                description="View and edit your properties"
                icon={Building}
                color="bg-gray-500"
                to="/seller/listings"
              />
              <QuickActionCard
                title="View Inquiries"
                description="Respond to buyer messages"
                icon={MessageSquare}
                color="bg-green-500"
                to="/seller/leads/inquiries"
              />
            </div>
          </div>

          {/* Recent Activity & Listings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Listings */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Listings</h2>
                <Link
                  to="/seller/listings"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </Link>
              </div>
              {recentListings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">No listings yet</h3>
                  <p className="text-gray-500 mb-6">Get started by creating your first property listing</p>
                  <Link
                    to="/seller/listings/create"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Listing
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <Link
                  to="/seller/leads"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="space-y-4">
                  <ActivityItem
                    icon={MessageSquare}
                    title="New inquiry received"
                    description="John Doe is interested in your property"
                    time="2 hours ago"
                    color="bg-blue-500"
                  />
                  <ActivityItem
                    icon={Eye}
                    title="Property viewed"
                    description="Your listing got 15 new views today"
                    time="5 hours ago"
                    color="bg-purple-500"
                  />
                  <ActivityItem
                    icon={Heart}
                    title="Property saved"
                    description="3 users saved your property"
                    time="1 day ago"
                    color="bg-pink-500"
                  />
                  <ActivityItem
                    icon={CheckCircle}
                    title="Listing approved"
                    description="Your property listing is now live"
                    time="2 days ago"
                    color="bg-green-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
