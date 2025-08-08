import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import Toast from '../components/Toast'
import { GoogleLogin } from '@react-oauth/google'


export default function Signup() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', address: '', phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'info' })
  const { signup } = useUser()
  const navigate = useNavigate()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.address || !form.phone)
      return 'Please fill all fields.'
    if (!/\S+@\S+\.\S+/.test(form.email))
      return 'Invalid email address.'
    if (form.password.length < 6)
      return 'Password must be at least 6 characters.'
    if (!/^\d{10,}$/.test(form.phone))
      return 'Phone must be at least 10 digits.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setToast({ message: '', type: 'info' })
    const error = validate()
    if (error) {
      setToast({ message: error, type: 'error' })
      setLoading(false)
      return
    }
    try {
      await signup(form)
      setToast({ message: 'Signup successful!', type: 'success' })
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setToast({ message: 'Signup failed.', type: 'error' })
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-green-100 to-blue-200">
      <Toast message={toast.message} type={toast.type} />
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md animate-fade-in"
        style={{ animation: toast.type === 'success' ? 'success-bounce 0.7s' : 'fade-in 0.7s' }}
      >
        <h2 className="text-2xl font-bold mb-6 text-green-700">Sign Up</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            name="name"
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-green-400"
            value={form.name}
            onChange={handleChange}
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            name="email"
            type="email"
            className="w-full px-3 py-2 border rounded focus:outline-green-400"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            name="password"
            type="password"
            className="w-full px-3 py-2 border rounded focus:outline-green-400"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Address</label>
          <input
            name="address"
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-green-400"
            value={form.address}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Phone</label>
          <input
            name="phone"
            type="tel"
            className="w-full px-3 py-2 border rounded focus:outline-green-400"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <div className="mt-6 text-center">
          <span>Already have an account? </span>
          <Link to="/login" className="text-green-600 hover:underline">Login</Link>
        </div>
      </form>
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95);}
            to { opacity: 1; transform: scale(1);}
          }
          @keyframes success-bounce {
            0% { transform: scale(1);}
            30% { transform: scale(1.1);}
            60% { transform: scale(0.95);}
            100% { transform: scale(1);}
          }
        `}
      </style>
    </div>
  )
}
