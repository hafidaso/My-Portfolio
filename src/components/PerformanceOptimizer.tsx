'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  fallback?: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
  preload?: boolean;
  className?: string;
}

interface PerformanceMetrics {
  loadTime: number;
  memoryUsage: number;
  bundleSize: number;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  fallback,
  priority = 'medium',
  preload = false,
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Intersection Observer for lazy loading
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  // Performance monitoring
  const measurePerformance = useCallback(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const memory = (performance as any).memory;
      
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        const memoryUsage = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0; // MB
        
        setMetrics({
          loadTime,
          memoryUsage,
          bundleSize: 0, // Will be calculated separately
        });
      }
    }
  }, []);

  // Bundle size calculation
  const calculateBundleSize = useCallback(() => {
    if (typeof window !== 'undefined') {
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;
      
      scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src && src.includes('_next')) {
          // Estimate size based on script loading
          totalSize += 100; // KB estimate
        }
      });
      
      setMetrics(prev => prev ? { ...prev, bundleSize: totalSize } : null);
    }
  }, []);

  // Load component based on priority and visibility
  useEffect(() => {
    if (inView && !isVisible) {
      setIsVisible(true);
      
      // Load immediately for high priority
      if (priority === 'high') {
        setIsLoaded(true);
        return;
      }
      
      // Delay loading for medium/low priority to improve perceived performance
      const delay = priority === 'medium' ? 100 : 300;
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [inView, priority, isVisible]);

  // Preload component if specified
  useEffect(() => {
    if (preload && !isLoaded) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [preload, isLoaded]);

  // Performance monitoring
  useEffect(() => {
    if (isLoaded) {
      measurePerformance();
      calculateBundleSize();
    }
  }, [isLoaded, measurePerformance, calculateBundleSize]);

  // Error boundary for component loading
  const handleError = useCallback((error: Error) => {
    console.error('PerformanceOptimizer error:', error);
    setError(error.message);
  }, []);

  // Memoized fallback component
  const memoizedFallback = useMemo(() => {
    if (fallback) return fallback;
    
    return (
      <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
      </div>
    );
  }, [fallback, className]);

  // Error state
  if (error) {
    return (
      <div className={`text-red-500 text-center p-4 ${className}`}>
        <p>Failed to load component</p>
        <button 
          onClick={() => {
            setError(null);
            setIsLoaded(false);
            setIsVisible(false);
          }}
          className="text-sm text-blue-500 hover:underline mt-2"
        >
          Retry
        </button>
      </div>
    );
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div ref={ref} className={className}>
        {memoizedFallback}
      </div>
    );
  }

  // Render children with performance monitoring
  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onError: handleError,
            'data-performance-loaded': true,
            'data-priority': priority,
          });
        }
        return child;
      })}
      
      {/* Performance metrics display (only in development) */}
      {process.env.NODE_ENV === 'development' && metrics && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded opacity-50 hover:opacity-100 transition-opacity">
          <div>Load: {metrics.loadTime.toFixed(0)}ms</div>
          <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
          <div>Bundle: {metrics.bundleSize}KB</div>
        </div>
      )}
    </div>
  );
};

export default PerformanceOptimizer; 