import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function SellerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation userType="seller" />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
