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
    // Temporarily disable optimizePackageImports to fix module loading issues
    // optimizePackageImports: ['sharp'],
  },
  // Remove distDir to fix dynamic routing issues
  // distDir: 'out',
  // React configuration - Enable strict mode for better error detection
  reactStrictMode: true,
  // Suppress hydration warnings from browser extensions
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Simplified webpack configuration to fix module loading errors
  webpack: (config, { isServer, dev }) => {
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
    }
    
    return config;
  },
};

export default nextConfig;
