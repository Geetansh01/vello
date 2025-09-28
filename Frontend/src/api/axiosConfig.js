import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vello-alpha.vercel.app/api',
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor to add the access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle token refreshment on 401 Unauthorized errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }
    
    if (!error.response) {
      console.error('Network error');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    const originalRequest = error.config;
    // Check if the error is 401 and it's not a retry request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await axios.post('https://vello-alpha.vercel.app/api/token/refresh/', {
            refresh: refreshToken,
          });
          const newAccessToken = response.data.access;

          localStorage.setItem('access_token', newAccessToken);
          
          // Update the authorization header for the original request
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, log out the user
          console.error("Token refresh failed", refreshError);
          // Here you might want to trigger a logout action
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
