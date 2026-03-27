import Home from "@/pages/public/Home";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import AdminSignup from "@/pages/auth/AdminSignup";
import Explore from "@/pages/public/Explore";
import About from "@/pages/public/About";
import Blog from "@/pages/public/Blog";
import BlogPost from "@/pages/public/BlogPost";
import ContactPage from "@/pages/public/ContactPage";

export const publicRoutes = [
  { path: "/", component: Home },
  { path: "/auth", component: Login },
  { path: "/signup", component: SignUp },
  { path: "/admin-signup", component: AdminSignup },
  { path: "/explore", component: Explore },
  { path: "/about", component: About },
  { path: "/blog", component: Blog },
  { path: "/blog/:slug", component: BlogPost },
  { path: "/contact", component: ContactPage },
];
