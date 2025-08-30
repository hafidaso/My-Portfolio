'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

/**
 * Performance monitoring component to track Core Web Vitals
 * Monitors and reports key performance metrics for optimization insights
 */
const PerformanceMonitor = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const metrics: PerformanceMetrics = {};

    // Function to report metrics
    const reportMetrics = (metric: any) => {
      if (!metric || !metric.name) return;

      const value = Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value);
      
      switch (metric.name) {
        case 'FCP':
          metrics.fcp = value;
          break;
        case 'LCP':
          metrics.lcp = value;
          break;
        case 'FID':
          metrics.fid = value;
          break;
        case 'CLS':
          metrics.cls = value;
          break;
        case 'TTFB':
          metrics.ttfb = value;
          break;
      }

      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance Metric - ${metric.name}:`, value);
      }

      // Report to analytics service if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'performance_metric', {
          metric_name: metric.name,
          metric_value: value,
          metric_rating: getMetricRating(metric.name, value)
        });
      }
    };

    // Get metric rating (good, needs improvement, poor)
    const getMetricRating = (metricName: string, value: number): string => {
      switch (metricName) {
        case 'FCP':
          return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
        case 'LCP':
          return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
        case 'FID':
          return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
        case 'CLS':
          return value <= 100 ? 'good' : value <= 250 ? 'needs-improvement' : 'poor';
        case 'TTFB':
          return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
        default:
          return 'unknown';
      }
    };

    // Monitor Core Web Vitals using web-vitals library approach
    const observePerformance = () => {
      // FCP - First Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            reportMetrics({ name: 'FCP', value: entry.startTime });
          }
        }
      });
      
      try {
        observer.observe({ type: 'paint', buffered: true });
      } catch (e) {
        // Ignore if not supported
      }

      // LCP - Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        reportMetrics({ name: 'LCP', value: lastEntry.startTime });
      });

      try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        // Ignore if not supported
      }

      // FID - First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any; // Type assertion for FID entry
          reportMetrics({ name: 'FID', value: fidEntry.processingStart - fidEntry.startTime });
        }
      });

      try {
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        // Ignore if not supported
      }

      // CLS - Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      });

      try {
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        // Ignore if not supported
      }

      // Report CLS when page visibility changes
      const reportCLS = () => {
        reportMetrics({ name: 'CLS', value: clsValue });
      };

      document.addEventListener('visibilitychange', reportCLS);
      window.addEventListener('beforeunload', reportCLS);

      // TTFB - Time to First Byte
      const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navTiming) {
        const ttfb = navTiming.responseStart - navTiming.requestStart;
        reportMetrics({ name: 'TTFB', value: ttfb });
      }

      // Cleanup function
      return () => {
        observer.disconnect();
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
        document.removeEventListener('visibilitychange', reportCLS);
        window.removeEventListener('beforeunload', reportCLS);
      };
    };

    // Start monitoring after a short delay to avoid affecting initial performance
    const timeoutId = setTimeout(() => {
      observePerformance();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Monitor resource loading performance
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const monitorResources = () => {
      const resources = performance.getEntriesByType('resource');
      const largestResources = resources
        .filter((resource: any) => resource.transferSize > 100000) // > 100KB
        .sort((a: any, b: any) => b.transferSize - a.transferSize)
        .slice(0, 5);

      if (largestResources.length > 0 && process.env.NODE_ENV === 'development') {
        console.log('Largest Resources:', largestResources.map((r: any) => ({
          name: r.name,
          size: `${Math.round(r.transferSize / 1024)}KB`,
          duration: `${Math.round(r.duration)}ms`
        })));
      }
    };

    // Monitor resources after page load
    window.addEventListener('load', () => {
      setTimeout(monitorResources, 2000);
    });

    return () => {
      window.removeEventListener('load', monitorResources);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
