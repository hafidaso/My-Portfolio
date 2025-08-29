'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  style,
  onClick,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Intersection Observer for lazy loading
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
  });

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // Handle image error
  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
    
    // Fallback to a placeholder or default image
    if (!src.includes('placeholder')) {
      setImageSrc('/images/placeholder.png');
    }
  }, [onError, src]);

  // Memoized image props
  const imageProps = useMemo(() => {
    const baseProps = {
      src: imageSrc,
      alt,
      className: `${className} transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`,
      quality,
      placeholder,
      sizes,
      style,
      onClick,
      onLoad: handleLoad,
      onError: handleError,
    };

    if (fill) {
      return {
        ...baseProps,
        fill: true,
      };
    }

    return {
      ...baseProps,
      width,
      height,
    };
  }, [
    imageSrc,
    alt,
    className,
    isLoaded,
    quality,
    placeholder,
    sizes,
    style,
    onClick,
    handleLoad,
    handleError,
    fill,
    width,
    height,
  ]);

  // Loading placeholder
  const loadingPlaceholder = (
    <div 
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${className}`}
      style={{
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
        ...style,
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-400 text-xs">Loading...</div>
      </div>
    </div>
  );

  // Error placeholder
  const errorPlaceholder = (
    <div 
      className={`bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded ${className}`}
      style={{
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
        ...style,
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-red-500 text-xs text-center">
          <div>Failed to load</div>
          <button 
            onClick={() => {
              setHasError(false);
              setImageSrc(src);
            }}
            className="text-blue-500 hover:underline mt-1"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );

  // Don't render anything if not in view and not priority
  if (!inView && !priority) {
    return (
      <div ref={ref} className={className}>
        {loadingPlaceholder}
      </div>
    );
  }

  // Show error placeholder if image failed to load
  if (hasError) {
    return (
      <div ref={ref} className={className}>
        {errorPlaceholder}
      </div>
    );
  }

  // Render optimized image
  return (
    <div ref={ref} className={className}>
      {!isLoaded && !priority && loadingPlaceholder}
      
      <Image
        {...imageProps}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default OptimizedImage;
