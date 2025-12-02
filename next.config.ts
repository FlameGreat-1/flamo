import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use webpack polling in development (WSL)
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
        };
      }
      return config;
    },
  }),

  // Explicitly enable Turbopack for production (silences warning)
  turbopack: {},

  // Production Optimizations
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' }
        ]
      }
    ];
  }
};

export default nextConfig;
