'use client'

import { cn } from '@/lib/utils/cn'

export interface ShimmerTextProps {
  /** Text to shimmer. Must be a plain string — it is mirrored into data-text. */
  children  : string
  /** Sweep duration in seconds. Default 2. */
  duration? : number
  /** Width of the highlight band as a % of the text width. Default 300. */
  band?     : number
  className?: string
}

/**
 * Pure-CSS shimmer — the "AI is thinking / generating" label. A highlight band
 * sweeps across muted text on an infinite loop. Colors adapt to light/dark via
 * the --shimmer-base / --shimmer-highlight tokens in globals.css. No JS runs.
 */
export function ShimmerText({ children, duration, band, className }: ShimmerTextProps) {
  return (
    <span
      className={cn('t-shimmer', className)}
      data-text={children}
      style={{
        ...(duration ? { ['--shimmer-dur' as string]: `${duration}s` } : {}),
        ...(band ? { ['--shimmer-band' as string]: `${band}%` } : {}),
      }}
    >
      {children}
    </span>
  )
}
