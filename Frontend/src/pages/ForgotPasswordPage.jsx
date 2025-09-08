import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import Toast from '../components/Toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const { forgotPassword } = useUser();
  const navigate = useNavigate(); // <-- Add the useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ message: '', type: 'info' });

    try {
      const response = await forgotPassword(email);
      setToast({ message: response.message || 'OTP sent successfully! Redirecting...', type: 'success' });
      
      // --- This is the new part ---
      // On success, redirect to the reset password page after a short delay
      setTimeout(() => {
        navigate('/reset-password');
      }, 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'An error occurred. Please try again.';
      setToast({ message: errorMessage, type: 'error' });
      setLoading(false); // Only keep loading false on error, success will navigate away
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
            <Link to="/" className="text-white font-bold text-5xl">
              Vello<span className="text-teal-400">.</span>
            </Link>
            <h2 className="mt-6 text-center text-2xl font-extrabold text-white">Forgot Your Password?</h2>
            <p className="text-gray-400 mt-2">No problem. Enter your email address below and we'll send you an OTP to reset it.</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-500"
              >
                {loading ? 'Sending...' : 'Send Reset OTP'}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Remembered your password?{' '}
          <Link to="/login" className="font-medium text-teal-400 hover:text-teal-300">
            Back to Login
          </Link>
        </p>
      </motion.div>
      <Toast message={toast.message} type={toast.type} duration={5000} />
    </div>
  );
}
