import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState('orders');

  const categories = [
    { id: 'orders', name: 'Orders & Delivery', icon: '📦' },
    { id: 'account', name: 'Account & Profile', icon: '👤' },
    { id: 'payments', name: 'Payments & Billing', icon: '💳' },
    { id: 'medicines', name: 'Medicines & Health', icon: '💊' },
    { id: 'technical', name: 'Technical Support', icon: '🔧' }
  ];

  const helpContent = {
    orders: [
      {
        question: 'How can I track my order?',
        answer: 'You can track your order by going to "My Orders" section in your profile. You\'ll see real-time updates on your order status and estimated delivery time.'
      },
      {
        question: 'What if my order is delayed?',
        answer: 'If your order is delayed beyond the estimated time, please contact our support team. We\'ll investigate and provide you with an updated delivery timeline.'
      },
      {
        question: 'Can I cancel my order?',
        answer: 'You can cancel your order within 5 minutes of placing it. After that, cancellation depends on the order status. Contact support for assistance.'
      },
      {
        question: 'What are your delivery areas?',
        answer: 'We deliver to 500+ cities across India. Enter your pincode during checkout to check if we deliver to your area.'
      }
    ],
    account: [
      {
        question: 'How do I create an account?',
        answer: 'Click on "Sign Up" and provide your email and password. You can also sign up using your Google account for faster registration.'
      },
      {
        question: 'I forgot my password. What should I do?',
        answer: 'Click on "Forgot Password" on the login page. Enter your email address and we\'ll send you an OTP to reset your password.'
      },
      {
        question: 'How can I update my profile information?',
        answer: 'Go to "My Profile" section where you can update your name, address, phone number, and other personal information.'
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, you can request account deletion by contacting our support team. Please note that this action is irreversible.'
      }
    ],
    payments: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept UPI, credit/debit cards, net banking, and cash on delivery (COD) for eligible orders.'
      },
      {
        question: 'Is it safe to pay online?',
        answer: 'Yes, all online payments are processed through secure, encrypted gateways. We don\'t store your payment information.'
      },
      {
        question: 'Can I get a refund?',
        answer: 'Refunds are processed for cancelled orders or in case of damaged/incorrect items. The refund will be credited to your original payment method within 5-7 business days.'
      },
      {
        question: 'Why was my payment declined?',
        answer: 'Payment can be declined due to insufficient funds, incorrect card details, or bank restrictions. Please check with your bank or try a different payment method.'
      }
    ],
    medicines: [
      {
        question: 'Are your medicines authentic?',
        answer: 'Yes, all our medicines are sourced directly from licensed manufacturers and distributors. We guarantee 100% authenticity.'
      },
      {
        question: 'Do I need a prescription for all medicines?',
        answer: 'Prescription medicines require a valid prescription from a registered doctor. Over-the-counter medicines can be purchased without a prescription.'
      },
      {
        question: 'How do you ensure medicine quality?',
        answer: 'We follow strict quality control measures, proper storage conditions, and work only with certified suppliers to ensure medicine quality.'
      },
      {
        question: 'What if I receive expired medicines?',
        answer: 'We have strict expiry date checks. If you receive expired medicines, contact us immediately for a replacement and full refund.'
      }
    ],
    technical: [
      {
        question: 'The website is not loading properly',
        answer: 'Try clearing your browser cache, disable ad blockers, or try using a different browser. If the issue persists, contact our technical support.'
      },
      {
        question: 'I can\'t upload my prescription',
        answer: 'Ensure your prescription image is clear, in JPG/PNG format, and under 5MB. Try using a different device or browser if the issue continues.'
      },
      {
        question: 'The mobile app is crashing',
        answer: 'Update the app to the latest version, restart your device, or reinstall the app. Contact support if the problem continues.'
      },
      {
        question: 'I\'m not receiving notifications',
        answer: 'Check your notification settings in the app and ensure notifications are enabled for WellMed in your device settings.'
      }
    ]
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="bg-gray-50 min-h-screen"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Help Center
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
          >
            Find answers to your questions and get the help you need
          </motion.p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link to="/orders" className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="font-bold text-gray-900 mb-2">Track Order</h3>
              <p className="text-gray-600 text-sm">Check your order status</p>
            </Link>
            <Link to="/contact" className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 text-sm">Chat with our support team</p>
            </Link>
            <Link to="/profile" className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="font-bold text-gray-900 mb-2">My Account</h3>
              <p className="text-gray-600 text-sm">Manage your profile</p>
            </Link>
            <a href="tel:+911234567890" className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="font-bold text-gray-900 mb-2">Call Support</h3>
              <p className="text-gray-600 text-sm">+91 123 456 7890</p>
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* FAQ Content */}
            <div className="space-y-6">
              {helpContent[activeCategory].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
          <p className="text-lg text-gray-600 mb-8">Can't find what you're looking for? Our support team is here to help!</p>
          <div className="space-x-4">
            <Link 
              to="/contact"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all inline-block"
            >
              Contact Support
            </Link>
            <a 
              href="mailto:support@wellmed.com"
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold py-3 px-8 rounded-xl transition-all inline-block"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}