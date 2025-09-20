import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';

// Layouts
import BuyerLayout from "@/layouts/BuyerLayout";
import SellerLayout from "@/layouts/SellerLayout";

// Entry Point
import LandingPage from "@/pages/LandingPage";

// Buyer Pages
import PropertiesPage from "@/pages/buy/PropertiesPage";
import LandPage from "@/pages/buy/LandPage";
import HomesPage from "@/pages/buy/HomesPage";
import CommercialPage from "@/pages/buy/CommercialPage";
import PropertyDetail from "@/pages/buy/PropertyDetail";

// Seller Pages
import SellerDashboard from "@/pages/seller/Dashboard";
import ListProperty from "@/pages/seller/ListProperty";
import MyListings from "@/pages/seller/MyListings";
import Leads from "@/pages/seller/Leads";

// Shared Pages
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/NotFound";
import SplashScreen from "@/components/SplashScreen";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if splash screen has been shown before
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      localStorage.setItem('hasSeenSplash', 'true');
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (!isMounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatePresence>
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        </AnimatePresence>
        
        <Router>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Buyer Routes */}
            <Route element={<BuyerLayout />}>
              <Route path="/buy/properties" element={<PropertiesPage />} />
              <Route path="/buy/land" element={<LandPage />} />
              <Route path="/buy/homes" element={<HomesPage />} />
              <Route path="/buy/commercial" element={<CommercialPage />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
            </Route>

            {/* Seller Routes */}
            <Route element={<SellerLayout />}>
              <Route path="/sell/dashboard" element={<SellerDashboard />} />
              <Route path="/sell/list-property" element={<ListProperty />} />
              <Route path="/sell/my-listings" element={<MyListings />} />
              <Route path="/sell/leads" element={<Leads />} />
            </Route>

            {/* Shared Routes */}
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Redirects */}
            <Route path="/list-property" element={<Navigate to="/sell/list-property" replace />} />
            <Route path="/buy-land" element={<Navigate to="/buy/land" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
