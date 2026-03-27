import { Outlet, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Home,
  Building,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  User,
  TrendingUp,
  FileCheck,
  Upload,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth, useSignOut } from '@/hooks/useAuth';

interface SidebarItem {
  label: string;
  href: string;
  icon: any;
  badge?: number;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export default function SellerLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const { signOut } = useSignOut();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarSections: SidebarSection[] = [
    {
      title: 'Dashboard',
      items: [
        { label: 'Overview', href: '/dashboard', icon: Home },
        { label: 'Analytics', href: '/seller/analytics', icon: TrendingUp },
      ]
    },
    {
      title: 'Property Management',
      items: [
        { label: 'My Listings', href: '/seller/listings', icon: Building },
        { label: 'Add Listing', href: '/seller/listings/create', icon: Upload },
      ]
    },
    {
      title: 'Lead Management',
      items: [
        { label: 'Inquiries', href: '/seller/leads/inquiries', icon: MessageSquare },
        { label: 'Viewing Requests', href: '/seller/leads/viewings', icon: Calendar },
        { label: 'Offers', href: '/seller/leads/offers', icon: FileText },
        { label: 'Applications', href: '/seller/leads/applications', icon: FileCheck },
      ]
    },
    {
      title: 'Verification',
      items: [
        { label: 'KYC Status', href: '/seller/documents/kyc', icon: User },
        { label: 'Documents', href: '/seller/documents', icon: Upload },
      ]
    },
    {
      title: 'Account',
      items: [
        { label: 'Profile', href: '/seller/profile', icon: User },
        { label: 'Settings', href: '/seller/settings', icon: Settings },
      ]
    }
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Seller Portal</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {sidebarSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="mt-2 space-y-1">
                {section.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    to={item.href}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive(item.href)
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500">Seller Account</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Seller Portal</h1>
            <div className="h-6 w-6" />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
