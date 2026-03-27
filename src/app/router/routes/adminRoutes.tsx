import ProtectedRoute from "@/guards/ProtectedRoute";
import RoleRoute from "@/guards/RoleRoute";
import AdminLayout from "@/layouts/AdminLayout";
import AdminProperties from "@/pages/admin/AdminProperties";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import SystemAdmin from "@/pages/admin/SystemAdmin";

// Wrap admin routes with role protection
const ProtectedAdminLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <RoleRoute requiredRole="admin">
      <AdminLayout>{children}</AdminLayout>
    </RoleRoute>
  </ProtectedRoute>
);

// System admin routes require system admin role
const ProtectedSystemAdminLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <RoleRoute requiredRole="system_admin">
      <AdminLayout>{children}</AdminLayout>
    </RoleRoute>
  </ProtectedRoute>
);

const AdminPropertiesPage = () => (
  <ProtectedAdminLayout>
    <AdminProperties />
  </ProtectedAdminLayout>
);

const AdminUsersPage = () => (
  <ProtectedAdminLayout>
    <AdminUsers />
  </ProtectedAdminLayout>
);

const AdminAnalyticsPage = () => (
  <ProtectedAdminLayout>
    <AdminAnalytics />
  </ProtectedAdminLayout>
);

const SystemAdminPage = () => (
  <ProtectedSystemAdminLayout>
    <SystemAdmin />
  </ProtectedSystemAdminLayout>
);

export const adminRoutes = [
  { path: "/admin/properties", component: AdminPropertiesPage },
  { path: "/admin/users", component: AdminUsersPage },
  { path: "/admin/analytics", component: AdminAnalyticsPage },
  { path: "/admin/system", component: SystemAdminPage },
];
