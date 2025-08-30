// Safe JSON serialization utilities to prevent React error #130

/**
 * Safely stringify JSON, removing non-serializable values
 * Prevents React error #130 caused by trying to serialize functions, dates, etc.
 */
export function safeJsonStringify(obj: any): string {
  try {
    return JSON.stringify(obj, (key, value) => {
      // Remove functions
      if (typeof value === 'function') {
        return undefined;
      }
      
      // Convert dates to ISO strings
      if (value instanceof Date) {
        return value.toISOString();
      }
      
      // Remove undefined values
      if (value === undefined) {
        return null;
      }
      
      return value;
    }, 0).replace(/</g, '\\u003c');
  } catch (error) {
    console.error('JSON serialization error:', error);
    return '{}';
  }
}

/**
 * Clean and sanitize data for serialization
 */
export function sanitizeForSerialization<T>(data: T): T {
  try {
    return JSON.parse(JSON.stringify(data, (key, value) => {
      // Remove functions
      if (typeof value === 'function') {
        return undefined;
      }
      
      // Convert dates to ISO strings
      if (value instanceof Date) {
        return value.toISOString();
      }
      
      // Remove undefined values
      if (value === undefined) {
        return null;
      }
      
      return value;
    }));
  } catch (error) {
    console.error('Data sanitization error:', error);
    return data;
  }
}
