'use client'

import { ScrollArea } from '@/components/stepwise/scroll-area'

const CITIES = [
  'Amsterdam', 'Bangalore', 'Copenhagen', 'Dubai', 'Edinburgh', 'Florence',
  'Geneva', 'Helsinki', 'Istanbul', 'Jakarta', 'Kyoto', 'Lisbon',
  'Madrid', 'Nairobi', 'Oslo', 'Prague', 'Quebec', 'Reykjavik',
  'Stockholm', 'Tokyo', 'Utrecht', 'Vienna', 'Warsaw', 'Zurich',
]

export function ScrollAreaVerticalPreview() {
  return (
    <div className="w-[240px] overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <ScrollArea maxHeight={220} showScrollbar className="p-1.5">
        <div className="flex flex-col">
          {CITIES.map(c => (
            <div key={c} className="rounded-[12px] px-3 py-2 text-[14px] text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
              {c}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export function ScrollAreaHorizontalPreview() {
  return (
    <div className="w-[320px] overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <ScrollArea axis="x" showScrollbar className="p-3">
        <div className="flex gap-3">
          {CITIES.slice(0, 12).map(c => (
            <div key={c} className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-[13px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {c}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
