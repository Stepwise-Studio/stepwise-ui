'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/cn'

const TRANSITION_MS = 300
const MARK_WIDTH = 28
const GAP = 12

export interface TimelineCheckpoint {
  id       : string
  label    : string
  sublabel?: string
  role?    : 'user' | 'assistant' | 'system'
}

export interface ConversationTimelineProps {
  checkpoints : TimelineCheckpoint[]
  activeId?   : string
  onSelect?   : (id: string) => void
  /** Which side the text sits — 'right' (default) or 'left'. */
  side?       : 'left' | 'right'
  /** Per-row height once expanded (hovering/focusing the rail), in px. Default 24. */
  rowHeight?  : number
  /** Per-row height at rest — just the marks, tightly packed. Default 10. */
  collapsedRowHeight?: number
  /** Rows visible before scrolling. Height = visibleCount * rowHeight. Default 10. */
  visibleCount?: number
  /** Fixed label column width (px) — labels truncate past this. Default 240. */
  labelWidth? : number
  /** Accent colour for the active row's line. Default a sky tone. */
  accent?     : string
  className?  : string
}

/**
 * At rest, a dense rail of thin marks — one per message, tightly packed.
 * Hover or keyboard-focus the rail and it expands into the full labeled
 * list: every row grows to `rowHeight` and its label fades in. Within that
 * expanded state, the row under the cursor still gets its own extra
 * emphasis — its mark brightens, its label bolds and nudges out. Only
 * `visibleCount` rows show at once — the rest scroll.
 */
