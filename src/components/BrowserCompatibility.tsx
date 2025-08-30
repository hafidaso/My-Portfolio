'use client';

import React, { useEffect, useState } from 'react';
import { isBrowserCompatible } from '../lib/safeUtils';

interface BrowserCompatibilityProps {
  children: React.ReactNode;
}

/**
 * Browser Compatibility Check Component
 * Displays a warning for incompatible browsers and provides fallback content
 */
const BrowserCompatibility: React.FC<BrowserCompatibilityProps> = ({ children }) => {
  const [isCompatible, setIsCompatible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCompatibility = () => {
      const compatible = isBrowserCompatible();
      setIsCompatible(compatible);
      setIsLoading(false);
    };

    // Small delay to allow page to initialize
    const timer = setTimeout(checkCompatibility, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isCompatible) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-yellow-600 dark:text-yellow-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Browser Not Supported
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your browser doesn't support some features required for this website to work properly. 
            Please upgrade to a modern browser for the best experience.
          </p>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Recommended Browsers:
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Chrome 90+</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Firefox 88+</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Safari 14+</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Edge 90+</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              If you believe this is an error, you can try to continue anyway:
            </p>
            <button
              onClick={() => setIsCompatible(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default BrowserCompatibility;
