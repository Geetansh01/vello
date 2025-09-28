import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import { useLocation } from 'react-router-dom';

// Loading component for pages
const PageLoader = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center justify-center py-20"
  >
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </motion.div>
);

export default function Layout() {
  const location = useLocation();
  
  // Don't show breadcrumbs on home page
  const showBreadcrumbs = location.pathname !== '/';
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pt-0 md:pt-16">
      <Navbar />
      {showBreadcrumbs && <Breadcrumbs />}
      <main className="flex-grow pb-20 md:pb-8 min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
