import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signup = async (formData) => {
    console.log('Signing up with:', formData);
    await new Promise(res => setTimeout(res, 1000));
    return { success: true };
  };

  const login = async (email, password) => {
    console.log('Logging in with:', email, password);
    await new Promise(res => setTimeout(res, 1000));
    
    if (email.includes('@') && password.length >= 6) {
      const mockUser = {
        name: 'John Doe',
        email: email,
        address: '123 Health St, Wellness City',
        phone: '1234567890'
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Also clear orders and cart on logout for this example
    localStorage.removeItem('orders');
    localStorage.removeItem('cart');
    window.location.href = '/'; // Force reload to clear state
  };
  
  const updateUser = (updatedData) => {
    // In a real app, this would be an API call
    console.log("Updating user to:", updatedData);
    setUser(updatedData);
    localStorage.setItem('user', JSON.stringify(updatedData));
    // Add toast notification logic here
  };
  
  const updatePassword = async (currentPassword, newPassword) => {
    // In a real app, this would be a secure API call
    console.log("Updating password...");
    await new Promise(res => setTimeout(res, 1000));
    // Here you would add real logic to check the currentPassword
    console.log("Password updated successfully.");
  };

  const value = { user, signup, login, logout, updateUser, updatePassword };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
