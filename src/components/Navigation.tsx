import { Button } from "@/components/ui/button";
import { Phone, Menu, X, User, LogOut, Home, Building, Users, Shield, FileText, Calendar, BarChart3, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth, useSignOut } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

interface NavLink {
  to: string;
  label: string;
  active: boolean;
  icon?: LucideIcon;
}

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { signOut } = useSignOut();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch user role from profiles table
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          setUserRole(profile?.role || null);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

  // Public navigation links (no property access for unauthenticated users)
  const publicNavLinks: NavLink[] = [
    { to: "/", label: "Home", active: isActive('/') },
    { to: "/about", label: "About", active: isActive('/about') },
    { to: "/blog", label: "Blog", active: location.pathname.startsWith('/blog') },
    { to: "/contact", label: "Contact", active: isActive('/contact') },
  ];

  // Role-based navigation links
  const getRoleBasedNavLinks = (): NavLink[] => {
    if (!userRole) return [];

    const baseLinks: NavLink[] = [
      { to: "/dashboard", label: "Dashboard", icon: Home, active: location.pathname.startsWith('/dashboard') },
    ];

    // Add marketplace for buyers and sellers
    if (['buyer', 'seller'].includes(userRole)) {
      baseLinks.push({ 
        to: "/explore", 
        label: "Browse Properties", 
        icon: Building, 
        active: isActive('/explore')
      });
    }

    if (userRole === 'admin') {
      return [
        ...baseLinks,
        { to: "/admin", label: "Admin Panel", icon: Shield, active: location.pathname.startsWith('/admin') },
        { to: "/admin/users", label: "Users", icon: Users, active: isActive('/admin/users') },
        { to: "/admin/analytics", label: "Analytics", icon: BarChart3, active: isActive('/admin/analytics') },
      ];
    }

    if (userRole === 'seller') {
      return [
        ...baseLinks,
        { to: "/dashboard/listings", label: "My Listings", icon: Building, active: isActive('/dashboard/listings') },
        { to: "/dashboard/leads", label: "Leads", icon: Users, active: isActive('/dashboard/leads') },
        { to: "/dashboard/appointments", label: "Appointments", icon: Calendar, active: isActive('/dashboard/appointments') },
        { to: "/list-property", label: "List Property", icon: FileText, active: isActive('/list-property') },
      ];
    }

    if (userRole === 'buyer') {
      return [
        ...baseLinks,
        { to: "/dashboard/saved", label: "Saved Properties", icon: Home, active: isActive('/dashboard/saved') },
        { to: "/dashboard/inquiries", label: "My Inquiries", icon: FileText, active: isActive('/dashboard/inquiries') },
      ];
    }

    return baseLinks;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
    setUserRole(null);
  };

  const navLinks: NavLink[] = user ? getRoleBasedNavLinks() : publicNavLinks;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-background/95 backdrop-blur-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <img
                  src="/lovable-uploads/755d89ab-8280-465b-a6db-142550068be1.png"
                  alt="Plush Properties"
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "transition-colors font-body text-sm px-3 py-2 rounded-md flex items-center gap-2",
                    link.active
                      ? "text-foreground font-medium"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="hidden lg:flex items-center text-sm text-foreground/70">
                <Phone className="w-4 h-4 mr-2" />
                <span>+260 971203578</span>
              </div>

              {loading ? (
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
              ) : user ? (
                <div className="flex items-center space-x-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    <Link to="/list-property">List Property</Link>
                  </Button>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                      <User className="h-5 w-5" />
                    </Button>
                    {mobileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="inline h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full"
                  >
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-foreground/70 hover:text-foreground"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-background/95 backdrop-blur-sm overflow-hidden border-t"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navLinks.map((link) => (
                  <Link
                    key={`mobile-${link.to}`}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-2",
                      link.active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {link.icon && <link.icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                ))}

                <div className="pt-4 pb-2 border-t border-border">
                  {loading ? (
                    <div className="px-3 py-2">
                      <div className="w-full h-8 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  ) : user ? (
                    <div className="space-y-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full rounded-full"
                      >
                        <Link to="/list-property" onClick={() => setMobileMenuOpen(false)}>
                          List Property
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="w-full"
                      >
                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-left justify-start"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        asChild
                        size="sm"
                        className="w-full rounded-full"
                      >
                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                    </div>
                  )}
                  {/* Admin signup link - subtle and at bottom */}
                  {!user && (
                    <div className="pt-4 border-t border-gray-200">
                      <Link
                        to="/admin-signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xs text-gray-500 hover:text-gray-700 text-center block"
                      >
                        Admin Registration
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
