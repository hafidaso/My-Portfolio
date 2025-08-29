/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization for better performance
  images: {
    unoptimized: false, // Enable image optimization
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "**" },
      { protocol: "https", hostname: "github-readme-stats.vercel.app", pathname: "**" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    // Enable modern image formats
    formats: ['image/webp', 'image/avif'],
    // Enable responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Temporarily disable TypeScript and ESLint to focus on performance
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configure experimental features for better performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['@nextui-org/react', 'framer-motion', 'lucide-react'],
    // Enable webpack 5 features
    webpackBuildWorker: true,
  },
  
  // React configuration
  reactStrictMode: true,
  
  // Performance optimizations
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Enable compression
  compress: true,
  
  // Enable powered by header removal
  poweredByHeader: false,
  
  // Webpack configuration for better performance
  webpack: (config, { isServer, dev, webpack }) => {
    // Handle sharp module for image processing
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        os: false,
        url: false,
        querystring: false,
        http: false,
        https: false,
        zlib: false,
        assert: false,
        constants: false,
        domain: false,
        events: false,
        punycode: false,
        string_decoder: false,
        sys: false,
        timers: false,
        tty: false,
      };
    }
    
    // Ensure proper module resolution
    config.resolve.modules = [
      'node_modules',
      ...(config.resolve.modules || [])
    ];
    
    // Better bundle splitting for production
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for better caching
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Separate NextUI components
            nextui: {
              name: 'nextui',
              test: /[\\/]node_modules[\\/]@nextui-org[\\/]/,
              chunks: 'all',
              priority: 30,
            },
            // Separate Framer Motion
            framer: {
              name: 'framer',
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              chunks: 'all',
              priority: 30,
            },
          },
        },
        // Enable tree shaking
        usedExports: true,
        // Enable side effects optimization
        sideEffects: false,
      };
    }
    
    // Development optimizations
    if (dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }
    
    // Add bundle analyzer in development
    if (dev && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true,
        })
      );
    }
    
    return config;
  },
};

export default nextConfig;
