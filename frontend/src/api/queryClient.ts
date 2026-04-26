import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents unnecessary API calls when switching tabs
      
      // Smart Retry Logic
      retry: (failureCount, error) => {
        // Stop retrying after 1 retry attempt
        if (failureCount >= 1) return false;
        
        // If the error is an Axios error, check the status code
        if (error instanceof AxiosError && error.response) {
          const status = error.response.status;
          
          // DO NOT retry any HTTP response errors (4xx or 5xx).
          // Automatic retries on server-side failures create noisy logs and poor UX.
          if (status >= 400) {
            return false;
          }
        }
        
        // Retry only true network errors (no response), once.
        return true;
      },
      
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes before background refetching
    },
  },
});
