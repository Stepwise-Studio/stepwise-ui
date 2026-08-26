'use client'

import type { CSSProperties } from 'react'
import { Scale } from '@/components/stepwise/scale'
import { Frame } from '@/components/stepwise/frame'

const pattern = { '--pattern': 'var(--ui-border)' } as CSSProperties

export function ScaleHorizontalPreview() {
  return (
    <Scale
      orientation="horizontal"
      className="absolute inset-x-0 top-1/2 -translate-y-1/2"
      style={pattern}
    />
  )
}

export function ScaleVerticalPreview() {
  return (
    <Scale
      orientation="vertical"
      className="absolute inset-y-0 left-1/2 -translate-x-1/2"
      style={pattern}
    />
  )
}

export function ScaleUsagePreview() {
  return (
    <div className="grid w-full grid-cols-1">
      <Frame radius={16} className="flex flex-col overflow-hidden" style={pattern}>
        {/* Last section before the footer — CTA skeleton */}
        <div aria-hidden className="flex flex-col items-center gap-3 px-6 py-14 sm:px-10">
          <div className="h-3 w-40 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-2 w-56 rounded-full bg-zinc-100 dark:bg-zinc-900" />
          <div className="mt-3 h-8 w-28 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        <Scale orientation="horizontal" thickness={30} />

        {/* Footer skeleton */}
        <div
          aria-hidden
          className="flex flex-col items-start gap-4 bg-zinc-50 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-10 dark:bg-zinc-950"
        >
          <div className="h-4 w-4 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="flex flex-wrap gap-x-6 gap-y-4">
            {[0, 1, 2].map((col) => (
              <div key={col} className="flex flex-col gap-2">
                <div className="h-1.5 w-14 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="h-1.5 w-11 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-1.5 w-11 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        </div>
      </Frame>
    </div>
  )
}
