'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/cn'

export type DotGridPattern = 'wave' | 'ripple' | 'snake' | 'random'

export interface DotGridLoaderProps {
  /** How the 3×3 grid animates. Default "wave". */
  pattern?  : DotGridPattern
  /** Dot diameter in px. Default 6. */
  dot?      : number
  /** Gap between dots in px. Default 5. */
  gap?      : number
  /** Seconds per cycle. Default 1.4. */
  duration? : number
  className?: string
}

/** Per-pattern delay (0–1 of the cycle) for cell [row, col]. */
const DELAY: Record<DotGridPattern, (r: number, c: number) => number> = {
  // diagonal sweep
  wave:   (r, c) => (r + c) / 8,
  // out from the centre
  ripple: (r, c) => (Math.abs(r - 1) + Math.abs(c - 1)) / 4,
  // clockwise around the ring, centre last
  snake:  (r, c) => {
    const ring = [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 1], [2, 0], [1, 0]]
    const i = ring.findIndex(([rr, cc]) => rr === r && cc === c)
    return i === -1 ? 1 : i / 8
  },
  // deterministic scatter - stable across renders, unlike Math.random()
  random: (r, c) => ((r * 3 + c) * 5 % 9) / 9,
}

/**
 * A 3×3 grid of dots. Each cell just gets a delay from the chosen pattern, so
 * the same nine dots read as a sweep, a ripple, a chase, or a scatter.
 */
export function DotGridLoader({
  pattern = 'wave',
  dot = 6,
  gap = 5,
  duration = 1.4,
  className,
}: DotGridLoaderProps) {
  const reduce = useReducedMotion()
  const cells = [0, 1, 2].flatMap(r => [0, 1, 2].map(c => [r, c] as const))

  return (
    <span
      className={cn('inline-grid', className)}
      role="status"
      aria-label="Loading"
      style={{ gridTemplateColumns: `repeat(3, ${dot}px)`, gap }}
    >
      {cells.map(([r, c]) => (
        <motion.span
          key={`${r}-${c}`}
          className="rounded-full bg-zinc-900 dark:bg-white"
          style={{ width: dot, height: dot }}
          animate={reduce ? { opacity: 0.4 } : { opacity: [0.15, 1, 0.15], scale: [0.7, 1, 0.7] }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: DELAY[pattern](r, c) * (duration * 0.6),
                }
          }
        />
      ))}
    </span>
  )
}
