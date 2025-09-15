import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 3000,
    strictPort: true,
    open: true,
    // Handle SPA fallback for client-side routing
    historyApiFallback: true,
    // Configure CORS if needed
    cors: true,
    // Enable HMR
    hmr: {
      overlay: true,
    },
    // Proxy configuration for API requests if needed
    proxy: {
      // Example:
      // '/api': {
      //   target: 'http://your-api-server',
      //   changeOrigin: true,
      //   secure: false,
      //   rewrite: (path) => path.replace(/^\/api/, '')
      // }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
