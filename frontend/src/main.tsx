import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './api/queryClient';
import { AppRouter } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingFallback } from './components/LoadingFallback';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingFallback />}>
          <AppRouter />
        </Suspense>
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#0f172a',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              borderRadius: '8px',
              padding: '12px 16px',
              border: '1px solid #e2e8f0',
            },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
