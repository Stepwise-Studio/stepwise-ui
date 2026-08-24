'use client'

import type { CSSProperties } from 'react'
import { Scale } from '@/components/stepwise/scale'
import { Frame } from '@/components/stepwise/frame'

export function ScalePreview() {
  return (
    <div className="grid w-full grid-cols-1">
      <Frame
        radius={14}
        className="flex flex-col gap-4 p-6"
        style={{ '--pattern': 'var(--ui-border)' } as CSSProperties}
      >
        <Scale orientation="horizontal" />
        <div className="flex h-24 gap-4">
          <Scale orientation="vertical" />
          <div className="flex-1 rounded-lg bg-zinc-50 dark:bg-zinc-900" />
          <Scale orientation="vertical" />
        </div>
      </Frame>
    </div>
  )
}
