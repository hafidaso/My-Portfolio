import React from 'react';
import Head from 'next/head';

interface PerformanceOptimizerProps {
  preloadImages?: string[];
  preloadFonts?: string[];
  preconnectDomains?: string[];
  dnsPrefetch?: string[];
}

export default function PerformanceOptimizer({
  preloadImages = [],
  preloadFonts = [],
  preconnectDomains = [],
  dnsPrefetch = [],
}: PerformanceOptimizerProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hafida-belayd.me/';

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
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for above-the-fold content */
          body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
          * { box-sizing: border-box; }
          .min-h-screen { min-height: 100vh; }
          .container { width: 100%; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; }
          @media (min-width: 640px) { .container { max-width: 640px; } }
          @media (min-width: 768px) { .container { max-width: 768px; } }
          @media (min-width: 1024px) { .container { max-width: 1024px; } }
          @media (min-width: 1280px) { .container { max-width: 1280px; } }
        `
      }} />
    </Head>
  );
} 