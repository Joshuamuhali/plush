import ProtectedRoute from "@/guards/ProtectedRoute";
import RoleRoute from "@/guards/RoleRoute";
import SellerLayout from "@/layouts/SellerLayout";
import ManageListings from "@/pages/seller/Listings/ManageListings";
import CreateListing from "@/pages/seller/Listings/CreateListing";
import SellerInquiries from "@/pages/seller/Leads/Inquiries";
import KYCPage from "@/pages/seller/Documents/KYCPage";
import SellerSettings from "@/pages/seller/Settings";

// Wrap seller routes with role protection
const ProtectedSellerLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <RoleRoute requiredRole="seller">
      <SellerLayout>{children}</SellerLayout>
    </RoleRoute>
  </ProtectedRoute>
);

const SellerManageListingsPage = () => (
  <ProtectedSellerLayout>
    <ManageListings />
  </ProtectedSellerLayout>
);

const SellerCreateListingPage = () => (
  <ProtectedSellerLayout>
    <CreateListing />
  </ProtectedSellerLayout>
);

const SellerInquiriesPage = () => (
  <ProtectedSellerLayout>
    <SellerInquiries />
  </ProtectedSellerLayout>
);

const SellerKYCPage = () => (
  <ProtectedSellerLayout>
    <KYCPage />
  </ProtectedSellerLayout>
);

const SellerSettingsPage = () => (
  <ProtectedSellerLayout>
    <SellerSettings />
  </ProtectedSellerLayout>
);

export const sellerRoutes = [
  { path: "/seller/listings", component: SellerManageListingsPage },
  { path: "/seller/listings/create", component: SellerCreateListingPage },
  { path: "/seller/leads/inquiries", component: SellerInquiriesPage },
  { path: "/seller/documents/kyc", component: SellerKYCPage },
  { path: "/seller/settings", component: SellerSettingsPage },
];
