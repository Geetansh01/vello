import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import Toast from '../components/Toast';

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({ email: '', otp: '', new_password: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const { resetPassword } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }
    
    setLoading(true);
    setToast({ message: '', type: 'info' });

    try {
      const response = await resetPassword(formData.email, formData.otp, formData.new_password);
      setToast({ message: response.message || 'Password has been reset successfully! Redirecting to login...', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to reset password. Please check your details and try again.';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
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
            <h2 className="mt-6 text-center text-2xl font-extrabold text-white">Reset Your Password</h2>
            <p className="text-gray-400 mt-2">Enter your email, the OTP you received, and your new password.</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                <input id="email" type="email" name="email" placeholder="Your Email Address" required value={formData.email} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:ring-teal-500 focus:border-teal-500" />
            </div>
             <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300">OTP Code</label>
                <input id="otp" type="text" name="otp" placeholder="OTP from Email" required value={formData.otp} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
                <label htmlFor="new_password" className="block text-sm font-medium text-gray-300">New Password</label>
                <input id="new_password" type="password" name="new_password" placeholder="New Password" required value={formData.new_password} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:ring-teal-500 focus:border-teal-500" />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-500"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
      <Toast message={toast.message} type={toast.type} duration={5000} />
    </div>
  );
}
