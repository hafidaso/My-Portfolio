'use client';

import { useEffect } from 'react';

/**
 * Critical Resource Preloader
 * Preloads critical resources that are needed for optimal performance
 */
const CriticalResourcePreloader = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const preloadResources = () => {
      // Critical images to preload
      const criticalImages = [
        '/og-image.png',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png',
      ];

      // Preload critical images
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });

      // Prefetch next page resources if using client-side navigation
      const importantRoutes = ['/blog', '/projects', '/data-science'];
      importantRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });

      // Preconnect to external services
      const externalServices = [
        'https://api.github.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      externalServices.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        if (url.includes('fonts.gstatic.com')) {
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      });
    };

    // Preload resources after a short delay to avoid blocking initial render
    const timeoutId = setTimeout(preloadResources, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
};

export default CriticalResourcePreloader;
