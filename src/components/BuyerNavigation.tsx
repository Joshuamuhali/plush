import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Heart, 
  MessageCircle, 
  User, 
  Home, 
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function BuyerNavigation() {
  const { user } = useAuth();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigation = [
    { name: 'Explore', href: '/explore', icon: Search },
    { name: 'Saved', href: '/saved', icon: Heart },
    { name: 'Inbox', href: '/inbox', icon: MessageCircle },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleSignOut = async () => {
    try {
      const { signOut } = await import('@/hooks/useAuth');
      await signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/explore" className="flex items-center">
                  <img
                    src="/logo.svg"
                    alt="Plush Properties"
                    className="h-8 w-auto mr-3"
                  />
                  <span className="text-xl font-bold text-gray-900">Plush</span>
                </Link>
              </div>

              {/* Main Navigation */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive(item.href)
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>

              {/* User Menu */}
              <div className="relative">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:block text-sm font-medium text-gray-700">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b border-gray-200 fixed bottom-0 left-0 right-0 z-50">
        <div className="grid grid-cols-4 gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center py-2 px-3 text-xs ${
                  isActive(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/explore" className="flex items-center">
              <img
                src="/logo.svg"
                alt="Plush Properties"
                className="h-8 w-auto mr-3"
              />
              <span className="text-xl font-bold text-gray-900">Plush</span>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`w-full h-0.5 bg-gray-600 transition-all ${showMobileMenu ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-full h-0.5 bg-gray-600 transition-all ${showMobileMenu ? 'opacity-0' : ''}`}></div>
                <div className={`w-full h-0.5 bg-gray-600 transition-all ${showMobileMenu ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-gray-200 bg-white"
          >
            <div className="px-4 sm:px-6 py-4 space-y-3">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>

              <Link
                to="/profile"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50"
                onClick={() => setShowMobileMenu(false)}
              >
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Settings</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 w-full text-left"
              >
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-red-700">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Add padding for mobile navigation */}
      <div className="md:hidden h-16"></div>
      <div className="md:hidden h-16"></div>
    </>
  );
}
