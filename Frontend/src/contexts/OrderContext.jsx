import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import { useUser } from './UserContext';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // Memoize fetchOrders to prevent unnecessary re-creations
  const fetchOrders = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await api.get('/orders/');
      const ordersData = Array.isArray(response.data) ? response.data : [response.data];

      const transformedOrders = ordersData.map(order => ({
        orderId: order.order_id,
        date: order.created_at,
        total: parseFloat(order.total),
        status: order.status,
        paymentMethod: order.payment_method,
        estimatedDelivery: order.estimated_delivery,
        items: order.items || [],
        canCancel: order.can_cancel,
        deliveryDetails: {
          name: user.name,
          address: user.address,
          phone: user.phone,
          estimatedDelivery: order.estimated_delivery
        }
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Failed to fetch orders', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Effect now depends on user and memoized fetchOrders
  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user, fetchOrders]);

  const createOrder = async (orderData) => {
    if (!user) {
      throw new Error('Please login to place an order');
    }

    try {
      const orderPayload = {
        payment_method: orderData.paymentMethod || 'UPI',
        items: orderData.items || []
      };

      const response = await api.post('/orders/create/', orderPayload, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Refresh orders after creating
      await fetchOrders();
      return response.data;
    } catch (error) {
      console.error('Failed to create order', error);
      throw error;
    }
  };

  const cancelOrder = async (orderId) => {
    if (!user) return;

    try {
      await api.post(`/orders/${orderId}/cancel/`);
      await fetchOrders();
    } catch (error) {
      console.error('Failed to cancel order', error);
      throw error;
    }
  };

  const getOrderById = async (orderId) => {
    if (!user) return null;

    try {
      const response = await api.get(`/orders/${orderId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order details', error);
      throw error;
    }
  };

  // Keep addOrder for backward compatibility
  const addOrder = (order) => {
    setOrders(prevOrders => [order, ...prevOrders]);
  };

  const value = {
    orders,
    loading,
    addOrder,
    createOrder,
    cancelOrder,
    getOrderById,
    fetchOrders
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
