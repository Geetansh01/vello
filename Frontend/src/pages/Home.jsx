import { useEffect, useState, useMemo } from 'react'
import api from '../api/axiosConfig'
import ProductCard from '../components/ProductCard'
import Skeleton from '../components/Skeleton'
import { dummyProducts, dummyFeaturedProducts, dummyTrendingProducts } from '../data/dummyProducts'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import TrendingCarousel from '../components/TrendingCarousel'
import HeroCarousel from '../components/HeroCarousel'

export default function Home() {
  const [trendingProducts, setTrendingProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [trendingLoading, setTrendingLoading] = useState(true)
  const [featuredLoading, setFeaturedLoading] = useState(true)
  const navigate = useNavigate()

  const categories = useMemo(() => [
    { 
      name: 'Fever & Pain', 
      icon: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', 
      count: 25,
      color: 'bg-red-50 border-red-100'
    },
    { 
      name: 'Allergy & Cold', 
      icon: 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', 
      count: 18,
      color: 'bg-blue-50 border-blue-100'
    },
    { 
      name: 'Digestive Health', 
      icon: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', 
      count: 22,
      color: 'bg-green-50 border-green-100'
    },
    { 
      name: 'Heart & BP', 
      icon: 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', 
      count: 15,
      color: 'bg-purple-50 border-purple-100'
    },
    { 
      name: 'Vitamins', 
      icon: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', 
      count: 30,
      color: 'bg-yellow-50 border-yellow-100'
    },
    { 
      name: 'Antibiotics', 
      icon: 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', 
      count: 12,
      color: 'bg-orange-50 border-orange-100'
    },
    { 
      name: 'Skin Care', 
      icon: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', 
      count: 20,
      color: 'bg-pink-50 border-pink-100'
    },
    { 
      name: 'Women\'s Health', 
      icon: 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', 
      count: 16,
      color: 'bg-indigo-50 border-indigo-100'
    }
  ], [])
  useEffect(() => {
    fetchTrendingProducts()
    fetchFeaturedProducts()
  }, [])

  const fetchTrendingProducts = async () => {
    setTrendingLoading(true)
    try {
      const response = await api.get('/products/?trending=true&page_size=10', {
        timeout: 30000
      })
      const data = response.data
      const productsData = data.results || (Array.isArray(data) ? data : [data])
      
      const transformedProducts = productsData.map(transformProduct)
      setTrendingProducts(transformedProducts)
    } catch (error) {
      console.error('Failed to fetch trending products', error)
      // Use dummy data as fallback
      setTrendingProducts(dummyTrendingProducts)
    } finally {
      setTrendingLoading(false)
    }
  }

  const fetchFeaturedProducts = async () => {
    setFeaturedLoading(true)
    try {
      const response = await api.get('/products/?featured=true&page_size=8', {
        timeout: 30000
      })
      const data = response.data
      const productsData = data.results || (Array.isArray(data) ? data : [data])
      
      const transformedProducts = productsData.map(transformProduct)
      setFeaturedProducts(transformedProducts)
    } catch (error) {
      console.error('Failed to fetch featured products', error)
      // Use dummy data as fallback
      setFeaturedProducts(dummyFeaturedProducts)
    } finally {
      setFeaturedLoading(false)
    }
  }


  const transformProduct = (product) => ({
    product_id: product.product_id,
    slug: product.slug,
    name: product.name,
    company: product.company,
    disease_category: product.disease_category,
    mrp: parseFloat(product.mrp),
    discount: product.discount,
    discounted_price: parseFloat(product.discounted_price),
    images: product.images?.map(img => img.stream_url) || ['/images/placeholder.jpg'],
    trending: product.trending,
    available_stock: product.available_stock || 100,
    description: product.description || `${product.name} from ${product.company}. Effective treatment for ${product.disease_category}.`
  })

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Flash Sale Banner */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white">
        <div className="px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <div className="flex items-center space-x-2 text-sm md:text-base font-bold">
              <span className="animate-bounce">⚡</span>
              <span>FLASH SALE: Up to 80% OFF on medicines!</span>
              <span className="animate-bounce">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-4 py-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Shop by Category</h2>
            <Link to="/products" className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
            {categories.map(category => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(category.name)}
                className={`${category.color} rounded-2xl p-3 md:p-4 text-center cursor-pointer hover:shadow-md transition-all border`}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 rounded-xl overflow-hidden">
                  <img src={category.icon} alt={category.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-1 leading-tight">{category.name}</h3>
                <p className="text-xs text-gray-600">{category.count} items</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Flash Deals Section */}
      <div className="px-4 py-6 bg-white">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-red-50 to-orange-50  rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">⚡</span>
                Flash Deals
              </h2>
              <p className="text-sm text-gray-600">Limited time offers</p>
            </div>
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              Ends Soon!
            </div>
          </div>
          {featuredLoading ? (
            <div className="flex gap-4 overflow-x-auto">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} type="trending" />)}
            </div>
          ) : (
            <TrendingCarousel products={featuredProducts} title="" showTitle={false} />
          )}
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-4 py-6 bg-white">
        <div className="max-w-7xl mx-auto  bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">⭐</span>
                Featured Products
              </h2>
              <p className="text-sm text-gray-600">Handpicked for you</p>
            </div>
            <Link to="/products?featured=true" className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              View All →
            </Link>
          </div>
          {featuredLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {featuredProducts.slice(0, 5).map(product => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trending Products */}
      <div className="px-4 py-6 bg-white">
        <div className="max-w-7xl mx-auto bg-gray-50 rounded-2xl p-6">
          {trendingLoading ? (
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900">Trending Now</h2>
              <div className="flex gap-4 overflow-x-auto">
                {Array(5).fill(0).map((_, i) => <Skeleton key={i} type="trending" />)}
              </div>
            </div>
          ) : (
            <TrendingCarousel products={trendingProducts} title="Trending Now" />
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="px-4 py-8 bg-white">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">How WellMed Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Search & Order</h3>
              <p className="text-gray-600">Find your medicines and place your order in seconds</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H15a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">We Prepare</h3>
              <p className="text-gray-600">Our pharmacists carefully prepare your order</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your medicines delivered in 10 minutes</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Generic Medicine Info */}
      <div className="px-4 py-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Why Choose Generic Medicines?</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Generic medicines contain the same active ingredients as branded medicines and are equally effective. 
                  They undergo rigorous testing to ensure safety and efficacy while being significantly more affordable.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">Same active ingredients as branded medicines</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">20-80% cheaper than branded alternatives</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">FDA approved and rigorously tested</span>
                  </div>
                </div>
                <Link 
                  to="/generic-info"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors inline-block"
                >
                  Learn More About Generics
                </Link>
              </div>
              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Generic vs Branded</h3>
                    <p className="text-gray-500">Watch our educational video</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-4 py-8 bg-white">
        <div className="max-w-7xl mx-auto text-center text-white bg-black bg-opacity-10 rounded-2xl p-8 bg-gradient-to-r from-purple-600 to-blue-600">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Your Health, Our Priority</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">Quality medicines, expert advice, doorstep delivery</p>
          <div className="space-x-4">
            <Link 
              to="/products"
              className="bg-white text-purple-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors inline-block"
            >
              Start Shopping
            </Link>
            <Link 
              to="/how-to-order"
              className="border-2 border-white text-white font-bold py-3 px-8 rounded-xl hover:bg-white hover:text-purple-600 transition-colors inline-block"
            >
              How to Order
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}