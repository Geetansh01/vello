import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useUser } from './UserContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // Fetch cart from API when user is available
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.get('/cart/');
      // Transform API response to match our cart structure
      const cartItems = Array.isArray(response.data) ? response.data : [response.data];
      const transformedCart = cartItems.map(item => ({
        product_id: item.product.product_id,
        cart_item_id: item.cart_item_id,
        name: item.product.name,
        company: item.product.company,
        disease_category: item.product.disease_category,
        mrp: parseFloat(item.product.mrp),
        discount: item.product.discount,
        images: item.product.images?.map(img => img.stream_url) || ['/images/placeholder.jpg'],
        trending: item.product.trending,
        slug: item.product.slug,
        qty: item.quantity,
        available_stock: item.product.available_stock || 0,
        discounted_price: parseFloat(item.product.discounted_price)
      }));
      setCart(transformedCart);
    } catch (error) {
      console.error('Failed to fetch cart', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, qty = 1) => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }

    try {
      await api.post('/cart/add/', {
        product_id: product.product_id,
        quantity: qty
      });
      
      // Refresh cart after adding
      await fetchCart();
    } catch (error) {
      console.error('Failed to add item to cart', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      const cartItem = cart.find(item => item.product_id === productId);
      if (cartItem && cartItem.cart_item_id) {
        await api.delete(`/cart/remove/${cartItem.cart_item_id}/`);
        await fetchCart();
      }
    } catch (error) {
      console.error('Failed to remove item from cart', error);
      throw error;
    }
  };

  const updateQty = async (productId, qty) => {
    if (!user) return;

    if (qty < 1) {
      await removeFromCart(productId);
      return;
    }

    try {
      const cartItem = cart.find(item => item.product_id === productId);
      if (cartItem && cartItem.cart_item_id) {
        await api.put(`/cart/update/${cartItem.cart_item_id}/`, {
          quantity: qty
        });
        
        await fetchCart();
      }
    } catch (error) {
      console.error('Failed to update cart item quantity', error);
      throw error;
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((count, item) => count + item.qty, 0);
  
  const cartTotal = cart.reduce((total, item) => {
    const price = item.discounted_price || (item.mrp - (item.mrp * item.discount / 100));
    return total + (price * item.qty);
  }, 0);

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    fetchCart,
    cartCount,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
