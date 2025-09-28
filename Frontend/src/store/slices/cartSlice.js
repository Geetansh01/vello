import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosConfig'

// Debounced cart sync function
let syncTimeout = null
const SYNC_DELAY = 2000 // 2 seconds

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart/')
      const cartItems = Array.isArray(response.data) ? response.data : [response.data]
      return cartItems.map(item => ({
        product_id: item.product.product_id,
        cart_item_id: item.cart_item_id,
        name: item.product.name,
        company: item.product.company,
        disease_category: item.product.disease_category,
        mrp: parseFloat(item.product.mrp),
        discount: item.product.discount,
        images: item.product.images?.map(img => img.stream_url) || ['/images/placeholder.jpg'],
        trending: item.product.trending,
        slug: item.product.slug,
        qty: item.quantity,
        available_stock: item.product.available_stock || 0,
        discounted_price: parseFloat(item.product.discounted_price)
      }))
    } catch (error) {
      // If cart is empty or not found, return empty array instead of error
      if (error.response?.status === 404 || error.response?.status === 400) {
        return []
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch cart')
    }
  }
)

export const syncCartWithServer = createAsyncThunk(
  'cart/syncWithServer',
  async (cartItems, { rejectWithValue }) => {
    try {
      // Batch update cart items
      const promises = cartItems.map(item => {
        if (item.needsSync) {
          if (item.qty === 0) {
            return api.delete(`/cart/remove/${item.cart_item_id}/`)
          } else if (item.cart_item_id) {
            return api.put(`/cart/update/${item.cart_item_id}/`, { quantity: item.qty })
          } else {
            return api.post('/cart/add/', { product_id: item.product_id, quantity: item.qty })
          }
        }
        return Promise.resolve()
      })
      
      await Promise.all(promises)
      return true
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to sync cart')
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    syncing: false,
    error: null,
    lastSyncTime: null,
    initialized: false
  },
  reducers: {
    addToCartLocal: (state, action) => {
      const { product, qty = 1 } = action.payload
      const existingItem = state.items.find(item => item.product_id === product.product_id)
      
      if (existingItem) {
        existingItem.qty += qty
        existingItem.needsSync = true
      } else {
        state.items.push({
          product_id: product.product_id,
          name: product.name,
          company: product.company,
          disease_category: product.disease_category,
          mrp: product.mrp,
          discount: product.discount,
          images: product.images,
          trending: product.trending,
          slug: product.slug,
          qty: qty,
          available_stock: product.available_stock,
          discounted_price: product.discounted_price,
          needsSync: true
        })
      }
    },
    
    updateQtyLocal: (state, action) => {
      const { productId, qty } = action.payload
      const item = state.items.find(item => item.product_id === productId)
      
      if (item) {
        if (qty <= 0) {
          state.items = state.items.filter(item => item.product_id !== productId)
        } else {
          item.qty = qty
          item.needsSync = true
        }
      }
    },
    
    removeFromCartLocal: (state, action) => {
      const productId = action.payload
      const item = state.items.find(item => item.product_id === productId)
      if (item) {
        item.qty = 0
        item.needsSync = true
      }
      state.items = state.items.filter(item => item.product_id !== productId)
    },
    
    clearCart: (state) => {
      state.items = []
      state.initialized = false
    },
    
    markItemsSynced: (state) => {
      state.items.forEach(item => {
        item.needsSync = false
      })
    },

    setInitialized: (state, action) => {
      state.initialized = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.initialized = true
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.initialized = true
      })
      .addCase(syncCartWithServer.pending, (state) => {
        state.syncing = true
      })
      .addCase(syncCartWithServer.fulfilled, (state) => {
        state.syncing = false
        state.lastSyncTime = Date.now()
        cartSlice.caseReducers.markItemsSynced(state)
      })
      .addCase(syncCartWithServer.rejected, (state, action) => {
        state.syncing = false
        state.error = action.payload
      })
  }
})

// Debounced sync action
export const debouncedSyncCart = () => (dispatch, getState) => {
  const { cart } = getState()
  const itemsNeedingSync = cart.items.filter(item => item.needsSync)
  
  if (itemsNeedingSync.length === 0) return
  
  clearTimeout(syncTimeout)
  syncTimeout = setTimeout(() => {
    dispatch(syncCartWithServer(cart.items))
  }, SYNC_DELAY)
}

export const { addToCartLocal, updateQtyLocal, removeFromCartLocal, clearCart, markItemsSynced, setInitialized } = cartSlice.actions

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) => state.cart.items.reduce((count, item) => count + item.qty, 0)
export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => {
  const price = item.discounted_price || (item.mrp - (item.mrp * item.discount / 100))
  return total + (price * item.qty)
}, 0)
export const selectCartLoading = (state) => state.cart.loading
export const selectCartSyncing = (state) => state.cart.syncing
export const selectCartInitialized = (state) => state.cart.initialized

export default cartSlice.reducer