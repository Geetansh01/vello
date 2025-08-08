import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Load from env (recommended) or paste directly
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-client-id.apps.googleusercontent.com";

export default function App() {
  const location = useLocation();

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="product/:slug" element={<ProductDetails />} />
            <Route path="cart" element={<CartPage />} />
            
            {/* Protected Routes with Layout */}
            <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
          </Route>
          
          {/* Routes without the main layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
    </GoogleOAuthProvider>
  );
}
