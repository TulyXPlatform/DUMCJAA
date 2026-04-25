import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
      
      // Smart Retry Logic
      retry: (failureCount, error) => {
        // Stop retrying after 2 attempts
        if (failureCount >= 2) return false;
        
        // If the error is an Axios error, check the status code
        if (error instanceof AxiosError && error.response) {
          const status = error.response.status;
          
          // DO NOT retry client errors (400 Bad Request, 401 Auth, 403 Forbidden, 404 Not Found)
          // because retrying them will just result in the exact same error immediately.
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        
        // DO retry Network errors (no response) or 5xx Server Errors
        return true;
      },
      
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes before background refetching
    },
  },
});
