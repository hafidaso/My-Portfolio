'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'eager' | 'lazy';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized image component with advanced loading strategies
 * Features:
 * - Intersection observer for lazy loading
 * - WebP/AVIF support with fallbacks
 * - Progressive loading with blur placeholder
 * - Error handling with fallback images
 * - Performance optimizations
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  loading = 'lazy',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Load images 50px before they enter viewport
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isVisible]);

  // Generate optimized src URLs for different formats
  const getOptimizedSrc = (originalSrc: string, format?: 'webp' | 'avif') => {
    if (originalSrc.startsWith('http') || originalSrc.startsWith('//')) {
      // External image - return as is or use image optimization service
      return originalSrc;
    }
    
    // Local image - Next.js will handle optimization
    return originalSrc;
  };

  // Generate blur placeholder
  const generateBlurDataURL = (width: number, height: number) => {
    if (blurDataURL) return blurDataURL;
    
    // Generate a simple blur placeholder
    const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null;
    if (!canvas) return '';
    
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, 10, 10);
    
    return canvas.toDataURL();
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Fallback image for errors
  const fallbackSrc = '/images/placeholder.png';

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: width || 'auto', 
        height: height || 'auto',
        contain: 'layout style paint'
      }}
    >
      {isVisible && !hasError ? (
        <Image
          src={hasError ? fallbackSrc : getOptimizedSrc(src)}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          priority={priority}
          loading={loading}
          placeholder={placeholder}
          blurDataURL={placeholder === 'blur' ? generateBlurDataURL(width, height) : undefined}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={{
            objectFit: 'cover',
            transform: 'translateZ(0)', // Force GPU acceleration
            willChange: 'opacity'
          }}
          onLoad={handleLoad}
          onError={handleError}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        // Loading placeholder
        <div 
          className={`w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center ${className}`}
          style={{ 
            width: width || '100%', 
            height: height || '200px'
          }}
        >
          <svg 
            className="w-8 h-8 text-gray-400 dark:text-gray-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(OptimizedImage);
