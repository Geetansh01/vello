import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Toast from '../components/Toast';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const { signup } = useUser();
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.email || !form.password) return 'Please fill email and password.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Invalid email address.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ message: '', type: 'info' });

    const error = validate();
    if (error) {
      setToast({ message: error, type: 'error' });
      setLoading(false);
      return;
    }

    try {
      // Note: The signup API in your Postman collection only takes email and password.
      // Other fields (name, address, phone) will need an "update profile" endpoint later.
      await signup(form.email, form.password);
      setToast({ message: 'Signup successful! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/'), 1500); // Redirect to home on successful signup and login
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Signup failed. The user may already exist.';
      setToast({ message: errorMessage, type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Create a new account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Note: name, address, phone inputs are here for UI, but not sent in signup API call */}
          <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-md" />
          <input type="email" name="email" placeholder="Email Address" required value={form.email} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-md" />
          <input type="password" name="password" placeholder="Password" required value={form.password} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-md" />
          <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-md" />
          <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-md" />
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-500"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-teal-400 hover:text-teal-300">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}
