'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingAnimation from './LoadingAnimation';

interface ProgressiveLoadingProps {
  children: ReactNode;
  threshold?: number;
  placeholder?: ReactNode;
  loadingType?: 'skeleton' | 'spinner' | 'dots' | 'wave';
  className?: string;
  delay?: number;
}

const ProgressiveLoading: React.FC<ProgressiveLoadingProps> = ({
  children,
  threshold = 0.1,
  placeholder,
  loadingType = 'skeleton',
  className = '',
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsLoaded(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  const SkeletonPlaceholder = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
    </div>
  );

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    switch (loadingType) {
      case 'skeleton':
        return <SkeletonPlaceholder />;
      case 'spinner':
        return <LoadingAnimation type="spinner" size="md" />;
      case 'dots':
        return <LoadingAnimation type="dots" size="md" />;
      case 'wave':
        return <LoadingAnimation type="wave" size="md" />;
      default:
        return <SkeletonPlaceholder />;
    }
  };

  return (
    <div ref={ref} className={className}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center items-center py-8"
          >
            {getPlaceholder()}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Hook for progressive loading
export const useProgressiveLoading = (items: any[], batchSize = 5) => {
  const [visibleItems, setVisibleItems] = useState(batchSize);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = () => {
    if (visibleItems < items.length) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleItems(prev => Math.min(prev + batchSize, items.length));
        setIsLoading(false);
      }, 500);
    }
  };

  const hasMore = visibleItems < items.length;

  return {
    visibleItems: items.slice(0, visibleItems),
    loadMore,
    isLoading,
    hasMore
  };
};

// Lazy loading hook
export const useLazyLoading = (dependencies: any[] = []) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, dependencies);

  return isLoaded;
};

export default ProgressiveLoading; 