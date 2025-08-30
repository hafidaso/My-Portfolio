/**
 * JavaScript Error Fixes and Safe Object Handling
 * Prevents TypeError: Cannot convert undefined or null to object
 */

// Safe Object.keys() wrapper
export function safeObjectKeys(obj: any): string[] {
  if (obj === null || obj === undefined) {
    console.warn('safeObjectKeys: Received null or undefined, returning empty array');
    return [];
  }
  
  if (typeof obj !== 'object') {
    console.warn('safeObjectKeys: Received non-object type:', typeof obj);
    return [];
  }
  
  try {
    return Object.keys(obj);
  } catch (error) {
    console.error('safeObjectKeys: Error getting object keys:', error);
    return [];
  }
}

// Safe Object.values() wrapper
export function safeObjectValues(obj: any): any[] {
  if (obj === null || obj === undefined) {
    console.warn('safeObjectValues: Received null or undefined, returning empty array');
    return [];
  }
  
  if (typeof obj !== 'object') {
    console.warn('safeObjectValues: Received non-object type:', typeof obj);
    return [];
  }
  
  try {
    return Object.values(obj);
  } catch (error) {
    console.error('safeObjectValues: Error getting object values:', error);
    return [];
  }
}

// Safe Object.entries() wrapper
export function safeObjectEntries(obj: any): [string, any][] {
  if (obj === null || obj === undefined) {
    console.warn('safeObjectEntries: Received null or undefined, returning empty array');
    return [];
  }
  
  if (typeof obj !== 'object') {
    console.warn('safeObjectEntries: Received non-object type:', typeof obj);
    return [];
  }
  
  try {
    return Object.entries(obj);
  } catch (error) {
    console.error('safeObjectEntries: Error getting object entries:', error);
    return [];
  }
}

// Chrome runtime error handler
export function handleChromeRuntimeError(): void {
  if (typeof window !== 'undefined' && (window as any).chrome && (window as any).chrome.runtime) {
    const chromeRuntime = (window as any).chrome.runtime;
    
    // Clear any existing lastError
    if (chromeRuntime.lastError) {
      console.warn('Chrome runtime error detected:', chromeRuntime.lastError.message);
    }
    
    // Set up error listener
    chromeRuntime.onMessage?.addListener((message: any, sender: any, sendResponse: any) => {
      try {
        // Handle the message safely
        if (message && typeof message === 'object') {
          // Process message here
          sendResponse({ status: 'received' });
        }
      } catch (error) {
        console.error('Error handling Chrome runtime message:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        sendResponse({ status: 'error', error: errorMessage });
      }
      return true; // Keep message channel open
    });
  }
}

// Safe DOM manipulation functions
export function safeQuerySelector(selector: string): Element | null {
  try {
    if (typeof document === 'undefined') {
      console.warn('safeQuerySelector: document is undefined (SSR?)');
      return null;
    }
    return document.querySelector(selector);
  } catch (error) {
    console.error('safeQuerySelector: Error with selector:', selector, error);
    return null;
  }
}

export function safeQuerySelectorAll(selector: string): NodeList {
  try {
    if (typeof document === 'undefined') {
      console.warn('safeQuerySelectorAll: document is undefined (SSR?)');
      return new NodeList();
    }
    return document.querySelectorAll(selector);
  } catch (error) {
    console.error('safeQuerySelectorAll: Error with selector:', selector, error);
    return new NodeList();
  }
}

// Fix for h1-check.js type error (generic fix for line 107 issue)
export function safeH1Check(): void {
  try {
    const headings = safeQuerySelectorAll('h1');
    const headingData: { [key: string]: any } = {};
    
    headings.forEach((heading, index) => {
      const element = heading as HTMLElement;
      if (element && element.textContent) {
        headingData[`h1-${index}`] = {
          text: element.textContent.trim(),
          id: element.id || `auto-h1-${index}`,
          classList: element.className || ''
        };
      }
    });
    
    // Safe iteration over headingData (this addresses the line 107 type error)
    const keys = safeObjectKeys(headingData);
    keys.forEach(key => {
      const heading = headingData[key];
      if (heading && typeof heading === 'object') {
        console.log(`H1 check - ${key}:`, heading);
      }
    });
    
    return;
  } catch (error) {
    console.error('safeH1Check: Error checking H1 elements:', error);
  }
}

// Browser compatibility checks
export function isBrowserCompatible(): boolean {
  try {
    // Check for essential APIs
    return !!(
      typeof window !== 'undefined' &&
      typeof document !== 'undefined' &&
      'fetch' in window &&
      'querySelector' in document &&
      'keys' in Object &&
      'from' in Array
    );
  } catch (error) {
    console.error('Browser compatibility check failed:', error);
    return false;
  }
}

// Initialize safe error handling
export function initializeErrorHandling(): void {
  // Global error handler
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });

    // Chrome runtime error handling
    handleChromeRuntimeError();
  }
}

// Safe module loading
export function safeModuleLoad<T>(loader: () => Promise<T>): Promise<T | null> {
  return loader().catch(error => {
    console.error('Module loading failed:', error);
    return null;
  });
}

// Export all utility functions
export default {
  safeObjectKeys,
  safeObjectValues,
  safeObjectEntries,
  handleChromeRuntimeError,
  safeQuerySelector,
  safeQuerySelectorAll,
  safeH1Check,
  isBrowserCompatible,
  initializeErrorHandling,
  safeModuleLoad
};
