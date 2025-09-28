import { Routes, Route, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectUser } from './store/slices/userSlice';
import { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCart } from './store/slices/cartSlice';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductsPage from './pages/ProductsPage';
import GenericInfoPage from './pages/GenericInfoPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';
import HowToOrderPage from './pages/HowToOrderPage';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Loading component
const PageLoader = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center justify-center min-h-screen"
  >
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </motion.div>
);

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  // Initialize cart when user is available
  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes location={location} key={location.pathname}>
        {/* Public Routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="generic-info" element={<GenericInfoPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="how-to-order" element={<HowToOrderPage />} />
          <Route path="product/:slug" element={<ProductDetails />} />
          <Route path="cart" element={<CartPage />} />
          
          {/* Protected Routes with Layout */}
          <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
        </Route>
        
        {/* Routes without the main layout */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
        <Route path="/forgot-password" element={user ? <Navigate to="/" replace /> : <ForgotPasswordPage />} />
        <Route path="/reset-password" element={user ? <Navigate to="/" replace /> : <ResetPasswordPage />} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
}
