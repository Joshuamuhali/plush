import ProtectedRoute from "@/guards/ProtectedRoute";
import DashboardPage from "@/pages/shared/Dashboard";
import PropertyDetail from "@/pages/shared/PropertyDetail";
import Messages from "@/pages/shared/Messages";
import Tours from "@/pages/shared/Tours";
import SearchResults from "@/pages/shared/SearchResults";
import Listings from "@/pages/shared/Listings";

// Wrap components with ProtectedRoute for authenticated shared routes
const ProtectedDashboard = () => (
  <ProtectedRoute><DashboardPage /></ProtectedRoute>
);

const ProtectedPropertyDetail = () => (
  <ProtectedRoute><PropertyDetail /></ProtectedRoute>
);

const ProtectedMessages = () => (
  <ProtectedRoute><Messages /></ProtectedRoute>
);

const ProtectedTours = () => (
  <ProtectedRoute><Tours /></ProtectedRoute>
);

const ProtectedSearchResults = () => (
  <ProtectedRoute><SearchResults /></ProtectedRoute>
);

const ProtectedListings = () => (
  <ProtectedRoute><Listings /></ProtectedRoute>
);

export const protectedRoutes = [
  { path: "/dashboard", component: ProtectedDashboard },
  { path: "/property/:id", component: ProtectedPropertyDetail },
  { path: "/messages", component: ProtectedMessages },
  { path: "/tours", component: ProtectedTours },
  { path: "/search", component: ProtectedSearchResults },
  { path: "/listings", component: ProtectedListings },
];
