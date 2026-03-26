import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';

// New Unified Pages
import Home from "@/pages/Home";
import Marketplace from "@/pages/Marketplace";
import PropertyDetail from "@/pages/PropertyDetail";
import ListProperty from "@/pages/ListProperty";
import DashboardPage from "@/pages/DashboardPage";
import Explore from "@/pages/Explore";
import AdminPanel from "@/pages/admin/AdminPanel";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import SystemAdmin from "@/pages/admin/SystemAdmin";
import Dashboard from "@/pages/Dashboard";
import AppLayout from "@/components/AppLayout";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardRouter from "@/components/DashboardRouter";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import AdminSignup from "@/pages/auth/AdminSignup";

// Buyer Pages
import BuyerLayout from "@/components/BuyerLayout";
import BuyerExplore from "@/pages/buyer/Explore";
import BuyerSavedProperties from "@/pages/buyer/SavedProperties";
import BuyerInquiries from "@/pages/buyer/Inquiries";
import BuyerOffers from "@/pages/buyer/Offers";
import BuyerApplications from "@/pages/buyer/Applications";
import BuyerProfile from "@/pages/buyer/Profile";
import BuyerSettings from "@/pages/buyer/Settings";

// New Pages for missing routes
import Messages from "@/pages/Messages";
import Tours from "@/pages/Tours";

// Shared Pages (existing)
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/NotFound";
import SplashScreen from "@/components/SplashScreen";

// Components
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthGate from "@/components/AuthGate";

const queryClient = new QueryClient();

// Wrapper component for buyer routes
const BuyerRoutesWrapper: React.FC = () => (
  <div className="buyer-routes-container">
    <BuyerLayout />
  </div>
);

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
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Auth Gate - Always check auth first */}
            <Route path="/*" element={<AuthGate />} />
            
            {/* Single Dashboard Route - Protected */}
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} 
            />
            
            {/* Auth Routes */}
            <Route path="/auth" element={<Login />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin-signup" element={<AdminSignup />} />

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/marketplace" element={<Navigate to="/explore" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected Routes */}
            <Route 
              path="/property/:id" 
              element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} 
            />
            <Route 
              path="/list-property" 
              element={<ProtectedRoute><ListProperty /></ProtectedRoute>} 
            />
            <Route 
              path="/messages" 
              element={<ProtectedRoute><Messages /></ProtectedRoute>} 
            />
            <Route 
              path="/tours" 
              element={<ProtectedRoute><Tours /></ProtectedRoute>} 
            />

            {/* Canonical Buyer Routes */}
            <Route 
              path="/saved" 
              element={<ProtectedRoute><BuyerSavedProperties /></ProtectedRoute>} 
            />
            <Route 
              path="/inquiries" 
              element={<ProtectedRoute><BuyerInquiries /></ProtectedRoute>} 
            />
            <Route 
              path="/viewings" 
              element={<ProtectedRoute><BuyerOffers /></ProtectedRoute>} 
            />
            <Route 
              path="/offers" 
              element={<ProtectedRoute><BuyerOffers /></ProtectedRoute>} 
            />
            <Route 
              path="/applications" 
              element={<ProtectedRoute><BuyerApplications /></ProtectedRoute>} 
            />
            <Route 
              path="/profile" 
              element={<ProtectedRoute><BuyerProfile /></ProtectedRoute>} 
            />
            <Route 
              path="/settings" 
              element={<ProtectedRoute><BuyerSettings /></ProtectedRoute>} 
            />

            {/* Buyer Legacy Routes - Redirects to Canonical Routes */}
            <Route path="/buyer/dashboard" element={<Navigate to="/dashboard" replace />} />
            <Route path="/buyer/explore" element={<Navigate to="/explore" replace />} />
            <Route path="/buyer/saved" element={<Navigate to="/saved" replace />} />
            <Route path="/buyer/inquiries" element={<Navigate to="/inquiries" replace />} />
            <Route path="/buyer/viewings" element={<Navigate to="/viewings" replace />} />
            <Route path="/buyer/offers" element={<Navigate to="/offers" replace />} />
            <Route path="/buyer/applications" element={<Navigate to="/applications" replace />} />
            <Route path="/buyer/messages" element={<Navigate to="/messages" replace />} />
            <Route path="/buyer/property/:id" element={<Navigate to="/property/:id" replace />} />

            {/* Buyer Routes */}
            <Route
              path="/buyer/*"
              element={
                <ProtectedRoute>
                  <BuyerRoutesWrapper />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="explore" element={<BuyerExplore />} />
              <Route path="saved" element={<BuyerSavedProperties />} />
              <Route path="inquiries" element={<BuyerInquiries />} />
              <Route path="offers" element={<BuyerOffers />} />
              <Route path="applications" element={<BuyerApplications />} />
              <Route path="property/:id" element={<PropertyDetail />} />
              <Route path="" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
