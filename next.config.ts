import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  assetPrefix: '/proxy_static',
  htmlLimitedBots:
    /Mediapartners-Google|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|MyBot/i,
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
