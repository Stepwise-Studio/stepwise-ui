'use client'

import { Breadcrumbs } from '@/components/stepwise/breadcrumbs'

export function BreadcrumbsSlashPreview() {
  return (
    <Breadcrumbs
      items={[
        { label: 'Home', href: '/' },
        { label: 'Docs', href: '/docs' },
        { label: 'Components', href: '/docs/components' },
        { label: 'Breadcrumbs' },
      ]}
    />
  )
}

export function BreadcrumbsChevronPreview() {
  return (
    <Breadcrumbs
      separator="chevron"
      items={[
        { label: 'Dashboard', href: '#' },
        { label: 'Settings', href: '#' },
        { label: 'Profile' },
      ]}
    />
  )
}
