'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@hugeicons/core-free-icons'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Separator } from '@/components/stepwise/separator'
import { cn } from '@/lib/utils/cn'

export interface TableColumn<T = Record<string, unknown>> {
  key      : keyof T | string
  header   : string
  width?   : string
  className?: string
  render?  : (value: unknown, row: T, index: number) => React.ReactNode
  /** Let cell content wrap across lines instead of truncating with an ellipsis. */
  wrap?    : boolean
}

export interface TableProps<T = Record<string, unknown>> {
  columns    : TableColumn<T>[]
  rows       : T[]
  getKey?    : (row: T, index: number) => string | number
  /** Rows per page. Omit for no pagination. */
  pageSize?  : number
  /** Controlled page (1-indexed). Omit to let the table manage it. */
  page?      : number
  onPageChange?: (page: number) => void
  /** Customise the footer read-out. Default "Page x of y". */
  pageLabel? : (page: number, pages: number) => React.ReactNode
  /** Overrides the auto gridTemplateColumns derived from column widths. */
  gridCols?  : string
  minWidth?  : string
  className? : string
  /** Extra classes on each row div. */
  rowClass?  : (row: T, index: number) => string
}

const LIST_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
} satisfies Record<string, object>
const ROW_VARIANTS = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] as const } },
} satisfies Record<string, object>

// Fade mask on whichever edges still have hidden content — only shows the
// cue when there's actually something to scroll to, in either direction.
function edgeMask(left: boolean, right: boolean) {
  if (!left && !right) return undefined
  if (left && right) return 'linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)'
  if (left) return 'linear-gradient(to right, transparent, black 24px)'
  return 'linear-gradient(to right, black calc(100% - 24px), transparent)'
}

function ArrowBtn({ dir, onClick, disabled }: { dir: 'prev' | 'next'; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous page' : 'Next page'}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-full',
        'text-zinc-500 transition-colors duration-150 dark:text-zinc-400',
        'hover:bg-zinc-200/70 hover:text-zinc-900 dark:hover:bg-zinc-700/70 dark:hover:text-white',
        'active:scale-[0.92] disabled:pointer-events-none disabled:opacity-30',
      )}
    >
      <HugeiconsIcon icon={dir === 'prev' ? ChevronLeftIcon : ChevronRightIcon} size={14} strokeWidth={1.5} color="currentColor" />
    </button>
  )
}

export function Table<T = Record<string, unknown>>({
  columns,
  rows,
  getKey,
  pageSize,
  page,
  onPageChange,
  pageLabel,
  gridCols,
  minWidth = '480px',
  className,
  rowClass,
}: TableProps<T>) {
  const auto = columns.map(c => c.width ?? '1fr').join(' ')
  const template = gridCols ?? auto

  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = useState({ left: false, right: false })

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setScrollState({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    updateScrollState()
    const el = scrollRef.current
    if (!el) return
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => ro.disconnect()
  }, [updateScrollState])

  const [internalPage, setInternalPage] = useState(1)
  const paginated = !!pageSize && rows.length > pageSize
  const pages = paginated ? Math.ceil(rows.length / pageSize!) : 1
  const current = Math.min(page ?? internalPage, pages)

  const goto = (p: number) => {
    const next = Math.max(1, Math.min(pages, p))
    if (page === undefined) setInternalPage(next)
    onPageChange?.(next)
  }

  const visible = paginated
    ? rows.slice((current - 1) * pageSize!, current * pageSize!)
    : rows

  return (
    <div className={cn('relative', className)}>
      <Surface
        ref={scrollRef}
        radius={24}
        className="overflow-x-auto"
        onScroll={updateScrollState}
        style={{ maskImage: edgeMask(scrollState.left, scrollState.right), WebkitMaskImage: edgeMask(scrollState.left, scrollState.right) }}
      >
        <div role="table" style={{ minWidth }}>
          {/* Header */}
          <div
            role="row"
            className="grid rounded-t-[23px] bg-zinc-200 px-6 py-3 dark:bg-zinc-800"
            style={{ gridTemplateColumns: template }}
          >
            {columns.map(col => (
              <span
                key={String(col.key)}
                role="columnheader"
                className={cn('min-w-0 truncate text-[13px] font-semibold text-zinc-800 dark:text-zinc-100', col.className)}
              >
                {col.header}
              </span>
            ))}
          </div>

          {/* Everything below the header lives in one rounded block */}
          <div className="overflow-hidden rounded-b-[23px]">
            {/* Rows — the page cross-fades as one block on page change */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current}
                variants={LIST_VARIANTS}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -4, transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] } }}
              >
                {visible.map((row, i) => {
                  const absIdx = paginated ? (current - 1) * pageSize! + i : i
                  const key = getKey ? getKey(row, absIdx) : absIdx
                  const extra = rowClass?.(row, absIdx) ?? ''
                  const isLast = i === visible.length - 1
                  return (
                    <motion.div
                      key={key}
                      role="row"
                      variants={ROW_VARIANTS}
                      className={cn(
                        'transition-colors duration-150',
                        i % 2 === 0
                          ? 'bg-zinc-50 dark:bg-zinc-900'
                          : 'bg-zinc-100/80 dark:bg-zinc-800/50',
                        'hover:bg-zinc-200/60 dark:hover:bg-zinc-700/30',
                        extra,
                      )}
                    >
                      <div className="grid items-start px-6 py-3.5" style={{ gridTemplateColumns: template }}>
                        {columns.map(col => {
                          const raw = (row as Record<string, unknown>)[String(col.key)]
                          return (
                            <div key={String(col.key)} role="cell" className={cn('min-w-0 text-[13px] leading-snug text-zinc-500 dark:text-zinc-400', col.wrap ? 'text-pretty' : 'truncate', col.className)}>
                              {col.render ? col.render(raw, row, absIdx) : String(raw ?? '')}
                            </div>
                          )
                        })}
                      </div>
                      {!isLast && <Separator className="w-[95%] mx-auto" />}
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>

            {/* Footer — page read-out + arrows */}
            {paginated && (
              <div className="flex items-center justify-between border-t border-zinc-200/70 bg-zinc-50 px-4 py-2.5 dark:border-zinc-700/40 dark:bg-zinc-900">
                <span className="pl-2 text-[12px] tabular-nums text-zinc-400 dark:text-zinc-500">
                  {pageLabel ? pageLabel(current, pages) : `Page ${current} of ${pages}`}
                </span>
                <div className="flex items-center gap-1">
                  <ArrowBtn dir="prev" onClick={() => goto(current - 1)} disabled={current <= 1} />
                  <ArrowBtn dir="next" onClick={() => goto(current + 1)} disabled={current >= pages} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Surface>

      {/* border overlay — outside the squircle clip so it never gets shaved */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ borderRadius: 24, borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--ui-border)' }}
      />
    </div>
  )
}
