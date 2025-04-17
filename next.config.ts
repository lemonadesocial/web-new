import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  assetPrefix: '/proxy_static',
  typescript: {
    // ignore type error on some files generated such as farcaster
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.lemonade.social',
      },
    ],
  },
};

export default nextConfig;
