// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Allow Next.js Image component to load Sanity-hosted images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  // Optional: enable modern app directory features
  experimental: {
    typedRoutes: true,
  },

  // Optional: redirect old paths
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
