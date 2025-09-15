import { Button } from "@/components/ui/button";
import { Search, Home, Building2, Building } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-properties.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      // If search is empty, navigate to all listings
      navigate('/search');
    }
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-16">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Badge */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-block px-6 py-2 rounded-full bg-background/90 text-primary mb-8 backdrop-blur-sm"
          >
            <span className="text-sm font-medium font-body">LET US GUIDE YOUR HOME</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-4 leading-tight"
          >
            Believe in finding it
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg text-foreground/80 mb-12 font-body"
          >
            Search properties for sale and to rent in Lusaka
          </motion.p>

          {/* Search Bar */}
          <motion.form 
            onSubmit={handleSearch}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative flex items-center bg-background/95 backdrop-blur-sm rounded-full shadow-elegant p-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, property type, or keyword..."
                className="flex-1 px-6 py-4 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground font-body"
              />
              <Button 
                type="submit"
                size="lg" 
                className="rounded-full px-8 bg-primary hover:bg-primary/90"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </motion.form>

          {/* Property Type Quick Actions */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <div className="text-sm text-foreground/70 mb-4 w-full font-body">What are you looking for?</div>
            <Button variant="outline" size="sm" className="rounded-full bg-background/80 backdrop-blur-sm border-background/40 hover:bg-background/90">
              <Building className="w-4 h-4 mr-2" />
              Modern Villa
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-background/80 backdrop-blur-sm border-background/40 hover:bg-background/90">
              <Building2 className="w-4 h-4 mr-2" />
              Apartment
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-background/80 backdrop-blur-sm border-background/40 hover:bg-background/90">
              <Home className="w-4 h-4 mr-2" />
              Town House
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;