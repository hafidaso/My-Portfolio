'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  retryCount: number;
}

/**
 * Enhanced Error Boundary Component with retry mechanism and better error tracking
 */
class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: number | null = null;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console and external service if needed
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Report to error tracking service if available
    if (typeof window !== 'undefined') {
      // Google Analytics 4 error tracking
      if ((window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: error.toString(),
          fatal: false,
          error_boundary: true,
          component_stack: errorInfo.componentStack,
          retry_count: this.state.retryCount
        });
      }

      // Performance monitoring
      if ('performance' in window && 'mark' in window.performance) {
        window.performance.mark('error-boundary-catch');
      }

      // Report to external service (e.g., Sentry, LogRocket)
      if ((window as any).Sentry) {
        (window as any).Sentry.withScope((scope: any) => {
          scope.setTag('component', 'ErrorBoundary');
          scope.setLevel('error');
          scope.setContext('errorInfo', errorInfo);
          scope.setContext('retryCount', this.state.retryCount);
          (window as any).Sentry.captureException(error);
        });
      }
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1
      }));

      // Track retry attempt
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'error_boundary_retry', {
          retry_count: this.state.retryCount + 1
        });
      }
    } else {
      // Max retries reached, reload page
      window.location.reload();
    }
  };

  handleReload = () => {
    // Track page reload
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'error_boundary_reload', {
        retry_count: this.state.retryCount
      });
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
              <svg 
                className="w-6 h-6 text-red-600 dark:text-red-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
              Something went wrong
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
              We encountered an error while loading this page. 
              {this.state.retryCount < this.maxRetries 
                ? ' You can try again or refresh the page.'
                : ' Please refresh the page to continue.'
              }
            </p>

            {this.state.retryCount < this.maxRetries && (
              <p className="text-sm text-gray-500 dark:text-gray-500 text-center mb-4">
                Retry attempts: {this.state.retryCount}/{this.maxRetries}
              </p>
            )}
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                <summary className="cursor-pointer text-sm font-medium text-red-800 dark:text-red-400 mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="space-y-2">
                  <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto whitespace-pre-wrap">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto whitespace-pre-wrap">
                      <strong>Component Stack:</strong> {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}
            
            <div className="flex justify-center space-x-3 mt-6">
              {this.state.retryCount < this.maxRetries ? (
                <button
                  onClick={this.handleRetry}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Retry loading the page"
                >
                  Try Again
                </button>
              ) : (
                <button
                  onClick={this.handleReload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Refresh the page"
                >
                  Refresh Page
                </button>
              )}
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Go back to previous page"
              >
                Go Back
              </button>
            </div>

            {/* Help text */}
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-4">
              If this problem persists, please contact support or try again later.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
