'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  loadTime: number; // Total load time
  bundleSize: number; // Estimated bundle size
  memoryUsage: number; // Memory usage
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  enableReporting?: boolean;
  className?: string;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onMetricsUpdate,
  enableReporting = false,
  className = '',
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Measure First Contentful Paint
  const measureFCP = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          setMetrics(prev => prev ? { ...prev, fcp: fcpEntry.startTime } : null);
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    }
  }, []);

  // Measure Largest Contentful Paint
  const measureLCP = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1];
        if (lcpEntry) {
          setMetrics(prev => prev ? { ...prev, lcp: lcpEntry.startTime } : null);
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }, []);

  // Measure First Input Delay
  const measureFID = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fidEntry = entries[0];
        if (fidEntry) {
          setMetrics(prev => prev ? { ...prev, fid: fidEntry.processingStart - fidEntry.startTime } : null);
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    }
  }, []);

  // Measure Cumulative Layout Shift
  const measureCLS = useCallback(() => {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        setMetrics(prev => prev ? { ...prev, cls: clsValue } : null);
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }, []);

  // Measure Time to First Byte
  const measureTTFB = useCallback(() => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        setMetrics(prev => prev ? { ...prev, ttfb } : null);
      }
    }
  }, []);

  // Measure total load time
  const measureLoadTime = useCallback(() => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        setMetrics(prev => prev ? { ...prev, loadTime } : null);
      }
    }
  }, []);

  // Measure memory usage
  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      setMetrics(prev => prev ? { ...prev, memoryUsage } : null);
    }
  }, []);

  // Estimate bundle size
  const estimateBundleSize = useCallback(() => {
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

  // Initialize performance monitoring
  useEffect(() => {
    // Initialize metrics object
    setMetrics({
      fcp: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
      ttfb: 0,
      loadTime: 0,
      bundleSize: 0,
      memoryUsage: 0,
    });

    // Start measuring when page loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        measureFCP();
        measureLCP();
        measureFID();
        measureCLS();
        measureTTFB();
        measureLoadTime();
        measureMemory();
        estimateBundleSize();
      });
    } else {
      measureFCP();
      measureLCP();
      measureFID();
      measureCLS();
      measureTTFB();
      measureLoadTime();
      measureMemory();
      estimateBundleSize();
    }

    // Measure on window load
    window.addEventListener('load', () => {
      measureLoadTime();
      measureMemory();
      estimateBundleSize();
    });

    // Cleanup
    return () => {
      window.removeEventListener('load', () => {});
    };
  }, [measureFCP, measureLCP, measureFID, measureCLS, measureTTFB, measureLoadTime, measureMemory, estimateBundleSize]);

  // Report metrics when they update
  useEffect(() => {
    if (metrics && onMetricsUpdate) {
      onMetricsUpdate(metrics);
    }

    // Send to analytics if enabled
    if (metrics && enableReporting && typeof window !== 'undefined') {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', 'performance_metrics', {
          event_category: 'performance',
          fcp: Math.round(metrics.fcp),
          lcp: Math.round(metrics.lcp),
          fid: Math.round(metrics.fid),
          cls: metrics.cls.toFixed(3),
          ttfb: Math.round(metrics.ttfb),
          load_time: Math.round(metrics.loadTime),
          bundle_size: metrics.bundleSize,
          memory_usage: Math.round(metrics.memoryUsage),
        });
      }

      // Console logging for development
      if (process.env.NODE_ENV === 'development') {
        console.log('Performance Metrics:', {
          'First Contentful Paint': `${Math.round(metrics.fcp)}ms`,
          'Largest Contentful Paint': `${Math.round(metrics.lcp)}ms`,
          'First Input Delay': `${Math.round(metrics.fid)}ms`,
          'Cumulative Layout Shift': metrics.cls.toFixed(3),
          'Time to First Byte': `${Math.round(metrics.ttfb)}ms`,
          'Total Load Time': `${Math.round(metrics.loadTime)}ms`,
          'Bundle Size': `${metrics.bundleSize}KB`,
          'Memory Usage': `${Math.round(metrics.memoryUsage)}MB`,
        });
      }
    }
  }, [metrics, onMetricsUpdate, enableReporting]);

  // Toggle visibility for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.shiftKey && event.key === 'P') {
          setIsVisible(prev => !prev);
        }
      };
      
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, []);

  // Don't render anything in production unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && !enableReporting) {
    return null;
  }

  // Development performance display
  if (process.env.NODE_ENV === 'development' && isVisible && metrics) {
    return (
      <div className={`fixed top-4 right-4 bg-black/90 text-white text-xs p-3 rounded-lg max-w-xs z-50 ${className}`}>
        <div className="font-bold mb-2">Performance Metrics</div>
        <div className="space-y-1">
          <div>FCP: {Math.round(metrics.fcp)}ms</div>
          <div>LCP: {Math.round(metrics.lcp)}ms</div>
          <div>FID: {Math.round(metrics.fid)}ms</div>
          <div>CLS: {metrics.cls.toFixed(3)}</div>
          <div>TTFB: {Math.round(metrics.ttfb)}ms</div>
          <div>Load: {Math.round(metrics.loadTime)}ms</div>
          <div>Bundle: {metrics.bundleSize}KB</div>
          <div>Memory: {Math.round(metrics.memoryUsage)}MB</div>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Press Ctrl+Shift+P to toggle
        </div>
      </div>
    );
  }

  return null;
};

export default PerformanceMonitor;
