import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const localOrders = localStorage.getItem('orders');
      return localOrders ? JSON.parse(localOrders) : [];
    } catch (error) {
      console.error('Could not parse orders from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order) => {
    setOrders(prevOrders => [order, ...prevOrders]);
  };
  
  const value = { orders, addOrder };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
