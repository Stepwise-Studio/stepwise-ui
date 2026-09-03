import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The registry JSON is the CLI's API surface, not content - keeping it
      // out of the index avoids 60+ raw JSON blobs competing with the real
      // docs pages in search results.
      disallow: '/r/',
    },
    sitemap: 'https://ui.stepwise.studio/sitemap.xml',
  }
}
