import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { ENV } from '../config/env';
import { useAuthStore } from '../features/auth/hooks/useAuth';

/**
 * Shared API client used across the frontend.
 *
 * Design goals:
 * - Single source of truth for base URL / timeout / auth header.
 * - Predictable and user-friendly global error behavior.
 * - Keep per-feature services focused on domain logic.
 */
export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/** Attach bearer token to each request when available. */
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Global error policies:
 * - 401: clear auth state and redirect to login.
 * - 403: notify lack of permission.
 * - 5xx: generic server-side message.
 * - 4xx validation/errors: left to local feature handlers.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (!error.response) {
      toast.error('Network issue detected. Please check connection and try again.');
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 401) {
      useAuthStore.getState().logout();
      localStorage.removeItem('token');
      toast.error('Session expired. Please log in again.');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status >= 500) {
      toast.error('Server is currently unavailable. Please try again shortly.');
    }

    return Promise.reject(error);
  }
);
