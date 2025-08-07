import { useOrders } from '../contexts/OrderContext';
import { motion } from 'framer-motion';

export default function OrderHistoryPage() {
  const { orders } = useOrders();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">No Orders Yet</h1>
        <p className="text-gray-400 mt-2">You haven't placed any orders with us.</p>
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
              </div>
              <div className="text-left sm:text-right">
                <p className="text-lg font-bold">{formatPrice(order.total)}</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                }`}>{order.status}</span>
              </div>
            </div>
            
            <details>
              <summary className="cursor-pointer font-semibold text-teal-400 hover:text-teal-300">View Details ({order.items.length} items)</summary>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item List */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Items in this Order</h4>
                    {order.items.map(item => (
                        <div key={item.product_id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center">
                                <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded-md mr-4" />
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-gray-400">Qty: {item.qty}</p>
                                </div>
                            </div>
                            <p className="font-semibold">{formatPrice((item.mrp - (item.mrp * item.discount / 100)) * item.qty)}</p>
                        </div>
                    ))}
                </div>
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
