'use client'

import { cn } from '@/lib/utils/cn'
import { Surface } from '@/components/stepwise/primitives/surface'

export interface PaginationProps {
  page       : number
  totalPages : number
  onChange   : (page: number) => void
  /** How many siblings to show around the current page. Default 1. */
  siblings?  : number
  className? : string
}

function buildRange(current: number, total: number, siblings: number): (number | '…')[] {
  const left  = Math.max(2, current - siblings)
  const right = Math.min(total - 1, current + siblings)
  const pages: (number | '…')[] = [1]

  if (left > 2) pages.push('…')
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push('…')
  if (total > 1) pages.push(total)

  return pages
}

const BTN = 'inline-flex items-center justify-center w-8 h-8 text-[13px] font-medium transition-colors duration-150 rounded-[8px]'
const GHOST = 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'

export function Pagination({ page, totalPages, onChange, siblings = 1, className }: PaginationProps) {
  const pages = buildRange(page, totalPages, siblings)

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1', className)}>
      {/* Prev */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(BTN, GHOST, 'rounded-full disabled:opacity-30 disabled:pointer-events-none')}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="inline-flex items-center justify-center w-8 h-8 text-[13px] text-zinc-400">
            …
          </span>
        ) : p === page ? (
          <Surface
            key={p}
            radius={8}
            className="inline-flex w-8 h-8 items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[13px] font-semibold tabular-nums"
          >
            {p}
          </Surface>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={cn(BTN, GHOST, 'tabular-nums')}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={cn(BTN, GHOST, 'rounded-full disabled:opacity-30 disabled:pointer-events-none')}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </nav>
  )
}
