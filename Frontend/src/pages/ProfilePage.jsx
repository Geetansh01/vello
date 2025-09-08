import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';

export default function ProfilePage() {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    // Re-fetch user data in case it's stale, or if not loaded initially
    const fetchProfile = async () => {
      try {
        const response = await api.get('/me/');
        setFormData(response.data);
      } catch (error) {
        console.error("Failed to fetch profile data.", error);
      }
      setLoading(false);
    };

    if (!user) {
        fetchProfile();
    } else {
        setFormData(user);
        setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // This will call the updateUser function in UserContext
    // which you can implement with a PUT/PATCH request to '/me/'
    updateUser(formData); 
    setIsEditing(false);
  };
  
  if (loading) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  // The GET /me/ endpoint returns `name` with the email part. We display it as is.
  const profileImageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${formData?.name || 'User'}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <h1 className="text-4xl font-extrabold mb-8">My Profile</h1>
      
      <div className="bg-gray-800 rounded-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="relative">
            <img src={profileImageUrl} alt="Profile" className="w-32 h-32 rounded-full mb-4 ring-4 ring-teal-500" />
            <button className="absolute bottom-2 right-2 bg-gray-700 rounded-full p-2 hover:bg-teal-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg>
            </button>
          </div>
          <h2 className="text-2xl font-bold">{formData.name}</h2>
          <p className="text-gray-400">UUID: {formData.user_uuid}</p>
        </div>
        
        <div className="md:col-span-2">
          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Full Name / Username</label>
                <p className="text-lg">{formData.name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Address</label>
                <p className="text-lg">{formData.address || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Phone</label>
                <p className="text-lg">{formData.phone || 'Not set'}</p>
              </div>
              <button onClick={() => setIsEditing(true)} className="mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg">Edit Profile</button>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-300">Address</label>
                <input type="text" name="address" id="address" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone</label>
                <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm" />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">Save Changes</button>
                <button type="button" onClick={() => { setIsEditing(false); setFormData({...user}); }} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}
