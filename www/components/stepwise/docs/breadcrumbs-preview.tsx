'use client'

import { useState } from 'react'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/stepwise/breadcrumbs'
import { Button } from '@/components/stepwise/button'

const FULL_TRAIL: BreadcrumbItem[] = [
  { label: 'Home',       href: '#' },
  { label: 'Docs',       href: '#' },
  { label: 'Components', href: '#' },
  { label: 'Breadcrumbs' },
]

/**
 * Interactive, but never actually navigates - `onNavigate` intercepts the
 * click and drives the trail from state, which is also how you'd wire this
 * into a real router.
 */
export function BreadcrumbsSlashPreview() {
  const [depth, setDepth] = useState(FULL_TRAIL.length)
  const trail = FULL_TRAIL.slice(0, depth)

  return (
    <div className="flex flex-col items-center gap-5">
      <Breadcrumbs items={trail} onNavigate={(_, i) => setDepth(i + 1)} />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={depth >= FULL_TRAIL.length}
          onClick={() => setDepth(d => Math.min(FULL_TRAIL.length, d + 1))}
        >
          Go deeper
        </Button>
        <Button size="sm" variant="ghost" disabled={depth <= 1} onClick={() => setDepth(1)}>
          Reset
        </Button>
      </div>
      <span className="text-[12px] text-zinc-400 dark:text-zinc-500">
        Click any crumb to walk back up the trail
      </span>
    </div>
  )
}

export function BreadcrumbsChevronPreview() {
  const [depth, setDepth] = useState(3)
  const trail: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '#' },
    { label: 'Settings',  href: '#' },
    { label: 'Profile' },
  ].slice(0, depth)

  return (
    <div className="flex flex-col items-center gap-4">
      <Breadcrumbs separator="chevron" items={trail} onNavigate={(_, i) => setDepth(i + 1)} />
      <Button size="sm" variant="ghost" disabled={depth >= 3} onClick={() => setDepth(3)}>
        Reset
      </Button>
    </div>
  )
}

const DEEP_TRAIL: BreadcrumbItem[] = [
  { label: 'Home',        href: '#' },
  { label: 'Workspace',   href: '#' },
  { label: 'Projects',    href: '#' },
  { label: 'Stepwise UI', href: '#' },
  { label: 'Components',  href: '#' },
  { label: 'Navigation',  href: '#' },
  { label: 'Breadcrumbs' },
]

export function BreadcrumbsOverflowPreview() {
  const [depth, setDepth] = useState(DEEP_TRAIL.length)
  const trail = DEEP_TRAIL.slice(0, depth)

  return (
    <div className="flex flex-col items-center gap-4">
      <Breadcrumbs items={trail} onNavigate={(_, i) => setDepth(i + 1)} />
      <Button size="sm" variant="ghost" disabled={depth >= DEEP_TRAIL.length} onClick={() => setDepth(DEEP_TRAIL.length)}>
        Reset
      </Button>
      <span className="text-[12px] text-zinc-400 dark:text-zinc-500">
        7 crumbs, collapsed to 4 - pick a hidden crumb from the … to jump straight there
      </span>
    </div>
  )
}
