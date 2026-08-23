import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@hugeicons/core-free-icons'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
