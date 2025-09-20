import { Button } from "@/components/ui/button";
import { Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavigationProps {
  userType?: 'buyer' | 'seller';
}

export const Navigation = ({ userType = 'buyer' }: NavigationProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const buyerLinks = [
    { to: "/buy/land", label: "Land & Plots", active: isActive('/buy/land') },
    { to: "/buy/homes", label: "Homes", active: isActive('/buy/homes') },
  ];

  const sellerLinks = [
    { to: "/sell/dashboard", label: "Dashboard", active: isActive('/sell/dashboard') },
    { to: "/sell/list-property", label: "List Property", active: isActive('/sell/list-property') },
  ];

  const commonLinks = [
    { to: "/about", label: "About", active: isActive('/about') },
    { to: "/blog", label: "Blog", active: location.pathname.startsWith('/blog') },
    { to: "/contact", label: "Contact", active: isActive('/contact') },
  ];

  const navLinks = userType === 'buyer' 
    ? [...buyerLinks, ...commonLinks]
    : [...sellerLinks, ...commonLinks];

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
                    "transition-colors font-body text-sm px-3 py-2 rounded-md",
                    link.active 
                      ? "text-foreground font-medium" 
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="hidden lg:flex items-center text-sm text-foreground/70">
                <Phone className="w-4 h-4 mr-2" />
                <span>+260 971203578</span>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link to="/list-property">List Your Property</Link>
              </Button>
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
              className="md:hidden bg-background/95 backdrop-blur-sm overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navLinks.map((link) => (
                  <Link
                    key={`mobile-${link.to}`}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                      link.active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 pb-2 border-t border-border">
                  <div className="flex items-center text-sm text-foreground/70 px-3 py-2">
                    <div className="flex items-center space-x-1">
                      {userType === 'buyer' ? (
                        <Button size="sm" asChild>
                          <Link to="/sell/dashboard">Sell Property</Link>
                        </Button>
                      ) : (
                        <Button size="sm" asChild>
                          <Link to="/buy/properties">Browse Properties</Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/account">My Account</Link>
                      </Button>
                    </div>
                  </div>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 rounded-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to="/list-property">List Your Property</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Navigation;