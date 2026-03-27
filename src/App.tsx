import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';

// New Router System
import { AppRouter } from "@/app/router";

// Legacy Redirects
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import AdminSignup from "@/pages/auth/AdminSignup";
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
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Legacy Redirects */}
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/marketplace" element={<Navigate to="/explore" replace />} />
            <Route path="/viewings" element={<Navigate to="/offers" replace />} />
            <Route path="/buyer/*" element={<Navigate to="/dashboard" replace />} />
            
            {/* Public Routes that need to be preserved temporarily */}
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/explore" element={<Explore />} />
            
            {/* Main Router */}
            <Route path="/*" element={<AppRouter />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
