import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Building2, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/755d89ab-8280-465b-a6db-142550068be1.png" 
              alt="Plush Properties Logo" 
              className="h-10 object-contain"
            />
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <motion.main 
        className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 text-gray-900"
          variants={itemVariants}
        >
          Welcome to Plush Properties
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 mb-12 max-w-2xl"
          variants={itemVariants}
        >
          Your trusted partner in real estate. Whether you're looking to buy, sell, or develop properties, we've got you covered.
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
          variants={itemVariants}
        >
          {/* Buyer Section */}
          <motion.div 
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            whileHover={{ y: -5 }}
            onClick={() => navigate('/buy/properties')}
          >
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
              <Home className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Buyers</h2>
            <p className="text-gray-600 mb-6">Find your dream property from our extensive listings of homes, land, and commercial properties.</p>
            <Button className="w-full group">
              Browse Properties
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Seller Section */}
          <motion.div 
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            whileHover={{ y: -5 }}
            onClick={() => navigate('/sell/dashboard')}
          >
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Sellers</h2>
            <p className="text-gray-600 mb-6">List your property with us and connect with serious buyers. Get the best value for your property.</p>
            <Button variant="outline" className="w-full group">
              List Your Property
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.main>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Plush Properties. All rights reserved.</p>
          <p className="mt-2 text-gray-400">Designed By Joshua Muhali</p>
        </div>
      </footer>
    </div>
  );
}
