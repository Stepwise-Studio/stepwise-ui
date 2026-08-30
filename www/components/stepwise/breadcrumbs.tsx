'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/cn'

export interface BreadcrumbItem {
  label : string
  href? : string
}

export interface BreadcrumbsProps {
  items      : BreadcrumbItem[]
  /** 'slash' renders "/", 'chevron' renders ›. Default 'slash'. */
  separator? : 'slash' | 'chevron'
  /**
   * Collapse the middle of the trail into an expandable "…" once there are
   * more crumbs than this. Set to 0 to never collapse. Default 4.
   */
  maxItems?  : number
  /** Crumbs kept at the head of a collapsed trail. Default 1. */
  itemsBefore?: number
  /** Crumbs kept at the tail of a collapsed trail. Default 2. */
  itemsAfter? : number
  /**
   * Called on crumb click. Calling it prevents the default navigation, so a
   * single-page app (or a docs demo) can drive the trail from state instead
   * of a page load.
   */
  onNavigate?: (item: BreadcrumbItem, index: number) => void
  className? : string
}

const EASE = [0.22, 1, 0.36, 1] as const
const LINK = 'rounded-[4px] text-[13px] tracking-[-0.01em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400'

function Separator({ kind }: { kind: 'slash' | 'chevron' }) {
  return (
    <span className="select-none text-zinc-300 dark:text-zinc-600" aria-hidden="true">
      {kind === 'slash' ? (
        <span className="text-[14px]">/</span>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 2.5L7.5 6l-3 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  )
}

/**
 * A trail that stays one line no matter how deep the hierarchy goes.
 *
 * Past `maxItems`, the middle collapses to a "…" button rather than wrapping
 * to a second line or scrolling sideways — the head and the current page are
 * the two things a breadcrumb exists to show, so those are what survive; the
 * hidden middle is one click away and stays in the DOM order it had, so the
 * expanded trail reads identically to an uncollapsed one.
 *
 * Crumbs animate on change (position via `layout`, enter/exit via a short
 * blur-and-slide) so walking up the trail reads as the tail being removed
 * rather than the whole row silently redrawing.
 */
export function Breadcrumbs({
  items,
  separator = 'slash',
  maxItems = 4,
  itemsBefore = 1,
  itemsAfter = 2,
  onNavigate,
  className,
}: BreadcrumbsProps) {
  const [expanded, setExpanded] = useState(false)
  const reduce = useReducedMotion()

  const collapsible = maxItems > 0 && items.length > maxItems && itemsBefore + itemsAfter < items.length
  const collapsed = collapsible && !expanded

  // A shorter trail (navigating up) must drop the expanded state, or the next
  // deep trail arrives pre-expanded for no reason the user asked for.
  useEffect(() => { if (!collapsible) setExpanded(false) }, [collapsible])

  const head = collapsed ? items.slice(0, itemsBefore) : items
  const tail = collapsed ? items.slice(items.length - itemsAfter) : []
  const hiddenCount = collapsed ? items.length - itemsBefore - itemsAfter : 0

  const motionProps = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit:    { opacity: 0 },
        transition: { duration: 0.15, ease: EASE },
      }
    : {
        initial: { opacity: 0, x: -6, filter: 'blur(2px)' },
        animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
        // Softer than the enter — an exit should get out of the way, not
        // announce itself.
        exit:    { opacity: 0, x: -4, filter: 'blur(2px)', transition: { duration: 0.14, ease: EASE } },
        transition: { duration: 0.24, ease: EASE },
      }

  const crumb = (item: BreadcrumbItem, index: number, isCurrent: boolean) => {
    const interactive = !isCurrent && (item.href || onNavigate)
    if (!interactive) {
      return (
        <span
          className={cn(
            'text-[13px] tracking-[-0.01em]',
            isCurrent ? 'font-medium text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400',
          )}
          aria-current={isCurrent ? 'page' : undefined}
        >
          {item.label}
        </span>
      )
    }
    return (
      <a
        href={item.href ?? '#'}
        onClick={e => {
          if (!onNavigate) return
          e.preventDefault()
          onNavigate(item, index)
        }}
        className={cn(LINK, 'cursor-pointer text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white')}
      >
        {item.label}
      </a>
    )
  }

  const row = (item: BreadcrumbItem, index: number, withSeparator: boolean) => (
    <motion.li key={`${index}-${item.label}`} layout="position" {...motionProps} className="flex items-center gap-1.5">
      {withSeparator && <Separator kind={separator} />}
      {crumb(item, index, index === items.length - 1)}
    </motion.li>
  )

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <AnimatePresence initial={false} mode="popLayout">
          {head.map((item, i) => row(item, i, i > 0))}

          {collapsed && (
            <motion.li key="ellipsis" layout="position" {...motionProps} className="flex items-center gap-1.5">
              <Separator kind={separator} />
              <button
                type="button"
                onClick={() => setExpanded(true)}
                aria-label={`Show ${hiddenCount} hidden ${hiddenCount === 1 ? 'crumb' : 'crumbs'}`}
                aria-expanded={false}
                className={cn(
                  LINK,
                  'cursor-pointer px-1 leading-none text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white',
                )}
              >
                …
              </button>
            </motion.li>
          )}

          {tail.map((item, i) => row(item, items.length - itemsAfter + i, true))}
        </AnimatePresence>
      </ol>
    </nav>
  )
}
