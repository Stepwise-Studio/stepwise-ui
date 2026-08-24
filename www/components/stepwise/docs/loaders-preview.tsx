'use client'

import { useState } from 'react'
import { Spinner, SPINNER_ARC_DURATION, type SpinnerStatus, type SpinnerSize } from '@/components/stepwise/spinner'
import { Button } from '@/components/stepwise/button'

/* ── spinner ─────────────────────────────────────────────────────────────── */

const SIZES: SpinnerSize[] = ['sm', 'default', 'lg']

export function SpinnerPreview() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-10">
      {SIZES.map(size => (
        <div key={size} className="flex flex-col items-center gap-3">
          <Spinner size={size} />
          <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">{size}</span>
        </div>
      ))}
    </div>
  )
}

export function SpinnerDotsPreview() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-10">
      {SIZES.map(size => (
        <div key={size} className="flex flex-col items-center gap-3">
          <Spinner variant="dots" size={size} />
          <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">{size}</span>
        </div>
      ))}
    </div>
  )
}

export function SpinnerStatusPreview() {
  const [status, setStatus] = useState<SpinnerStatus>('loading')

  const run = (end: SpinnerStatus) => {
    setStatus('loading')
    setTimeout(() => setStatus(end), SPINNER_ARC_DURATION * 1000)
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <Spinner status={status} size="default" />
      <div className="flex flex-wrap justify-center gap-2">
        <Button size="sm" variant="soft" onClick={() => run('success')}>Resolve ✓</Button>
        <Button size="sm" variant="soft" onClick={() => run('error')}>Reject ✕</Button>
        <Button size="sm" variant="soft" onClick={() => setStatus('loading')}>Spin</Button>
      </div>
    </div>
  )
}
