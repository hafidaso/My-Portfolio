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
  // Restore stable webpack configuration to fix module loading errors
  webpack: (config, { isServer }) => {
    // Handle sharp module for image processing
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    // Restore externals configuration for stable module loading
    config.externals = config.externals || [];
    config.externals.push({
      'sharp': 'commonjs sharp'
    });
    
    // Add additional optimizations for stable module loading
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
    };
    
    // Ensure proper module resolution
    config.resolve.modules = [
      'node_modules',
      ...(config.resolve.modules || [])
    ];
    
    return config;
  },
};

export default nextConfig;
