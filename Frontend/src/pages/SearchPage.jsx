import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axiosConfig'
import ProductCard from '../components/ProductCard'
import Skeleton from '../components/Skeleton'
import { motion } from 'framer-motion'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [recentSearches] = useState(['Paracetamol', 'Vitamin C', 'Cough Syrup', 'Antibiotics'])
  const [popularCategories] = useState([
    'Fever & Pain', 'Allergy & Cold', 'Digestive Health', 'Vitamins & Supplements'
  ])

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      searchProducts(query)
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const searchProducts = async (query) => {
    setLoading(true)
    try {
      const response = await api.get(`/products/?search=${encodeURIComponent(query)}`)
      const data = response.data
      const productsData = data.results || (Array.isArray(data) ? data : [data])
      
      const transformedProducts = productsData.map(transformProduct)
      setProducts(transformedProducts)
    } catch (error) {
      console.error('Failed to search products', error)
      setProducts([])
    } finally {
      setLoading(false)
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

  const handleSearch = (query) => {
    if (query.trim()) {
      const newUrl = `/search?q=${encodeURIComponent(query.trim())}`
      window.history.pushState({}, '', newUrl)
      // Update the search params to trigger useEffect
      const newSearchParams = new URLSearchParams(newUrl.split('?')[1])
      setSearchParams(newSearchParams)
      searchProducts(query.trim())
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-16 lg:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              placeholder="Search for medicines, health products..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
            <button 
              onClick={() => handleSearch(searchQuery)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
            >
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {!searchQuery ? (
          /* Search Suggestions */
          <div className="space-y-8">
            {/* Recent Searches */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Searches</h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Categories */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Popular Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popularCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(category)}
                    className="bg-white border border-gray-200 text-gray-700 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="font-semibold">{category}</div>
                    <div className="text-sm text-gray-500 mt-1">Explore products</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Explore More */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore More</h2>
              <p className="text-gray-600 mb-6">Discover our wide range of medicines and health products</p>
              <button
                onClick={() => window.location.href = '/products'}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
              >
                Browse All Products
              </button>
            </div>
          </div>
        ) : (
          /* Search Results */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Search Results for "{searchQuery}"
              </h2>
              {!loading && (
                <p className="text-gray-600">{products.length} products found</p>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array(10).fill(0).map((_, i) => <Skeleton key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map(product => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try searching with different keywords</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    window.history.pushState({}, '', '/search')
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-xl transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}