import { useEffect } from 'react';
import { initializeErrorHandling, safeH1Check } from '../lib/safeUtils';

/**
 * Custom hook for client-side error handling and initialization
 */
export const useErrorHandling = () => {
  useEffect(() => {
    // Initialize error handling on client side only
    if (typeof window !== 'undefined') {
      initializeErrorHandling();

      // Run h1 check to prevent the h1-check.js error
      const runH1Check = () => {
        try {
          safeH1Check();
        } catch (error) {
          console.warn('H1 check failed:', error);
        }
      };

      // Run immediately and on DOM changes
      runH1Check();

      // Set up mutation observer for dynamic content
      if ('MutationObserver' in window) {
        const observer = new MutationObserver((mutations) => {
          const hasNewH1 = mutations.some(mutation => 
            Array.from(mutation.addedNodes).some(node => 
              node.nodeType === Node.ELEMENT_NODE && 
              (node as Element).matches('h1, h1 *')
            )
          );
          
          if (hasNewH1) {
            runH1Check();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });

        // Cleanup observer
        return () => observer.disconnect();
      }

      // Handle Chrome extension errors
      const handleChromeErrors = () => {
        // Suppress common Chrome extension errors
        const originalError = console.error;
        console.error = function(...args: any[]) {
          const message = args[0]?.toString() || '';
          
          // Suppress known Chrome extension errors
          if (
            message.includes('Unchecked runtime.lastError') ||
            message.includes('Could not establish connection') ||
            message.includes('Receiving end does not exist') ||
            message.includes('Extension context invalidated')
          ) {
            // Log as warning instead of error
            console.warn('Chrome extension error (suppressed):', ...args);
            return;
          }
          
          // Call original console.error for other errors
          originalError.apply(console, args);
        };
      };

      handleChromeErrors();

      // Polyfills for older browsers
      const addPolyfills = () => {
        // Object.keys polyfill
        if (!Object.keys) {
          Object.keys = function(obj) {
            if (obj === null || obj === undefined) {
              throw new TypeError('Cannot convert undefined or null to object');
            }
            
            const result = [];
            for (const key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result.push(key);
              }
            }
            return result;
          };
        }

        // Array.from polyfill
        if (!Array.from) {
          Array.from = function(arrayLike: any) {
            if (arrayLike === null || arrayLike === undefined) {
              throw new TypeError('Array.from requires an array-like object');
            }
            
            const result = [];
            for (let i = 0; i < arrayLike.length; i++) {
              result.push(arrayLike[i]);
            }
            return result;
          };
        }
      };

      addPolyfills();
    }
  }, []);
};

export default useErrorHandling;
