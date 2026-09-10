import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // @hugeicons/core-free-icons ships untranspiled ESM.
  transpilePackages: ['@hugeicons/core-free-icons'],
}

export default nextConfig
