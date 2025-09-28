import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useAddresses } from '../contexts/AddressContext';
import { motion } from 'framer-motion';
import Toast from '../components/Toast';
import { detectUserLocation } from '../utils/locationUtils';

export default function ProfilePage() {
  const { user, profile, updateProfile, fetchProfile, getActiveTime } = useUser();
  const { addresses, createAddress, updateAddress, deleteAddress } = useAddresses();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [formData, setFormData] = useState({});
  const [addressForm, setAddressForm] = useState({
    recievers_name: '',
    recievers_phone: '',
    address_type: 'Home',
    address_line: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false
  });
  const [loading, setLoading] = useState(true);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [activeTime, setActiveTime] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    const loadProfileData = async () => {
      if (user) {
        try {
          if (!profile) {
            await fetchProfile();
          }
          const timeData = await getActiveTime();
          setActiveTime(timeData.active_time);
        } catch (error) {
          console.log('Profile or active time not available');
        }
      }
      setLoading(false);
    };
    
    loadProfileData();
  }, [user, profile, fetchProfile, getActiveTime]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        address: profile.address || '',
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile(formData);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
    } catch (error) {
      setToast({ message: 'Failed to update profile. Please try again.', type: 'error' });
    }
  };

  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    try {
      const locationData = await detectUserLocation();
      setAddressForm(prev => ({
        ...prev,
        address_line: locationData.address_line,
        city: locationData.city,
        state: locationData.state,
        pincode: locationData.pincode
      }));
      setToast({ message: 'Location detected successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to detect location. Please enter manually.', type: 'error' });
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await createAddress(addressForm);
      setToast({ message: 'Address added successfully!', type: 'success' });
      setIsAddingAddress(false);
      setAddressForm({
        recievers_name: '',
        recievers_phone: '',
        address_type: 'Home',
        address_line: '',
        city: '',
        state: '',
        pincode: '',
        is_default: false
      });
    } catch (error) {
      setToast({ message: 'Failed to add address. Please try again.', type: 'error' });
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId);
        setToast({ message: 'Address deleted successfully!', type: 'success' });
      } catch (error) {
        setToast({ message: 'Failed to delete address.', type: 'error' });
      }
    }
  };
  
  if (loading) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  // Generate profile image from user's name
  const profileImageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.name || user?.email || 'User'}`;
  
  return (
    <>
      <Toast message={toast.message} type={toast.type} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8 max-w-4xl"
      >
        <h1 className="text-4xl font-extrabold mb-8">My Profile</h1>
        
        {/* Profile Section */}
        <div className="bg-gray-800 rounded-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative">
              <img src={profileImageUrl} alt="Profile" className="w-32 h-32 rounded-full mb-4 ring-4 ring-teal-500" />
              <button className="absolute bottom-2 right-2 bg-gray-700 rounded-full p-2 hover:bg-teal-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg>
              </button>
            </div>
            <h2 className="text-2xl font-bold">{profile?.name || 'Not set'}</h2>
            <p className="text-gray-400">{user?.email}</p>
            {activeTime && (
              <p className="text-sm text-teal-400">Active time: {activeTime.hours}h {activeTime.minutes}m</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Full Name / Username</label>
                  <p className="text-lg">{profile?.name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Address</label>
                  <p className="text-lg">{profile?.address || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Phone</label>
                  <p className="text-lg">{profile?.phone || 'Not set'}</p>
                </div>
                <button onClick={() => setIsEditing(true)} className="mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg">Edit Profile</button>
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                  <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white" />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-300">Address</label>
                  <input type="text" name="address" id="address" value={formData.address || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone</label>
                  <input type="text" name="phone" id="phone" value={formData.phone || ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white" />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">Save Changes</button>
                  <button type="button" onClick={() => { setIsEditing(false); setFormData({...profile}); }} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Addresses</h2>
            <button 
              onClick={() => setIsAddingAddress(true)}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Add New Address
            </button>
          </div>

          {/* Add Address Form */}
          {isAddingAddress && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gray-700 rounded-lg p-6 mb-6"
            >
              <h3 className="text-xl font-bold mb-4">Add New Address</h3>
              <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Receiver's Name</label>
                  <input 
                    type="text" 
                    name="recievers_name" 
                    value={addressForm.recievers_name} 
                    onChange={handleAddressInputChange}
                    className="mt-1 block w-full bg-gray-600 border-gray-500 rounded-md py-2 px-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Phone Number</label>
                  <input 
                    type="tel" 
                    name="recievers_phone" 
                    value={addressForm.recievers_phone} 
                    onChange={handleAddressInputChange}
                    className="mt-1 block w-full bg-gray-600 border-gray-500 rounded-md py-2 px-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Address Type</label>
                  <select 
                    name="address_type" 
                    value={addressForm.address_type} 
                    onChange={handleAddressInputChange}
                    className="mt-1 block w-full bg-gray-600 border-gray-500 rounded-md py-2 px-3 text-white"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Pincode</label>
                  <input 
                    type="text" 
                    name="pincode" 
                    value={addressForm.pincode} 
                    onChange={handleAddressInputChange}
                    className="mt-1 block w-full bg-gray-600 border-gray-500 rounded-md py-2 px-3 text-white"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-300">Address Line</label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={detectingLocation}
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-500"
                    >
                      {detectingLocation ? 'Detecting...' : 'Detect Location'}
                    </button>
                  </div>
                  <input 
                    type="text" 
                    name="address_line" 
                    value={addressForm.address_line} 
                    onChange={handleAddressInputChange}
                    className="mt-1 block w-full bg-gray-600 border-gray-500 rounded-md py-2 px-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={addressForm.city} 
                    onChange={handleAddressInputChange}
                    className="mt-1 block w-full bg-gray-600 border-gray-500 rounded-md py-2 px-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">State</label>
                  <input 
                    type="text" 
                    name="state" 
                    value={addressForm.state} 
                    onChange={handleAddressInputChange}
                    className="mt-1 block w-full bg-gray-600 border-gray-500 rounded-md py-2 px-3 text-white"
                    required
                  />
                </div>
                <div className="md:col-span-2 flex items-center">
                  <input 
                    type="checkbox" 
                    name="is_default" 
                    checked={addressForm.is_default} 
                    onChange={handleAddressInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-300">Set as default address</label>
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
                    Save Address
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsAddingAddress(false)}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Address List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map(address => (
              <div key={address.id} className="bg-gray-700 rounded-lg p-4 relative">
                {address.is_default && (
                  <span className="absolute top-2 right-2 bg-teal-500 text-white text-xs px-2 py-1 rounded">
                    Default
                  </span>
                )}
                <div className="mb-2">
                  <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">
                    {address.address_type}
                  </span>
                </div>
                <h4 className="font-bold text-lg">{address.recievers_name}</h4>
                <p className="text-gray-300">{address.address_line}</p>
                <p className="text-gray-300">{address.city}, {address.state} - {address.pincode}</p>
                <p className="text-gray-400 text-sm">Phone: {address.recievers_phone}</p>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {addresses.length === 0 && !isAddingAddress && (
            <div className="text-center py-8 text-gray-400">
              <p>No addresses added yet.</p>
              <button 
                onClick={() => setIsAddingAddress(true)}
                className="mt-2 text-teal-400 hover:text-teal-300"
              >
                Add your first address
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}