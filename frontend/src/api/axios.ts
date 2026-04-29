import axios, { AxiosError } from 'axios';
import { ENV } from '../config/env';
import toast from 'react-hot-toast';
import { useAuthStore } from '../features/auth/hooks/useAuth';

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request Interceptor: Attach JWT token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // Handle Network Errors / Timeouts
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Handle 401 Unauthorized globally
    if (status === 401) {
      useAuthStore.getState().logout();
      
      localStorage.removeItem('token');
      localStorage.setItem('role', '');
      
      toast.error('Session expired. Please log in again.');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } 
    // Handle 403 Forbidden globally
    else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    }
    // Handle 500 Internal Server Error globally
    else if (status >= 500) {
      toast.error('An unexpected server error occurred. Please try again later.');
    }
    // Note: 400 Bad Request and 404 Not Found are deliberately NOT caught globally here,
    // so that individual components/React Query mutations can handle them specifically
    // (e.g., displaying form validation errors under specific inputs).

    return Promise.reject(error);
  }
);
