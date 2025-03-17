import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  typescript: {
    // ignore type error on some files generated such as farcaster
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
