'use client'

import { useState } from 'react'
import { Segment } from '@/components/stepwise/segment'

const VIEW_OPTIONS = [
  { value: 'list',  label: 'List'  },
  { value: 'grid',  label: 'Grid'  },
  { value: 'table', label: 'Table' },
]

const SIZE_OPTIONS = [
  { value: 'day',   label: 'Day'   },
  { value: 'week',  label: 'Week'  },
  { value: 'month', label: 'Month' },
  { value: 'year',  label: 'Year'  },
]

const ListIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="6"  x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <circle cx="3" cy="6"  r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="3" cy="18" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
)

const GridIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)

const ColumnsIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="18" rx="1"/>
    <rect x="14" y="3" width="7" height="18" rx="1"/>
  </svg>
)

const LAYOUT_OPTIONS = [
  { value: 'list',    label: 'List',    icon: <ListIcon />    },
  { value: 'grid',    label: 'Grid',    icon: <GridIcon />    },
  { value: 'columns', label: 'Columns', icon: <ColumnsIcon /> },
]

export function SegmentPreview() {
  const [view,   setView]   = useState('list')
  const [range,  setRange]  = useState('week')
  const [layout, setLayout] = useState('list')

  return (
    <div className="flex flex-col items-center gap-6">
      <Segment options={VIEW_OPTIONS} value={view} onChange={setView} />
      <Segment options={SIZE_OPTIONS} value={range} onChange={setRange} size="sm" />
      <Segment options={LAYOUT_OPTIONS} value={layout} onChange={setLayout} />
    </div>
  )
}

export function SegmentUnderlinePreview() {
  const [v, setV] = useState('week')
  return (
    <Segment variant="underline" options={SIZE_OPTIONS} value={v} onChange={setV} />
  )
}

const PANEL_OPTIONS = [
  { value: 'overview', label: 'Overview', content: <p className="text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">A high-level summary of your project health and recent activity.</p> },
  { value: 'activity', label: 'Activity', content: <p className="text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">Every deploy, commit, and comment in one timeline.</p> },
  { value: 'settings', label: 'Settings', content: <p className="text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">Manage members, tokens, and integrations.</p> },
]

export function SegmentTabsPreview() {
  const [v, setV] = useState('overview')
  return (
    <div className="w-full max-w-[420px]">
      <Segment variant="underline" options={PANEL_OPTIONS} value={v} onChange={setV} />
    </div>
  )
}
