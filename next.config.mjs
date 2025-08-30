/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: 'export' to enable API routes
  // trailingSlash: true, // Temporarily disabled to fix blog routing
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "**" },
      { protocol: "https", hostname: "github-readme-stats.vercel.app", pathname: "**" },
    ],
    // Disable image optimization to avoid sharp module issues
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    // Simplified CSP to avoid module loading conflicts while allowing text selection
    contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  },
  // Disable TypeScript type checking during build to work around Next.js 15.3.1 params type issue
  typescript: {
    ignoreBuildErrors: true,
  },
  // Suppress ESLint warnings in build output
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure experimental features to fix build issues
  experimental: {
    // Disable static generation for API routes during build
    workerThreads: false,
    cpus: 1,
    // Enable optimizations for better tree shaking and performance
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-label', '@radix-ui/react-slot', 'framer-motion'],
    // Enable CSS optimization
    optimizeCss: true,
    // Temporarily disable optimizePackageImports to fix module loading issues
    // optimizePackageImports: ['sharp'],
  },
  // Remove distDir to fix dynamic routing issues
  // distDir: 'out',
  // React configuration - Enable strict mode for better error detection
  reactStrictMode: true,
  
  // Enable SWC minification and other compiler optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },

  // Suppress hydration warnings from browser extensions
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Simplified webpack configuration to fix module loading errors
  webpack: (config, { isServer, dev }) => {
    // Bundle analyzer
    if (process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
          reportFilename: isServer ? 'server-report.html' : 'client-report.html',
        })
      );
    }

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
    
    // Better error handling for development
    if (dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Create a vendor chunk for better debugging
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
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
          },
        },
      };
    } else {
      // Production optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Framework chunk (React, Next.js)
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // UI libraries chunk
            lib: {
              test: /[\\/]node_modules[\\/](@nextui-org|@radix-ui|framer-motion|lucide-react)[\\/]/,
              name: 'lib',
              priority: 30,
              chunks: 'all',
            },
            // AI/ML libraries chunk
            aiLib: {
              test: /[\\/]node_modules[\\/](@langchain|@huggingface|@mistralai|@supabase|ai|langchain)[\\/]/,
              name: 'ai-lib',
              priority: 25,
              chunks: 'all',
            },
            // Common vendor chunk
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              priority: 20,
              chunks: 'all',
            },
            // Default common chunk
            default: {
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;
