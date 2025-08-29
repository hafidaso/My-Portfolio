'use client';

import React from 'react';
import Head from 'next/head';

interface PerformanceHeadProps {
  preloadImages?: string[];
  preloadFonts?: string[];
  preconnectDomains?: string[];
  dnsPrefetch?: string[];
  criticalCSS?: string;
}

export default function PerformanceHead({
  preloadImages = [],
  preloadFonts = [],
  preconnectDomains = [],
  dnsPrefetch = [],
  criticalCSS = '',
}: PerformanceHeadProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hafida-belayd.netlify.app';

  return (
    <Head>
      {/* Preconnect to external domains for faster loading */}
      {preconnectDomains.map((domain, index) => (
        <link key={`preconnect-${index}`} rel="preconnect" href={domain} />
      ))}
      
      {/* DNS prefetch for faster domain resolution */}
      {dnsPrefetch.map((domain, index) => (
        <link key={`dns-${index}`} rel="dns-prefetch" href={domain} />
      ))}
      
      {/* Preload critical images */}
      {preloadImages.map((image, index) => (
        <link
          key={`preload-image-${index}`}
          rel="preload"
          as="image"
          href={image.startsWith('http') ? image : `${baseUrl}${image}`}
        />
      ))}
      
      {/* Preload critical fonts */}
      {preloadFonts.map((font, index) => (
        <link
          key={`preload-font-${index}`}
          rel="preload"
          as="font"
          type="font/woff2"
          href={font}
          crossOrigin="anonymous"
        />
      ))}
      
      {/* Preload critical resources */}
      <link rel="preload" href="/manifest.json" as="fetch" crossOrigin="anonymous" />
      <link rel="preload" href="/icons/icon-192x192.png" as="image" />
      <link rel="preload" href="/icons/icon-512x512.png" as="image" />
      
      {/* Resource hints for better performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://github-readme-stats.vercel.app" />
      <link rel="preconnect" href="https://res.cloudinary.com" />
      
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//github-readme-stats.vercel.app" />
      <link rel="dns-prefetch" href="//res.cloudinary.com" />
      
      {/* Performance optimization meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#f97316" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Hafida Portfolio" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#f97316" />
      <meta name="msapplication-tap-highlight" content="no" />
      
      {/* Critical CSS inline for above-the-fold content */}
      {criticalCSS && (
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
      )}
      
      {/* Performance monitoring */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Performance monitoring
            if (typeof window !== 'undefined') {
              window.addEventListener('load', () => {
                if ('performance' in window) {
                  const navigation = performance.getEntriesByType('navigation')[0];
                  if (navigation) {
                    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
                    console.log('Page load time:', loadTime + 'ms');
                    
                    // Send to analytics if available
                    if (window.gtag) {
                      window.gtag('event', 'performance', {
                        'event_category': 'timing',
                        'value': Math.round(loadTime),
                        'custom_parameter': 'page_load_time'
                      });
                    }
                  }
                }
              });
            }
          `
        }}
      />
    </Head>
  );
}
