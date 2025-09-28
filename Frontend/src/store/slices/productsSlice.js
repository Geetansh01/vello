import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosConfig'

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const cacheKey = JSON.stringify(params)
      const { products } = getState()
      const cachedData = products.cache[cacheKey]
      
      // Return cached data if it's still valid
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        return { products: cachedData.data, fromCache: true, cacheKey }
      }
      
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
      
      const response = await api.get(`/products/?${queryParams.toString()}`)
      const data = response.data
      const productsData = data.results || (Array.isArray(data) ? data : [data])
      
      const transformedProducts = productsData.map(transformProduct)
      
      return {
        products: transformedProducts,
        totalPages: data.count ? Math.ceil(data.count / (params.page_size || 12)) : 1,
        fromCache: false,
        cacheKey
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products')
    }
  }
)

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchProductBySlug',
  async (slug, { getState, rejectWithValue }) => {
    try {
      const { products } = getState()
      const cachedProduct = products.productCache[slug]
      
      // Return cached product if it's still valid
      if (cachedProduct && Date.now() - cachedProduct.timestamp < CACHE_DURATION) {
        return { product: cachedProduct.data, fromCache: true }
      }
      
      const response = await api.get(`/products/${slug}/`)
      const transformedProduct = transformProduct(response.data)
      
      return { product: transformedProduct, fromCache: false, slug }
    } catch (error) {
      console.error('Product fetch error:', error)
      return rejectWithValue(error.response?.data || 'Failed to fetch product')
    }
  }
)

export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelatedProducts',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${slug}/related/`)
      const relatedData = Array.isArray(response.data) ? response.data : [response.data]
      return relatedData.map(transformProduct)
    } catch (error) {
      return rejectWithValue([]) // Return empty array on error
    }
  }
)

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
  description: product.description || `${product.name} from ${product.company}. Effective treatment for ${product.disease_category}.`,
  returnable: product.returnable,
  expiry_date: product.expiry_date,
  directions_for_use: product.directions_for_use,
  seller_information: product.seller_information,
  manufactured_by: product.manufactured_by,
  packed_by: product.packed_by,
  benefits: product.benefits || [],
  suitable_for: product.suitable_for || [],
  dosage: product.dosage || [],
  cautions: product.cautions || [],
  side_effects: product.side_effects || [],
  key_ingredients: product.key_ingredients || []
})

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    relatedProducts: [],
    loading: false,
    productLoading: false,
    error: null,
    totalPages: 1,
    cache: {}, // Cache for product lists
    productCache: {}, // Cache for individual products
    filters: {
      category: '',
      company: '',
      search: '',
      ordering: '',
      trending: ''
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        company: '',
        search: '',
        ordering: '',
        trending: ''
      }
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
      state.relatedProducts = []
    },
    clearCache: (state) => {
      state.cache = {}
      state.productCache = {}
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.products
        state.totalPages = action.payload.totalPages || 1
        
        // Cache the results if not from cache
        if (!action.payload.fromCache) {
          state.cache[action.payload.cacheKey] = {
            data: action.payload.products,
            timestamp: Date.now()
          }
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch product by slug
      .addCase(fetchProductBySlug.pending, (state) => {
        state.productLoading = true
        state.error = null
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.productLoading = false
        state.currentProduct = action.payload.product
        
        // Cache the product if not from cache
        if (!action.payload.fromCache) {
          state.productCache[action.payload.slug] = {
            data: action.payload.product,
            timestamp: Date.now()
          }
        }
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.productLoading = false
        state.error = action.payload
      })
      
      // Fetch related products
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload
      })
  }
})

export const { setFilters, clearFilters, clearCurrentProduct, clearCache } = productsSlice.actions

// Selectors
export const selectProducts = (state) => state.products.items
export const selectCurrentProduct = (state) => state.products.currentProduct
export const selectRelatedProducts = (state) => state.products.relatedProducts
export const selectProductsLoading = (state) => state.products.loading
export const selectProductLoading = (state) => state.products.productLoading
export const selectProductsError = (state) => state.products.error
export const selectTotalPages = (state) => state.products.totalPages
export const selectFilters = (state) => state.products.filters

export default productsSlice.reducer