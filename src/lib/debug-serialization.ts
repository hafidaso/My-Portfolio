// Debug utilities to help identify React error #130 and serialization issues

/**
 * Analyzes an object for potential serialization issues
 */
export function analyzeSerializationIssues(obj: any, path = 'root'): string[] {
  const issues: string[] = [];
  
  if (obj === null || obj === undefined) {
    return issues;
  }
  
  // Check for functions
  if (typeof obj === 'function') {
    issues.push(`${path}: Contains function which cannot be serialized`);
    return issues;
  }
  
  // Check for Date objects
  if (obj instanceof Date) {
    issues.push(`${path}: Contains Date object - should be converted to ISO string`);
    return issues;
  }
  
  // Check for circular references
  const seen = new WeakSet();
  try {
    JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          issues.push(`${path}: Contains circular reference at key "${key}"`);
          return {};
        }
        seen.add(value);
      }
      return value;
    });
  } catch (error) {
    issues.push(`${path}: JSON.stringify failed - ${error}`);
  }
  
  // Recursively check nested objects
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [key, value] of Object.entries(obj)) {
      const nestedIssues = analyzeSerializationIssues(value, `${path}.${key}`);
      issues.push(...nestedIssues);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const nestedIssues = analyzeSerializationIssues(item, `${path}[${index}]`);
      issues.push(...nestedIssues);
    });
  }
  
  return issues;
}

/**
 * Debug component props to identify potential serialization issues
 */
export function debugComponentProps(componentName: string, props: any): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  
  console.group(`🔍 Analyzing props for ${componentName}`);
  
  const issues = analyzeSerializationIssues(props, 'props');
  
  if (issues.length > 0) {
    console.warn('⚠️ Potential serialization issues found:');
    issues.forEach(issue => console.warn(`  - ${issue}`));
  } else {
    console.log('✅ No serialization issues detected');
  }
  
  console.groupEnd();
}

/**
 * Safe component wrapper that analyzes props and catches errors
 */
export function withSerializationDebug<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const ComponentWithDebug = (props: P) => {
    const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
    
    React.useEffect(() => {
      debugComponentProps(displayName, props);
    }, [props, displayName]);
    
    return React.createElement(WrappedComponent, props);
  };
  
  const finalDisplayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ComponentWithDebug.displayName = `withSerializationDebug(${finalDisplayName})`;
  
  return ComponentWithDebug;
}

/**
 * Hook to validate props in functional components
 */
export function useSerializationDebug(componentName: string, props: any): void {
  React.useEffect(() => {
    debugComponentProps(componentName, props);
  }, [componentName, props]);
}

// Re-export React for the hook
import React from 'react';
