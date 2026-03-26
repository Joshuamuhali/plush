import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Building, 
  Users, 
  Settings, 
  BarChart3,
  FileText,
  Calendar,
  MessageSquare,
  Shield,
  UserCheck,
  Search,
  Plus,
  Bell,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { ReactNode } from 'react';

interface AppLayoutProps {
  children?: ReactNode;
}

function Sidebar() {
  const { profile } = useProfile();
  const role = profile?.role || 'buyer';
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getNavigationItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', href: '/dashboard' },
      { icon: Search, label: 'Browse Properties', href: '/marketplace' },
      { icon: MessageSquare, label: 'Messages', href: '/messages' },
      { icon: Calendar, label: 'Tours', href: '/tours' },
    ];

    if (role === 'admin') {
      return [
        ...baseItems,
        { icon: Users, label: 'Users', href: '/dashboard/users' },
        { icon: Building, label: 'Properties', href: '/dashboard/properties' },
        { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
        { icon: Settings, label: 'System Settings', href: '/dashboard/settings' },
      ];
    }

    if (role === 'staff') {
      return [
        ...baseItems,
        { icon: Building, label: 'My Properties', href: '/dashboard/properties' },
        { icon: Plus, label: 'New Listing', href: '/list-property' },
        { icon: Calendar, label: 'Manage Tours', href: '/dashboard/tours' },
      ];
    }

    if (role === 'seller') {
      return [
        ...baseItems,
        { icon: Building, label: 'My Properties', href: '/dashboard/properties' },
        { icon: Plus, label: 'List Property', href: '/list-property' },
        { icon: MessageSquare, label: 'Inquiries', href: '/dashboard/inquiries' },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Home className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-gray-900">Plush</h2>
              <p className="text-xs text-gray-600">Property Platform</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <UserCheck className="h-4 w-4 text-gray-600" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.full_name || 'User'}
              </p>
              <Badge variant="secondary" className="text-xs">
                {role?.replace('_', ' ').toUpperCase() || 'GUEST'}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <div className="p-2 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full"
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

function TopNavbar() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const fullName = profile?.full_name || user?.email || 'User';
  const role = profile?.role || 'buyer';

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">
                Welcome back, <span className="font-medium">{fullName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{fullName}</p>
                <Badge variant="outline" className="text-xs">
                  {role.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-gray-600" />
              </div>
            </div>

            {/* Sign Out */}
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
