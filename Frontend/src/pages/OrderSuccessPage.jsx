import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
// Download a success animation from LottieFiles and place it in your assets
// import successAnimation from '../assets/success.json';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  // If someone lands here directly without an order, redirect them home.
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        {/* <Lottie animationData={successAnimation} loop={false} className="w-80 h-80" /> */}
        <div className="w-80 h-80 bg-green-500 rounded-full flex items-center justify-center mb-8">
            <svg className="w-40 h-40 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-4xl font-extrabold mb-3">Order Placed Successfully!</h1>
        <p className="text-gray-400 text-lg mb-2">Thank you for your purchase.</p>
        <p className="text-gray-300 font-semibold mb-8">Your Order ID is: <span className="text-teal-400">{orderId}</span></p>
        <div className="space-x-4">
          <Link
            to="/orders"
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
