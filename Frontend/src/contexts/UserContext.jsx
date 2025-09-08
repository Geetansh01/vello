import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          const response = await api.get('/me/');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user on initial load', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const signup = async (email, password) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    await api.post('/signup/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await login(email, password);
  };

  const login = async (email, password) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    const response = await api.post('/login/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    const userResponse = await api.get('/me/');
    setUser(userResponse.data);
    localStorage.setItem('user', JSON.stringify(userResponse.data));
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const formData = new FormData();
    if (refreshToken) {
        formData.append('refresh', refreshToken);
    }
    try {
        await api.post('/logout/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    } catch (error) {
        console.error("Logout failed, proceeding to clear local data.", error);
    } finally {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        localStorage.removeItem('orders');
        setUser(null);
        window.location.href = '/login';
    }
  };
  
  const forgotPassword = async (email) => {
    const formData = new FormData();
    formData.append('email', email);
    const response = await api.post('/forgot-password/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  };

  const resetPassword = async (email, otp, new_password) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('otp', otp);
    formData.append('new_password', new_password);
    const response = await api.post('/reset-password/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  };

  const updateUser = async (updatedData) => {
    console.log("Updating user to:", updatedData);
  };
  
  const value = { user, loading, signup, login, logout, updateUser, forgotPassword, resetPassword };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
