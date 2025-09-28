import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchProducts, 
  selectProducts, 
  selectProductsLoading, 
  selectTotalPages,
  setFilters,
  clearFilters,
  selectFilters
} from '../store/slices/productsSlice'
import ProductCard from '../components/ProductCard'
import Skeleton from '../components/Skeleton'
import { motion } from 'framer-motion'
import SearchBar from '../components/SearchBar'

export default function ProductsPage() {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)
  const loading = useSelector(selectProductsLoading)
  const totalPages = useSelector(selectTotalPages)
  const filters = useSelector(selectFilters)
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(12)
  const navigate = useNavigate()

  useEffect(() => {
    // Clear any existing filters and products when component mounts
    dispatch(clearFilters())
    
    // Initialize filters from URL params
    const urlFilters = {
      category: searchParams.get('category') || '',
      company: searchParams.get('company') || '',
      search: searchParams.get('search') || '',
      ordering: searchParams.get('ordering') || '',
      trending: searchParams.get('trending') || ''
    }
    
    dispatch(setFilters(urlFilters))
  }, [searchParams, dispatch])

  useEffect(() => {
    const params = {
      ...filters,
      page,
      page_size: pageSize
    }
    
    // Remove empty values
    Object.keys(params).forEach(key => {
      if (!params[key]) delete params[key]
    })
    
    dispatch(fetchProducts(params))
  }, [filters, page, pageSize, dispatch])
  
  const handleSearch = (searchTerm) => {
    dispatch(setFilters({ search: searchTerm }))
    setPage(1)
  }

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }))
    setPage(1)
  }

  const clearAllFilters = () => {
    dispatch(clearFilters())
    setPage(1)
  }


  // Unique filter values
  const categories = [...new Set(products.map(p => p.disease_category))]
  const companies = [...new Set(products.map(p => p.company))]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white mx-4 rounded-2xl p-8 mb-8 text-center mt-4">
        <h1 className="text-4xl font-bold text-white mb-4">All Products</h1>
        <p className="text-xl text-white opacity-90 mb-6">Find the right medicine for your needs</p>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-8">
        {/* Sidebar Filters */}
        <aside className="w-64 hidden md:block">
          <div className="bg-white rounded shadow p-4 mb-4 sticky top-24">
            <h3 className="font-bold mb-4 text-gray-800 text-lg">Filters</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">Sort By</label>
              <select 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filters.ordering}
                onChange={e => handleFilterChange('ordering', e.target.value)}
              >
                <option value="">Default</option>
                <option value="mrp">Price: Low to High</option>
                <option value="-mrp">Price: High to Low</option>
                <option value="-discount">Discount: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">Category</label>
              <select 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filters.category}
                onChange={e => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">Company</label>
              <select 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filters.company}
                onChange={e => handleFilterChange('company', e.target.value)}
              >
                <option value="">All Companies</option>
                {companies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={filters.trending === 'true'}
                  onChange={e => handleFilterChange('trending', e.target.checked ? 'true' : '')}
                  className="mr-2 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Trending Only</span>
              </label>
            </div>

            <button 
              className="w-full text-sm text-purple-600 hover:text-purple-800 font-medium underline"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        <div className="flex-1">
          {/* Mobile filters */}
          <div className="md:hidden mb-4 flex gap-2 flex-wrap">
            <select 
              className="border border-gray-200 rounded-lg px-3 py-2 text-gray-800 bg-white"
              value={filters.ordering}
              onChange={e => handleFilterChange('ordering', e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="mrp">Price ↑</option>
              <option value="-mrp">Price ↓</option>
              <option value="-discount">Discount ↓</option>
            </select>
            <select 
              className="border border-gray-200 rounded-lg px-3 py-2 text-gray-800 bg-white"
              value={filters.category}
              onChange={e => handleFilterChange('category', e.target.value)}
            >
              <option value="">Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button 
              className="text-xs text-purple-600 underline px-2"
             onClick={clearAllFilters}
            >
              Reset
            </button>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {filters.trending ? 'Trending Products' : 'All Products'}
            </h2>
            <p className="text-gray-600">{products.length} products found</p>
          </div>
          
          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {loading
              ? Array(pageSize).fill(0).map((_, i) => <Skeleton key={i} />)
              : products.map(product =>
                <div key={product.product_id}>
                  <ProductCard product={product} />
                </div>
              )
            }
          </div>
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button 
                disabled={page === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100 bg-white"
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              {Array(Math.min(5, totalPages)).fill(0).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button 
                    key={i} 
                    className={`px-4 py-2 border border-gray-200 rounded-lg ${page === pageNum ? 'bg-purple-600 text-white' : 'hover:bg-gray-100 bg-white'}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button 
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100 bg-white"
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}