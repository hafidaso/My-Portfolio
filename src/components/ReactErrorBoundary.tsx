'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ReactErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('React Error Boundary caught an error:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Details:', {
      error: error.message,
      stack: error.stack,
      errorInfo: errorInfo.componentStack
    });

    // Check if it's the specific React error #130
    if (error.message.includes('130') || error.message.includes('object')) {
      console.error('🚨 React Error #130 detected - Object serialization issue:', {
        error: error.message,
        possibleCauses: [
          'Passing non-serializable objects (Date, Function, etc.) as props',
          'JSON.stringify failing on circular references or invalid objects',
          'Server-client hydration mismatch with complex objects'
        ],
        suggestions: [
          'Check props being passed to client components',
          'Ensure all data is properly serialized',
          'Use safeJsonStringify for JSON serialization'
        ]
      });
    }

    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Something went wrong!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {this.state.error?.message?.includes('130') 
                ? 'There was an issue with data serialization. The development team has been notified.'
                : 'An unexpected error occurred. Please try refreshing the page.'
              }
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-gray-100 dark:bg-gray-700 p-4 rounded mb-4">
                <summary className="cursor-pointer font-medium text-gray-900 dark:text-white mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ReactErrorBoundary;
