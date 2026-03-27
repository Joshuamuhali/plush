import ProtectedRoute from "@/guards/ProtectedRoute";
import RoleRoute from "@/guards/RoleRoute";
import BuyerLayout from "@/layouts/BuyerLayout";
import SavedProperties from "@/pages/buyer/SavedProperties";
import Inquiries from "@/pages/buyer/Inquiries";
import Offers from "@/pages/buyer/Offers";
import Applications from "@/pages/buyer/Applications";
import Profile from "@/pages/buyer/Profile";
import Settings from "@/pages/buyer/Settings";

// Wrap buyer routes with role protection
const ProtectedBuyerLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <RoleRoute requiredRole="buyer">
      <BuyerLayout>{children}</BuyerLayout>
    </RoleRoute>
  </ProtectedRoute>
);

const BuyerSaved = () => (
  <ProtectedBuyerLayout>
    <SavedProperties />
  </ProtectedBuyerLayout>
);

const BuyerInquiriesPage = () => (
  <ProtectedBuyerLayout>
    <Inquiries />
  </ProtectedBuyerLayout>
);

const BuyerOffersPage = () => (
  <ProtectedBuyerLayout>
    <Offers />
  </ProtectedBuyerLayout>
);

const BuyerApplicationsPage = () => (
  <ProtectedBuyerLayout>
    <Applications />
  </ProtectedBuyerLayout>
);

const BuyerProfilePage = () => (
  <ProtectedBuyerLayout>
    <Profile />
  </ProtectedBuyerLayout>
);

const BuyerSettingsPage = () => (
  <ProtectedBuyerLayout>
    <Settings />
  </ProtectedBuyerLayout>
);

export const buyerRoutes = [
  { path: "/saved", component: BuyerSaved },
  { path: "/inquiries", component: BuyerInquiriesPage },
  { path: "/offers", component: BuyerOffersPage },
  { path: "/applications", component: BuyerApplicationsPage },
  { path: "/profile", component: BuyerProfilePage },
  { path: "/settings", component: BuyerSettingsPage },
];
