'use client'

import { forwardRef, useCallback, useEffect, useRef, useState, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Cap the height and scroll vertically past it. */
  maxHeight?: number | string
  /** Cap the width and scroll horizontally past it - for axis="x" or "both". */
  maxWidth?: number | string
  /** Scroll axis. Default 'y'. */
  axis?: 'y' | 'x' | 'both'
  /** Show the scrollbar rail/thumb instead of scrolling invisibly. Default false. */
  showScrollbar?: boolean
}

// Fixed clearance between the thumb and the parent's rounded corner. Kept
// independent of content padding, so raising it never adds visible gap around
// the content itself.
const INSET = 4
const THICKNESS = 5
const MIN_THUMB = 24
// The bar stays THICKNESS wide but its hit area is padded out to this. A 5px
// target fails the 24px minimum, and an author-drawn control does not get the
// native-scrollbar exemption.
const HIT_THICKNESS = 24

type Track = { size: number; pos: number; visible: boolean }
const HIDDEN: Track = { size: 0, pos: 0, visible: false }

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T) => {
    for (const r of refs) {
      if (!r) continue
      if (typeof r === 'function') r(node)
      else (r as React.MutableRefObject<T | null>).current = node
    }
  }
}

/**
 * A scroll container. Hides the scrollbar by default; pass `showScrollbar` for
 * a slim rounded thumb that darkens on hover and drag.
 *
 * The indicator is drawn rather than native because a real scrollbar's track
 * spans its box corner to corner, which clips into the curve on a
 * squircle-clipped parent. A custom thumb can be inset by a fixed amount that
 * is decoupled from content padding. Scrolling itself stays fully native.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { maxHeight, maxWidth, axis = 'y', showScrollbar, className, style, children, ...props }, ref,
) {
  const innerRef = useRef<HTMLDivElement>(null)
  const wantsY = axis !== 'x'
  const wantsX = axis !== 'y'

  const [trackY, setTrackY] = useState<Track>(HIDDEN)
  const [trackX, setTrackX] = useState<Track>(HIDDEN)
  const [hovering, setHovering] = useState(false)
  const [dragAxis, setDragAxis] = useState<'x' | 'y' | null>(null)
  const track = useRef({ y: trackY, x: trackX })
  track.current = { y: trackY, x: trackX }

  const measure = useCallback(() => {
    const el = innerRef.current
    if (!el) return
    if (wantsY) {
      const { clientHeight: c, scrollHeight: s, scrollTop: t } = el
      if (s <= c) { setTrackY(HIDDEN) }
      else {
        const lane = c - INSET * 2
        const size = Math.max(MIN_THUMB, (c / s) * lane)
        const pos = INSET + (t / (s - c)) * (lane - size)
        setTrackY({ size, pos, visible: true })
      }
    }
    if (wantsX) {
      const { clientWidth: c, scrollWidth: s, scrollLeft: t } = el
      if (s <= c) { setTrackX(HIDDEN) }
      else {
        const lane = c - INSET * 2
        const size = Math.max(MIN_THUMB, (c / s) * lane)
        const pos = INSET + (t / (s - c)) * (lane - size)
        setTrackX({ size, pos, visible: true })
      }
    }
  }, [wantsY, wantsX])

  useEffect(() => {
    const el = innerRef.current
    if (!el || !showScrollbar) return
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    for (const child of el.children) ro.observe(child)
    el.addEventListener('scroll', measure, { passive: true })
    return () => { ro.disconnect(); el.removeEventListener('scroll', measure) }
  }, [measure, showScrollbar, children])

  // Listeners are attached imperatively when the drag starts rather than in an
  // effect: the drag axis lives in a ref, and mutating a ref does not re-run
  // effects, so an effect-based version would never attach them.
  const startDrag = (axisKey: 'x' | 'y') => (e: React.PointerEvent) => {
    e.preventDefault()
    const el = innerRef.current
    if (!el) return
    const startClient = axisKey === 'y' ? e.clientY : e.clientX
    const startScroll = axisKey === 'y' ? el.scrollTop : el.scrollLeft
    setDragAxis(axisKey)

    const onMove = (ev: PointerEvent) => {
      if (axisKey === 'y') {
        const { clientHeight: c, scrollHeight: s } = el
        const lane = c - INSET * 2 - track.current.y.size
        const dy = ev.clientY - startClient
        el.scrollTop = startScroll + (lane > 0 ? (dy / lane) * (s - c) : 0)
      } else {
        const { clientWidth: c, scrollWidth: s } = el
        const lane = c - INSET * 2 - track.current.x.size
        const dx = ev.clientX - startClient
        el.scrollLeft = startScroll + (lane > 0 ? (dx / lane) * (s - c) : 0)
      }
    }
    const onUp = () => {
      setDragAxis(null)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const overflow =
    axis === 'both' ? 'overflow-auto'
    : axis === 'x'  ? 'overflow-x-auto overflow-y-hidden'
    : 'overflow-y-auto overflow-x-hidden'

  return (
    <div
      className="relative h-full"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        ref={mergeRefs(innerRef, ref)}
        tabIndex={0}
        className={cn('ax-scroll ax-scroll-hidden', !maxHeight && 'h-full', overflow)}
        style={{ maxHeight, maxWidth, ...style }}
        {...props}
      >
        {/* padding lives on this inner wrapper, not the scrolling element -
            browsers drop an overflow element's own trailing padding from
            scrollWidth, so a right/bottom pad applied directly here would
            show at the start but vanish at the scrolled-to-end edge. On the
            x axis the wrapper also needs width:max-content: a block div
            defaults to the *container's* width and lets its overflowing
            flex child poke out past its own right edge, so the wrapper's
            padding-right sits at the container edge instead of past the
            real content end. max-content makes the wrapper's own box size
            to that overflowing content, so its padding lands where it should. */}
        <div className={cn(className, axis !== 'y' && 'w-max')}>{children}</div>
      </div>

      {showScrollbar && trackY.visible && (
        <div
          onPointerDown={startDrag('y')}
          className="absolute right-0 flex justify-end cursor-grab active:cursor-grabbing"
          style={{ top: trackY.pos, height: trackY.size, width: HIT_THICKNESS, touchAction: 'none' }}
        >
          <span
            className={cn(
              'ax-scroll-thumb block rounded-full transition-[opacity,background-color] duration-150 ease-out',
              dragAxis === 'y' ? 'opacity-100 is-dragging' : hovering ? 'opacity-100 is-hovering' : 'opacity-0',
            )}
            style={{ width: THICKNESS, height: '100%', marginRight: 1 }}
          />
        </div>
      )}
      {showScrollbar && trackX.visible && (
        <div
          onPointerDown={startDrag('x')}
          className="absolute bottom-0 flex items-end cursor-grab active:cursor-grabbing"
          style={{ left: trackX.pos, width: trackX.size, height: HIT_THICKNESS, touchAction: 'none' }}
        >
          <span
            className={cn(
              'ax-scroll-thumb block rounded-full transition-[opacity,background-color] duration-150 ease-out',
              dragAxis === 'x' ? 'opacity-100 is-dragging' : hovering ? 'opacity-100 is-hovering' : 'opacity-0',
            )}
            style={{ width: '100%', height: THICKNESS, marginBottom: 1 }}
          />
        </div>
      )}

      <style>{`
        .ax-scroll-hidden { scrollbar-width: none; }
        .ax-scroll-hidden::-webkit-scrollbar { display: none; }
        .ax-scroll-thumb { background-color: var(--scrollbar-thumb, rgba(24, 24, 27, 0.22)); }
        .ax-scroll-thumb.is-hovering { background-color: var(--scrollbar-thumb-hover, rgba(24, 24, 27, 0.20)); }
        .ax-scroll-thumb.is-dragging { background-color: var(--scrollbar-thumb-active, #3f3f46); }
        @media (prefers-color-scheme: dark) {
          .ax-scroll-thumb { background-color: var(--scrollbar-thumb, rgba(244, 244, 245, 0.18)); }
          .ax-scroll-thumb.is-hovering { background-color: var(--scrollbar-thumb-hover, rgba(244, 244, 245, 0.20)); }
          .ax-scroll-thumb.is-dragging { background-color: var(--scrollbar-thumb-active, #d4d4d8); }
        }
      `}</style>
    </div>
  )
})
