import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/755d89ab-8280-465b-a6db-142550068be1.png" 
              alt="Plush Properties" 
              className="h-8 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={cn(
                "transition-colors font-body text-sm",
                isActive('/') 
                  ? "text-foreground font-medium" 
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              Home
            </Link>
            <Link 
              to="/listings" 
              className={cn(
                "transition-colors font-body text-sm",
                isActive('/listings') 
                  ? "text-foreground font-medium" 
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              Listings
            </Link>
            <Link 
              to="/about" 
              className={cn(
                "transition-colors font-body text-sm",
                isActive('/about')
                  ? "text-foreground font-medium" 
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              About
            </Link>
            <Link 
              to="/blog" 
              className={cn(
                "transition-colors font-body text-sm",
                location.pathname.startsWith('/blog')
                  ? "text-foreground font-medium" 
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              className={cn(
                "transition-colors font-body text-sm",
                isActive('/contact') 
                  ? "text-foreground font-medium" 
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              Contact
            </Link>
          </div>

          {/* Contact Info & CTA */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center text-sm text-foreground/70">
              <Phone className="w-4 h-4 mr-2" />
              <span>+260 971203578</span>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/list-property">
                Add Property
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;