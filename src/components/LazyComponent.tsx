'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import LoadingAnimation from './LoadingAnimation';

interface LazyComponentProps {
  factory: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

/**
 * Generic lazy loading wrapper for components
 * Improves performance by code splitting and lazy loading non-critical components
 */
const LazyComponent: React.FC<LazyComponentProps> = ({ 
  factory, 
  fallback,
  ...props 
}) => {
  const LazyComp = lazy(factory);
  
  const defaultFallback = (
    <div className="flex justify-center items-center p-8">
      <LoadingAnimation type="spinner" size="md" color="primary" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <LazyComp {...props} />
    </Suspense>
  );
};

/**
 * Higher-order component for lazy loading
 */
export const withLazyLoading = <P extends object>(
  factory: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  return (props: P) => (
    <LazyComponent factory={factory} fallback={fallback} {...props} />
  );
};

/**
 * Intersection Observer based lazy loading for viewport-based loading
 */
export const LazyOnScroll: React.FC<{
  children: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  fallback?: React.ReactNode;
  className?: string;
}> = ({ 
  children, 
  rootMargin = '100px', 
  threshold = 0.1,
  fallback,
  className 
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [rootMargin, threshold, isVisible]);

  const defaultFallback = (
    <div className="flex justify-center items-center p-8 min-h-[200px]">
      <LoadingAnimation type="pulse" size="md" color="primary" />
    </div>
  );

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : (fallback || defaultFallback)}
    </div>
  );
};

export default LazyComponent;
