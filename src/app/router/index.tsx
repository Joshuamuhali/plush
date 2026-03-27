import { Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { protectedRoutes } from "./routes/protectedRoutes";
import { buyerRoutes } from "./routes/buyerRoutes";
import { sellerRoutes } from "./routes/sellerRoutes";
import { adminRoutes } from "./routes/adminRoutes";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map(({ path, component: Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}

      {/* Protected Routes */}
      {protectedRoutes.map(({ path, component: Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}

      {/* Buyer Routes */}
      {buyerRoutes.map(({ path, component: Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}

      {/* Seller Routes */}
      {sellerRoutes.map(({ path, component: Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}

      {/* Admin Routes */}
      {adminRoutes.map(({ path, component: Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  );
};
