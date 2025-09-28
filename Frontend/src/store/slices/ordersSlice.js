import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosConfig'

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/')
      const ordersData = Array.isArray(response.data) ? response.data : [response.data]
      
      return ordersData.map(order => ({
        orderId: order.order_id,
        date: order.created_at,
        total: parseFloat(order.total),
        status: order.status,
        paymentMethod: order.payment_method,
        estimatedDelivery: order.estimated_delivery,
        items: order.items || [],
        canCancel: order.can_cancel,
        deliveryDetails: {
          name: order.delivery_name,
          address: order.delivery_address,
          phone: order.delivery_phone,
          estimatedDelivery: order.estimated_delivery
        }
      }))
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders')
    }
  }
)

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders/create/', orderData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create order')
    }
  }
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    loading: false,
    creating: false,
    error: null
  },
  reducers: {
    clearOrders: (state) => {
      state.items = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createOrder.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.creating = false
        // Add new order to the beginning of the list
        state.items.unshift(action.payload)
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload
      })
  }
})

export const { clearOrders } = ordersSlice.actions

// Selectors
export const selectOrders = (state) => state.orders.items
export const selectOrdersLoading = (state) => state.orders.loading
export const selectOrderCreating = (state) => state.orders.creating
export const selectOrdersError = (state) => state.orders.error

export default ordersSlice.reducer