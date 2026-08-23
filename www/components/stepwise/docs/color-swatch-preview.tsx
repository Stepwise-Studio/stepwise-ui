'use client'

import { useState } from 'react'
import { ColorSwatch } from '@/components/stepwise/color-swatch'

export function ColorSwatchBasicPreview() {
  const [c, setC] = useState('#3b82f6')
  return (
    <div className="flex flex-col items-center gap-4">
      <ColorSwatch
        colors={['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']}
        value={c}
        onChange={setC}
      />
      <span className="text-[13px] font-medium tabular-nums text-zinc-500 dark:text-zinc-400">{c}</span>
    </div>
  )
}

export function ColorSwatchSizesPreview() {
  return (
    <div className="flex flex-col items-center gap-5">
      <ColorSwatch size={20} defaultValue="#18181b" colors={['#18181b', '#71717a', '#a1a1aa', '#e4e4e7']} />
      <ColorSwatch size={34} defaultValue="#0ea5e9" colors={['#0ea5e9', '#8b5cf6', '#f43f5e', '#f59e0b']} />
    </div>
  )
}
