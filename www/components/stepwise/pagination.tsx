'use client'

import { cn } from '@/lib/utils/cn'
import { Surface } from '@/components/stepwise/primitives/surface'

export interface PaginationProps {
  page       : number
  totalPages : number
  onChange   : (page: number) => void
  /** How many pages to show either side of the current one. Default 1. */
  siblings?  : number
  /** How many pages to pin at each end. Default 1. */
  boundaries?: number
  className? : string
}

type Slot = number | 'start-ellipsis' | 'end-ellipsis'

const range = (start: number, end: number) =>
  Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i)

/**
 * Builds a slot list whose length stays constant while `totalPages` is large
 * enough to fill it, so the pager never changes width as you page through.
 *
 * Clamping the sibling window (`page ± siblings`) would drop slots near either
 * end, since there is nothing to the left of page 1 to render. Instead the
 * window slides inward so it always emits its full width. An ellipsis is also
 * never a spacer: where exactly one page sits between a boundary and the
 * window, that number is rendered in place of the ellipsis.
 *
 * Total slots = 2·boundaries + 2·siblings + 3 (current plus two joiners).
 */
function buildSlots(page: number, total: number, siblings: number, boundaries: number): Slot[] {
  const slotCount = 2 * boundaries + 2 * siblings + 3
  if (total <= slotCount) return range(1, total)

  const startPages = range(1, boundaries)
  const endPages   = range(total - boundaries + 1, total)

  // Slide, don't clip: the lower bound keeps the window off the leading
  // boundary, the upper bound keeps it from running past the trailing one.
  const windowStart = Math.max(
    Math.min(page - siblings, total - boundaries - 2 * siblings - 1),
    boundaries + 2,
  )
  const windowEnd = Math.min(
    Math.max(page + siblings, boundaries + 2 * siblings + 2),
    endPages[0] - 2,
  )

  return [
    ...startPages,
    // A gap of exactly one page is filled with that page, not an ellipsis -
    // "1 … 3" hides nothing and costs the same width as "1 2 3".
    ...(windowStart > boundaries + 2
      ? (['start-ellipsis'] as Slot[])
      : boundaries + 1 < total - boundaries
        ? [boundaries + 1]
        : []),
    ...range(windowStart, windowEnd),
    ...(windowEnd < total - boundaries - 1
      ? (['end-ellipsis'] as Slot[])
      : total - boundaries > boundaries
        ? [total - boundaries]
        : []),
    ...endPages,
  ]
}

const CELL  = 'inline-flex size-8 items-center justify-center text-[13px] font-medium tabular-nums'
const GHOST = 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
const RING  = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400'

function Arrow({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d={dir === 'prev' ? 'M9 3L5 7l4 4' : 'M5 3l4 4-4 4'}
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

export function Pagination({
  page,
  totalPages,
  onChange,
  siblings = 1,
  boundaries = 1,
  className,
}: PaginationProps) {
  const slots = buildSlots(page, totalPages, siblings, boundaries)

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1', className)}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        // A circle needs no corner smoothing - squircle correction only has
        // anything to do at a radius smaller than half the box.
        className={cn(CELL, GHOST, RING, 'cursor-pointer rounded-full transition-colors duration-150 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-30')}
      >
        <Arrow dir="prev" />
      </button>

      {slots.map((slot, i) =>
        typeof slot === 'string' ? (
          <span key={slot + i} className={cn(CELL, 'select-none text-zinc-400 dark:text-zinc-600')} aria-hidden="true">
            …
          </span>
        ) : slot === page ? (
          <Surface
            key={slot}
            radius={10}
            className={cn(CELL, 'bg-zinc-900 font-semibold text-white dark:bg-white dark:text-zinc-900')}
            aria-current="page"
          >
            {slot}
          </Surface>
        ) : (
          <Surface key={slot} radius={10} className="inline-flex">
            <button
              onClick={() => onChange(slot)}
              aria-label={`Go to page ${slot}`}
              className={cn(CELL, GHOST, RING, 'cursor-pointer active:scale-[0.96] transition-[color,transform] duration-150')}
            >
              {slot}
            </button>
          </Surface>
        ),
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={cn(CELL, GHOST, RING, 'cursor-pointer rounded-full transition-colors duration-150 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-30')}
      >
        <Arrow dir="next" />
      </button>
    </nav>
  )
}
