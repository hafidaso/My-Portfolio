'use client';

import { useEffect } from 'react';
import { useErrorHandling } from '../hooks/useErrorHandling';

/**
 * Client-side error handling initializer component
 * This component should be included in the root layout to initialize
 * error handling, browser compatibility checks, and Chrome extension error suppression
 */
const ErrorHandlingInit = () => {
  useErrorHandling();

  useEffect(() => {
    // Additional client-side initialization
    if (typeof window !== 'undefined') {
      // Add meta tag for proper character encoding
      const existingCharsetMeta = document.querySelector('meta[charset]');
      if (!existingCharsetMeta) {
        const charsetMeta = document.createElement('meta');
        charsetMeta.setAttribute('charset', 'UTF-8');
        document.head.insertBefore(charsetMeta, document.head.firstChild);
      }

      // Fix viewport meta tag for better mobile compatibility
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');
      }

      // Prevent FOUC (Flash of Unstyled Content)
      document.documentElement.style.visibility = 'visible';
    }
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default ErrorHandlingInit;
