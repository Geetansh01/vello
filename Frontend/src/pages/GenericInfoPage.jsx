import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function GenericInfoPage() {
  const benefits = [
    {
      title: "Cost-Effective",
      description: "Generic medicines are typically 20-80% cheaper than branded equivalents",
      icon: "💰"
    },
    {
      title: "Same Quality",
      description: "Contains the same active ingredients as branded medicines",
      icon: "🔬"
    },
    {
      title: "FDA Approved",
      description: "All generic medicines undergo rigorous testing and approval",
      icon: "✅"
    },
    {
      title: "Widely Available",
      description: "Easily accessible at pharmacies and online platforms",
      icon: "🏥"
    }
  ]

  const faqs = [
    {
      question: "Are generic medicines as effective as branded ones?",
      answer: "Yes, generic medicines contain the same active ingredients in the same amounts as branded medicines and are equally effective."
    },
    {
      question: "Why are generic medicines cheaper?",
      answer: "Generic manufacturers don't have to repeat expensive clinical trials and marketing costs, allowing them to offer lower prices."
    },
    {
      question: "Are there any differences in side effects?",
      answer: "Generic medicines have the same side effects as their branded counterparts since they contain identical active ingredients."
    },
    {
      question: "How can I identify generic medicines?",
      answer: "Generic medicines are usually labeled with their chemical name rather than a brand name and are often priced lower."
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-12 mb-12 text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Generic Medicines</h1>
        <p className="text-xl mb-6">Safe, Effective, and Affordable Healthcare Solutions</p>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg leading-relaxed">
            Generic medicines are pharmaceutical products that contain the same active ingredients as branded medicines 
            but are sold under their chemical names. They offer the same therapeutic benefits at a fraction of the cost.
          </p>
        </div>
      </div>

      {/* What are Generic Medicines */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold mb-8 text-center">What are Generic Medicines?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg leading-relaxed mb-6">
              Generic medicines are copies of brand-name drugs that have exactly the same dosage, intended use, 
              effects, side effects, route of administration, risks, safety, and strength as the original drug.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              They are developed after the patent protection of the original drug expires, typically 20 years 
              after the original drug was first patented.
            </p>
            <Link 
              to="/products?generic=true" 
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Shop Generic Medicines
            </Link>
          </div>
          <div className="bg-gray-800 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4 text-teal-400">Key Facts</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Same active ingredients as branded drugs</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Meet the same quality standards</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Undergo rigorous testing</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Approved by regulatory authorities</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold mb-12 text-center">Benefits of Generic Medicines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 text-center"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-teal-400">{benefit.title}</h3>
              <p className="text-gray-300">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold mb-8 text-center">Generic vs Branded Medicines</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-teal-600">
              <tr>
                <th className="px-6 py-4 text-left">Aspect</th>
                <th className="px-6 py-4 text-left">Generic Medicines</th>
                <th className="px-6 py-4 text-left">Branded Medicines</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="px-6 py-4 font-semibold">Active Ingredients</td>
                <td className="px-6 py-4 text-green-400">Same as branded</td>
                <td className="px-6 py-4">Original formulation</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-6 py-4 font-semibold">Effectiveness</td>
                <td className="px-6 py-4 text-green-400">Equally effective</td>
                <td className="px-6 py-4">Proven effectiveness</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-6 py-4 font-semibold">Price</td>
                <td className="px-6 py-4 text-green-400">20-80% cheaper</td>
                <td className="px-6 py-4 text-red-400">Higher cost</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-6 py-4 font-semibold">Availability</td>
                <td className="px-6 py-4 text-green-400">Widely available</td>
                <td className="px-6 py-4">Brand dependent</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold">Regulatory Approval</td>
                <td className="px-6 py-4 text-green-400">FDA/WHO approved</td>
                <td className="px-6 py-4 text-green-400">FDA/WHO approved</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h3 className="text-xl font-bold mb-3 text-teal-400">{faq.question}</h3>
              <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Save on Your Medicines?</h2>
        <p className="text-xl mb-8">Explore our wide range of generic medicines and start saving today!</p>
        <div className="space-x-4">
          <Link 
            to="/products" 
            className="inline-block bg-white text-teal-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Browse All Products
          </Link>
          <Link 
            to="/products?trending=true" 
            className="inline-block border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-teal-600 transition-colors"
          >
            View Trending
          </Link>
        </div>
      </div>
    </motion.div>
  )
}