export function ConversationTimeline({
  checkpoints,
  activeId,
  onSelect,
  side = 'right',
  rowHeight = 24,
  collapsedRowHeight = 10,
  visibleCount = 10,
  labelWidth = 240,
  accent = '#0ea5e9',
  className,
}: ConversationTimelineProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const reduce = useReducedMotion()
  const isRight = side === 'right'

  // Rows resize (10px collapsed -> 24px expanded) while scrolled, which would
  // normally make the same raw scrollTop point at a different row. Track the
  // actual row *element* that's currently at the top, not a pixel offset —
  // computing a target from index * assumed-row-height fights the live
  // in-progress transition (the container and the 20 individually-animating
  // rows don't resize in lockstep, so "achievable scroll range" is a moving,
  // unreliable target). Reading the row's own `offsetTop` instead is always
  // correct no matter how far the transition has progressed, since it's the
  // browser's live layout, not our arithmetic.
  const containerRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([])
  const anchorIndexRef = useRef(0)
  const captureScrollAnchor = () => {
    const el = containerRef.current
    if (!el) return
    const idx = rowRefs.current.findIndex(row => row && row.offsetTop + row.offsetHeight > el.scrollTop)
    anchorIndexRef.current = idx < 0 ? 0 : idx
  }
  useEffect(() => {
    const el = containerRef.current
    const anchor = rowRefs.current[anchorIndexRef.current]
    if (!el || !anchor) return
    const apply = () => { el.scrollTop = anchor.offsetTop }
    apply()
    if (reduce) return
    // Re-apply every frame for the transition's duration, synced to the
    // browser's own paint cycle (rAF) rather than a fixed-interval timer —
    // each frame the anchor's offsetTop has shifted a bit further toward
    // its final value, so re-reading it keeps the view tracking smoothly
    // instead of jumping once at the end or fighting the paint schedule.
    let raf = 0
    const deadline = performance.now() + TRANSITION_MS + 50
    const tick = () => {
      apply()
      if (performance.now() < deadline) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded])

  // Touch has no hover — fall back to always-expanded so labels are reachable at all.
  useEffect(() => {
    const mq = window.matchMedia('(hover: none)')
    setExpanded(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setExpanded(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Height is the only animated dimension — gap and width stay constant so
  // the rail never resizes horizontally (that's what was forcing a
  // horizontal scrollbar) and there's exactly one property fighting layout
  // at a time, which is what actually reads as smooth.
  const transition = reduce ? 'none' : `height ${TRANSITION_MS}ms var(--ease-smooth)`
  // +4px absorbs the hover nudge's translateX so it never clips against the
  // rail's own overflow-x boundary.
  const railWidth = MARK_WIDTH + GAP + labelWidth + 4
  // With the scrollbar hidden there's no native cue that a taller list
  // continues past view — fade the top/bottom edges as the affordance, but
  // only when there's actually more to scroll to.
  const isScrollable = checkpoints.length > visibleCount
  const edgeFade = isScrollable
    ? 'linear-gradient(to bottom, transparent, black 12px, black calc(100% - 12px), transparent)'
    : undefined

  return (
    <div
      ref={containerRef}
      className={cn('no-scrollbar relative flex flex-col overflow-y-auto overflow-x-hidden', className)}
      style={{
        width: railWidth,
        maxHeight: visibleCount * (expanded ? rowHeight : collapsedRowHeight),
        transition,
        // Native scroll anchoring doesn't handle this case (every row resizes
        // at once) and otherwise fights our own re-anchoring above.
        overflowAnchor: 'none',
        WebkitMaskImage: edgeFade,
        maskImage: edgeFade,
      }}
      onMouseEnter={() => { captureScrollAnchor(); setExpanded(true) }}
      onMouseLeave={() => { captureScrollAnchor(); setExpanded(false); setHoveredId(null) }}
      onFocus={() => { captureScrollAnchor(); setExpanded(true) }}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) { captureScrollAnchor(); setExpanded(false) } }}
    >
      {checkpoints.map((cp, i) => {
        const isActive  = cp.id === activeId
        const isHovered = cp.id === hoveredId

        return (
          <button
            key={cp.id}
            ref={el => { rowRefs.current[i] = el }}
            type="button"
            onMouseEnter={() => setHoveredId(cp.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelect?.(cp.id)}
            aria-label={cp.label}
            aria-current={isActive || undefined}
            className={cn(
              'group flex items-center outline-none cursor-pointer shrink-0 active:scale-[0.96] transition-transform',
              'focus-visible:outline-2 focus-visible:outline-offset-2',
              'focus-visible:outline-sky-600 dark:focus-visible:outline-sky-400',
              isRight ? 'flex-row' : 'flex-row-reverse',
            )}
            style={{
              height: expanded ? rowHeight : collapsedRowHeight,
              gap: GAP,
              transition,
            }}
          >
            {/* the mark — fixed length, never moves. Standout comes from
                colour and opacity, not width, so the line stays put on hover. */}
            <span
              className="shrink-0 rounded-full transition-[opacity,background-color] duration-150 ease-out"
              style={{
                height: 2,
                width: 28,
                background: isActive ? accent : 'currentColor',
                opacity: isActive ? 1 : isHovered ? 0.8 : 0.28,
              }}
            />

            {/* the label — invisible at rest (the collapsed row has no room
                for it anyway), fades in once the rail expands. Font-weight
                stays constant (active = medium, rest = normal) so it never
                changes layout width; hover emphasis is colour + a
                post-layout transform only, so it can never nudge the marks. */}
            <span
              className={cn(
                'min-w-0 whitespace-nowrap tracking-[-0.01em] truncate',
                isRight ? 'text-left origin-left' : 'text-right origin-right',
                isActive ? 'font-medium' : 'font-normal',
                isHovered
                  ? 'text-zinc-900 dark:text-white'
                  : isActive
                    ? 'text-zinc-800 dark:text-zinc-100'
                    : 'text-zinc-600 dark:text-zinc-400',
              )}
              style={{
                width: labelWidth,
                fontSize: 13,
                opacity: expanded ? 1 : 0,
                // Nudge only — no scale. Scaling a truncated, fixed-width,
                // edge-clipped label grows its rendered footprint past the
                // rail's own clip boundary and cuts off the ellipsis itself.
                transform: `translateX(${isHovered ? (isRight ? 3 : -3) : 0}px)`,
                // Opacity rides the same pace as the row's expand/collapse
                // (it's part of that motion); colour and the hover nudge are
                // a separate, snappier per-row response — one shared
                // duration for both made the hover feel sluggish.
                transition: reduce
                  ? 'none'
                  : `opacity ${TRANSITION_MS}ms var(--ease-smooth), color 150ms ease-out, transform 150ms ease-out`,
              }}
            >
              {cp.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
