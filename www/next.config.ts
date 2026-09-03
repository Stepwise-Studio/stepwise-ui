import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@hugeicons/core-free-icons'],
  // Mirrors public/_redirects, which is what actually serves this in
  // production - Cloudflare reads that file, not this config. This entry
  // exists so the redirect also works in `next dev` and in any server-rendered
  // deployment. If the site ever moves to `output: 'export'`, drop this and
  // keep the _redirects file.
  async redirects() {
    return [{ source: '/docs/ai', destination: '/docs/agents', permanent: true }]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
