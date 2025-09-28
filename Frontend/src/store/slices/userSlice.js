import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosConfig'

// Async thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/login/', { email, password })
      const { access, refresh } = response.data
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      
      const userResponse = await api.get('/me/')
      localStorage.setItem('user', JSON.stringify(userResponse.data))
      
      // Try to fetch profile
      let profile = null
      try {
        const profileResponse = await api.get('/profile/')
        profile = profileResponse.data
      } catch (profileError) {
        console.log('Profile not found')
      }
      
      return { user: userResponse.data, profile }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed')
    }
  }
)

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/profile/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch profile')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    profile: null,
    loading: false,
    error: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setProfile: (state, action) => {
      state.profile = action.payload
    },
    logoutUser: (state) => {
      state.user = null
      state.profile = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.profile = action.payload.profile
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload
      })
  }
})

export const { setUser, setProfile, logoutUser, clearError } = userSlice.actions

// Selectors
export const selectUser = (state) => state.user.user
export const selectProfile = (state) => state.user.profile
export const selectUserLoading = (state) => state.user.loading
export const selectUserError = (state) => state.user.error

export default userSlice.reducer