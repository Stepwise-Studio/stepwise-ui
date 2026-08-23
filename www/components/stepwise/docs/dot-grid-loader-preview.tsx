'use client'

import { DotGridLoader, type DotGridPattern } from '@/components/stepwise/dot-grid-loader'

export function DotGridBasicPreview() {
  return (
    <div className="flex items-center justify-center py-8">
      <DotGridLoader pattern="wave" dot={9} gap={7} />
    </div>
  )
}

export function DotGridPatternsPreview() {
  const patterns: DotGridPattern[] = ['wave', 'ripple', 'snake', 'random']
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8 py-4">
      {patterns.map(p => (
        <div key={p} className="flex flex-col items-center gap-4">
          <DotGridLoader pattern={p} dot={9} gap={7} />
          <span className="text-[12px] text-zinc-400 dark:text-zinc-500">{p}</span>
        </div>
      ))}
    </div>
  )
}
