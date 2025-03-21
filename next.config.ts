import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    // ignore type error on some files generated such as farcaster
    ignoreBuildErrors: true,
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
