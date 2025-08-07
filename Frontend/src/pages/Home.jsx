import { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import Skeleton from '../components/Skeleton'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '', company: '', type: '', trending: false
  })
  const [page, setPage] = useState(1)
  const [pageSize] = useState(9)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    axios.get('/src/data/products.json').then(res => {
      setProducts(res.data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let result = products
    if (filters.category)
      result = result.filter(p => p.disease_category === filters.category)
    if (filters.company)
      result = result.filter(p => p.company === filters.company)
    if (filters.type)
      result = result.filter(p => p.product_type === filters.type)
    if (filters.trending)
      result = result.filter(p => p.trending)
    setFiltered(result)
    setPage(1)
  }, [products, filters])

  // Pagination logic
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filtered.length / pageSize)

  // Unique filter values
  const categories = [...new Set(products.map(p => p.disease_category))]
  const companies = [...new Set(products.map(p => p.company))]
  const types = [...new Set(products.map(p => p.product_type))]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="container mx-auto px-4 py-6 flex gap-8">
        {/* Sidebar Filters */}
        <aside className="w-64 hidden md:block">
          <div className="bg-white rounded shadow p-4 mb-4">
            <h3 className="font-bold mb-2">Filters</h3>
            <div className="mb-2">
              <label className="block text-sm mb-1">Disease Category</label>
              <select className="w-full border rounded px-2 py-1"
                value={filters.category}
                onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
                <option value="">All</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">Company</label>
              <select className="w-full border rounded px-2 py-1"
                value={filters.company}
                onChange={e => setFilters(f => ({ ...f, company: e.target.value }))}>
                <option value="">All</option>
                {companies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">Product Type</label>
              <select className="w-full border rounded px-2 py-1"
                value={filters.type}
                onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
                <option value="">All</option>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="mb-2 flex items-center gap-2">
              <input type="checkbox" id="trending" checked={filters.trending}
                onChange={e => setFilters(f => ({ ...f, trending: e.target.checked }))} />
              <label htmlFor="trending" className="text-sm">Trending</label>
            </div>
            <button className="mt-2 text-xs text-blue-600 underline"
              onClick={() => setFilters({ category: '', company: '', type: '', trending: false })}>
              Reset Filters
            </button>
          </div>
        </aside>
        <div className="flex-1">
          {/* Top bar filters for mobile */}
          <div className="md:hidden mb-4 flex gap-2 flex-wrap">
            <select className="border rounded px-2 py-1"
              value={filters.category}
              onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
              <option value="">Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="border rounded px-2 py-1"
              value={filters.company}
              onChange={e => setFilters(f => ({ ...f, company: e.target.value }))}>
              <option value="">Company</option>
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="border rounded px-2 py-1"
              value={filters.type}
              onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
              <option value="">Type</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" checked={filters.trending}
                onChange={e => setFilters(f => ({ ...f, trending: e.target.checked }))} />
              Trending
            </label>
            <button className="text-xs text-blue-600 underline"
              onClick={() => setFilters({ category: '', company: '', type: '', trending: false })}>
              Reset
            </button>
          </div>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loading
              ? Array(pageSize).fill(0).map((_, i) => <Skeleton key={i} />)
              : paginated.map(product =>
                <div key={product.product_id} onClick={() => navigate(`/product/${product.slug}`)}
                  className="cursor-pointer">
                  <ProductCard product={product} />
                </div>
              )
            }
          </div>
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button disabled={page === 1}
                className="px-3 py-1 border rounded"
                onClick={() => setPage(page - 1)}>Prev</button>
              {Array(totalPages).fill(0).map((_, i) =>
                <button key={i} className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-blue-100' : ''}`}
                  onClick={() => setPage(i + 1)}>{i + 1}</button>
              )}
              <button disabled={page === totalPages}
                className="px-3 py-1 border rounded"
                onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
