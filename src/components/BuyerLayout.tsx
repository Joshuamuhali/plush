import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Heart, 
  MessageCircle, 
  Calendar, 
  Eye,
  FileText, 
  Home as HomeIcon, 
  User, 
  Settings, 
  BarChart3,
  Clock,
  Mail,
  FileCheck,
  CreditCard,
  Shield,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth, useSignOut } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGAttributes<SVGSVGElement>>;
  badge?: string;
}

export default function BuyerLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const { signOut } = useSignOut();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarSections: SidebarSection[] = [
    {
      title: 'Discover',
      items: [
        { label: 'Explore Properties', href: '/explore', icon: Search },
        { label: 'Saved Properties', href: '/saved', icon: Heart },
        { label: 'Recent Views', href: '/explore', icon: Eye },
      ]
    },
    {
      title: 'Activity',
      items: [
        { label: 'Inquiries', href: '/inquiries', icon: MessageCircle },
        { label: 'Viewing Requests', href: '/viewings', icon: Calendar },
        { label: 'Offers Made', href: '/offers', icon: FileText },
        { label: 'Applications', href: '/applications', icon: FileCheck },
      ]
    },
    {
      title: 'Account',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { label: 'Messages', href: '/messages', icon: MessageCircle },
        { label: 'Profile', href: '/profile', icon: User },
        { label: 'Settings', href: '/settings', icon: Settings },
      ]
    }
  ];

  const isActive = (href: string) => {
    if (href === '/explore') {
      return location.pathname.startsWith('/explore');
    }
    return location.pathname === href;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src="/logo.svg"
            alt="Plush Properties"
            className="h-8 w-auto"
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">Buyer Portal</h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {sidebarSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive(item.href)
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start text-gray-600 hover:text-red-600"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl"
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/buyer/explore">
              <img
                src="/logo.svg"
                alt="Plush Properties"
                className="h-6 w-auto"
              />
            </Link>
            <div className="w-9"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
