import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HowToOrderPage() {
  const orderMethods = [
    {
      title: "Order Online",
      icon: "💻",
      color: "from-blue-500 to-purple-600",
      steps: [
        { number: 1, text: "Search your medicine", icon: "🔍" },
        { number: 2, text: "Add to cart", icon: "🛒" },
        { number: 3, text: "Place order", icon: "📋" },
        { number: 4, text: "Free doctor consultation", icon: "👨‍⚕️" },
        { number: 5, text: "Delivery at your doorstep", icon: "🚚" }
      ]
    },
    {
      title: "Order on Call",
      icon: "📞",
      color: "from-green-500 to-teal-600",
      steps: [
        { number: 1, text: "Call our support team", icon: "☎️" },
        { number: 2, text: "Get estimate and approve order", icon: "💰" },
        { number: 3, text: "Free Doctor consultation", icon: "👨‍⚕️" },
        { number: 4, text: "Delivery at your doorstep", icon: "🚚" }
      ]
    },
    {
      title: "Upload Prescription",
      icon: "📄",
      color: "from-orange-500 to-red-600",
      steps: [
        { number: 1, text: "Upload prescription", icon: "📤" },
        { number: 2, text: "Place the order", icon: "📋" },
        { number: 3, text: "Estimation & approval on call", icon: "📞" },
        { number: 4, text: "Free doctor consultation", icon: "👨‍⚕️" },
        { number: 5, text: "Delivery at your doorstep", icon: "🚚" }
      ]
    }
  ];

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
            How to Order
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
          >
            You Can Order Medicine in 3 Easy Ways
          </motion.p>
        </div>
      </div>

      {/* Order Methods */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {orderMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${method.color} p-6 text-white text-center`}>
                  <div className="text-4xl mb-3">{method.icon}</div>
                  <h2 className="text-2xl font-bold">{method.title}</h2>
                </div>

                {/* Steps */}
                <div className="p-6">
                  <div className="space-y-4">
                    {method.steps.map((step, stepIndex) => (
                      <motion.div
                        key={stepIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.2) + (stepIndex * 0.1) }}
                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                          {step.number}
                        </div>
                        <div className="text-2xl">{step.icon}</div>
                        <div className="flex-grow">
                          <p className="text-gray-800 font-medium">{step.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-6 pt-0">
                  {index === 0 && (
                    <Link 
                      to="/products"
                      className={`w-full bg-gradient-to-r ${method.color} hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition-all text-center block`}
                    >
                      Start Shopping Online
                    </Link>
                  )}
                  {index === 1 && (
                    <a 
                      href="tel:+911234567890"
                      className={`w-full bg-gradient-to-r ${method.color} hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition-all text-center block`}
                    >
                      Call +91 123 456 7890
                    </a>
                  )}
                  {index === 2 && (
                    <button 
                      onClick={() => alert('Prescription upload feature coming soon!')}
                      className={`w-full bg-gradient-to-r ${method.color} hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition-all text-center block`}
                    >
                      Upload Prescription
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Why Choose WellMed?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">10 Min Delivery</h3>
                <p className="text-gray-600 text-sm">Get your medicines delivered in just 10 minutes</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">100% Authentic</h3>
                <p className="text-gray-600 text-sm">All medicines are sourced from licensed manufacturers</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Free Consultation</h3>
                <p className="text-gray-600 text-sm">Get free doctor consultation with every order</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Best Prices</h3>
                <p className="text-gray-600 text-sm">Competitive prices with regular discounts and offers</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Need Help with Your Order?</h2>
          <p className="text-lg text-gray-600 mb-8">Our support team is available 24/7 to assist you</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a 
              href="tel:+911234567890"
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
            >
              📞 Call Us
            </a>
            <Link 
              to="/contact"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
            >
              💬 Live Chat
            </Link>
            <Link 
              to="/help"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
            >
              ❓ Help Center
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}