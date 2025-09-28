import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  selectCartItems, 
  selectCartTotal, 
  selectCartLoading,
  updateQtyLocal, 
  removeFromCartLocal,
  debouncedSyncCart,
  fetchCart
} from '../store/slices/cartSlice';
import { selectUser } from '../store/slices/userSlice';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const cart = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const loading = useSelector(selectCartLoading);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Fetch cart data when component mounts if user is logged in
    if (user && !isInitialized) {
      dispatch(fetchCart()).finally(() => {
        setIsInitialized(true);
      });
    } else if (!user) {
      setIsInitialized(true);
    }
  }, [user, dispatch, isInitialized]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleUpdateQty = (productId, newQty) => {
    dispatch(updateQtyLocal({ productId, qty: newQty }));
    dispatch(debouncedSyncCart());
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCartLocal(productId));
    dispatch(debouncedSyncCart());
  };

  // Show loading state while initializing
  if (!isInitialized || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-8">You need to login to view your cart.</p>
          <Link 
            to="/login"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Shopping Cart</h1>
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link 
            to="/products"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-extrabold mb-8 text-center">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <motion.div
              key={item.product_id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <Link to={`/product/${item.slug}`} className="flex-shrink-0">
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-full md:w-24 h-32 md:h-24 object-cover rounded-xl"
                  />
                </Link>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link to={`/product/${item.slug}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500">{item.company}</p>
                      <p className="text-xs text-gray-400">{item.disease_category}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.product_id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => handleUpdateQty(item.product_id, Math.max(1, item.qty - 1))}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 font-semibold">{item.qty}</span>
                        <button
                          onClick={() => handleUpdateQty(item.product_id, Math.min(item.available_stock, item.qty + 1))}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800"
                          disabled={item.qty >= item.available_stock}
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">
                        Stock: {item.available_stock}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice((item.discounted_price || (item.mrp - (item.mrp * item.discount / 100))) * item.qty)}
                      </p>
                      {item.discount > 0 && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(item.mrp * item.qty)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((count, item) => count + item.qty, 0)} items)</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-center block"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-colors text-center block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}