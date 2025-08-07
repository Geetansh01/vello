import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, updateUser, updatePassword } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
    // Add toast notification here
  };
  
  // Dummy image URL
  const profileImageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <h1 className="text-4xl font-extrabold mb-8">My Profile</h1>
      
      {/* Profile Display & Edit Form */}
      <div className="bg-gray-800 rounded-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="relative">
            <img src={profileImageUrl} alt="Profile" className="w-32 h-32 rounded-full mb-4 ring-4 ring-teal-500" />
            <button className="absolute bottom-2 right-2 bg-gray-700 rounded-full p-2 hover:bg-teal-600">
              {/* Pencil Icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg>
            </button>
          </div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-400">{user.email}</p>
        </div>
        
        <div className="md:col-span-2">
          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Full Name</label>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Address</label>
                <p className="text-lg">{user.address}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Phone</label>
                <p className="text-lg">{user.phone}</p>
              </div>
              <button onClick={() => setIsEditing(true)} className="mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg">Edit Profile</button>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-300">Address</label>
                <input type="text" name="address" id="address" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone</label>
                <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">Save Changes</button>
                <button type="button" onClick={() => { setIsEditing(false); setFormData({...user}); }} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Security & Account Deletion */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Update Password */}
        <div className="bg-gray-800 rounded-lg p-8">
          <h3 className="text-xl font-bold mb-4">Update Password</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Current Password</label>
              <input type="password" name="currentPassword" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">New Password</label>
              <input type="password" name="newPassword" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm" />
            </div>
            <button type="submit" className="mt-2 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg">Update Password</button>
          </form>
        </div>

        {/* Delete Account */}
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-8">
          <h3 className="text-xl font-bold mb-2 text-red-300">Delete Account</h3>
          <p className="text-red-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Delete My Account</button>
        </div>
      </div>
    </motion.div>
  );
}
