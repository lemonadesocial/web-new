import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
 typescript: {
    // ignore type error on some files generated such as farcaster
    ignoreBuildErrors: true
  }
};

export default nextConfig;
