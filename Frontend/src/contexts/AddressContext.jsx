import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useUser } from './UserContext';

const AddressContext = createContext();

export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setAddresses([]);
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.get('/addresses/');
      setAddresses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch addresses', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const createAddress = async (addressData) => {
    if (!user) {
      throw new Error('Please login to add addresses');
    }

    try {
      const response = await api.post('/addresses/', addressData);
      await fetchAddresses();
      return response.data;
    } catch (error) {
      console.error('Failed to create address', error);
      throw error;
    }
  };

  const updateAddress = async (addressId, addressData) => {
    if (!user) return;

    try {
      const response = await api.put(`/addresses/${addressId}/`, addressData);
      await fetchAddresses();
      return response.data;
    } catch (error) {
      console.error('Failed to update address', error);
      throw error;
    }
  };

  const deleteAddress = async (addressId) => {
    if (!user) return;

    try {
      await api.delete(`/addresses/${addressId}/`);
      await fetchAddresses();
    } catch (error) {
      console.error('Failed to delete address', error);
      throw error;
    }
  };

  const getAddressById = async (addressId) => {
    if (!user) return null;

    try {
      const response = await api.get(`/addresses/${addressId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch address', error);
      throw error;
    }
  };

  const value = {
    addresses,
    loading,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    getAddressById,
  };

  return (
    <AddressContext.Provider value={value}>
      {children}
    </AddressContext.Provider>
  );
}

export const useAddresses = () => useContext(AddressContext);