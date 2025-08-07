import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useOrders } from '../contexts/OrderContext';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';

export default function CheckoutPage() {
  const { user } = useUser();
  const { cart, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };
  
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsModalOpen(true);
      setIsProcessing(false);
    }, 1500);
  };

  const handleConfirmOrder = () => {
    // This is where you would validate the OTP in a real app
    const newOrder = {
      orderId: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      total: cartTotal,
      status: 'Confirmed',
      items: cart,
      deliveryDetails: {
        name: user.name,
        address: user.address,
        phone: user.phone,
        // Set estimated delivery to 3 days from now
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() 
      }
    };
    addOrder(newOrder);
    clearCart();
    setIsModalOpen(false);
    navigate('/order-success', { state: { orderId: newOrder.orderId } });
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-gray-400">You can't checkout without any items.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-extrabold mb-8 text-center">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Address and Payment */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
            <div className="bg-gray-700 p-4 rounded-md">
              <p className="font-semibold">{user?.name}</p>
              <p>{user?.address}</p>
              <p>{user?.email} | {user?.phone}</p>
            </div>
          </div>
          {/* Payment Method */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-4">
              <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer ${paymentMethod === 'UPI' ? 'border-teal-500 bg-gray-700' : 'border-gray-600'}`}>
                <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="h-5 w-5 text-teal-600 bg-gray-700 border-gray-500 focus:ring-teal-500" />
                <span className="ml-4 text-lg font-semibold">UPI</span>
              </label>
              <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer ${paymentMethod === 'COD' ? 'border-teal-500 bg-gray-700' : 'border-gray-600'}`}>
                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="h-5 w-5 text-teal-600 bg-gray-700 border-gray-500 focus:ring-teal-500" />
                <span className="ml-4 text-lg font-semibold">Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
            <h2 className="text-2xl font-bold border-b border-gray-700 pb-4 mb-4">Order Summary</h2>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.product_id} className="flex justify-between text-sm">
                  <span>{item.name} x {item.qty}</span>
                  <span>{formatPrice((item.mrp - (item.mrp * item.discount / 100)) * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 mt-4 pt-4 space-y-3">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t border-gray-600 pt-4 mt-4">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full mt-6 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-all duration-300 text-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Place Order & Pay ${formatPrice(cartTotal)}`}
            </button>
          </div>
        </div>
      </form>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Confirm Order</h2>
        <p className="mb-4 text-gray-400">A dummy OTP has been sent to your number. Please enter it to confirm.</p>
        <input 
          type="text" 
          placeholder="Enter 6-digit OTP" 
          maxLength="6"
          defaultValue="123456"
          className="w-full p-3 bg-gray-700 rounded-md text-center text-2xl tracking-widest"
        />
        <button
          onClick={handleConfirmOrder}
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg"
        >
          Confirm & Complete Order
        </button>
      </Modal>
    </motion.div>
  );
}
