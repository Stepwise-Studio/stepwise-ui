import type { MetadataRoute } from 'next'
import { docsNav } from '@/components/stepwise/docs/nav'

const SITE_URL = 'https://ui.stepwise.studio'

/**
 * Derived from `docsNav` rather than hand-listed, so adding a component to the
 * sidebar adds it to the sitemap automatically and the two can't drift apart.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/docs/introduction`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    ...docsNav.flatMap((section) =>
      section.items.map((item) => ({
        url: `${SITE_URL}${item.href}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
    ),
  ]

  // Dedupe across the WHOLE list, not just the nav-derived part: a component
  // can appear in two sidebar sections (e.g. both "All Components" and
  // "Cards"), and /docs/installation is both hardcoded above and present in
  // the nav. First occurrence wins, so the explicit priorities survive.
  return entries.filter((e, i, all) => all.findIndex((x) => x.url === e.url) === i)
}
