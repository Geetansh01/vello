import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useOrders } from '../contexts/OrderContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function OrderHistoryPage() {
  const { orders, loading, fetchOrders } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const handleCancelOrder = async (orderId) => {
    // TODO: Implement cancel order functionality
    console.log('Cancel order:', orderId);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-8">My Orders</h1>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-8">My Orders</h1>
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-8">You haven't placed any orders with us yet.</p>
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
      <h1 className="text-4xl font-extrabold mb-8">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <motion.div 
            key={order.orderId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-gray-700">
              <div className="mb-4 sm:mb-0">
                <p className="text-lg font-bold">Order ID: {order.orderId}</p>
                <p className="text-sm text-gray-400">Placed on {formatDate(order.date)}</p>
                {order.paymentMethod && (
                  <p className="text-sm text-gray-400">Payment: {order.paymentMethod}</p>
                )}
              </div>
              <div className="text-left sm:text-right">
                <p className="text-lg font-bold">{formatPrice(order.total)}</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300' : 
                  order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-green-500/20 text-green-300'
                }`}>{order.status}</span>
                {order.canCancel && order.status === 'Pending' && (
                  <button 
                    onClick={() => handleCancelOrder(order.orderId)}
                    className="ml-2 text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full hover:bg-red-500/30"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            
            <details>
              <summary className="cursor-pointer font-semibold text-teal-400 hover:text-teal-300">View Details ({order.items.length} items)</summary>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item List */}
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Items in this Order</h4>
                    {order.items.map((item, idx) => (
                         <div key={`${item.product_id}-${idx}`} className="flex justify-between items-center text-sm">

                            <div className="flex items-center">
                                <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} className="w-12 h-12 rounded-md mr-4" />
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-gray-400">Qty: {item.qty}</p>
                                </div>
                            </div>
                            <p className="font-semibold">{formatPrice((item.mrp - (item.mrp * item.discount / 100)) * item.qty)}</p>
                        </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <p>Order details not available</p>
                  </div>
                )}
                {/* Delivery Details */}
                {order.deliveryDetails && (
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-lg mb-2">Delivery Details</h4>
                        <p className="font-medium">{order.deliveryDetails.name}</p>
                        <p className="text-sm text-gray-400">{order.deliveryDetails.address}</p>
                        <p className="text-sm text-gray-400 mt-1">Phone: {order.deliveryDetails.phone}</p>
                        <div className="mt-4 pt-2 border-t border-gray-600">
                            <p className="text-sm font-semibold text-green-400">
                                Estimated Delivery: {formatDate(order.deliveryDetails.estimatedDelivery)}
                            </p>
                        </div>
                    </div>
                )}
              </div>
            </details>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
