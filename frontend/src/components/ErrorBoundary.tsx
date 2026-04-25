import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card text-center" style={{ maxWidth: '500px', padding: '3rem 2rem' }}>
            <div style={{ background: '#fef2f2', color: '#dc2626', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <AlertTriangle size={32} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
              Something went wrong
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
              We encountered an unexpected error. Don't worry, your data is safe. Please try refreshing the page or head back to the homepage.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => window.location.href = '/'}>
                <Home size={18} /> Home
              </button>
              <button className="btn btn-primary" onClick={this.handleReset}>
                <RefreshCcw size={18} /> Refresh Page
              </button>
            </div>
            {import.meta.env.DEV && (
              <details style={{ marginTop: '2rem', textAlign: 'left', background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Error Details (Dev Only)</summary>
                <pre style={{ marginTop: '0.5rem', overflowX: 'auto', color: '#dc2626' }}>
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
