'use client'

import { useId, useState, useRef, useEffect, useLayoutEffect, type HTMLAttributes } from 'react'
import { useReducedMotion } from 'motion/react'
import { Frame } from '@/components/stepwise/frame'
import { cn } from '@/lib/utils/cn'

export interface LensCarouselItem {
  src: string
  alt?: string
}

export interface LensCarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items: LensCarouselItem[]
  /** Advance on its own. Default true. */
  autoplay?: boolean
  /** Seconds a card rests before the row advances. Default 2.4. */
  interval?: number
  /** Seconds one slide takes. Default 0.85. */
  transition?: number
  /** Card width at full size, px. Default 124. */
  itemWidth?: number
  /** Card height ÷ width. Default 1.5. */
  ratio?: number
  /** Scale at the centre of the row — the pinch. Default 0.6. */
  minScale?: number
  /** Scale at either rim — the largest cards get on screen. Default 1. */
  maxScale?: number
  /** Space between cards, px. Default 12. */
  gap?: number
  /** Card corner radius. Default 16. */
  radius?: number
  /** Show the prev / next chevrons. Default true. */
  controls?: boolean
  /** Allow dragging the row left and right. Default true. */
  draggable?: boolean
  /** Auto-advance right-to-left instead. */
  reverse?: boolean
  /** Halt auto-advance while the strip is hovered. Default true. */
  pauseOnHover?: boolean
}

/** Resolution of the position -> strip-coordinate integration table. */
const GRID = 400
/** easeInOutCubic — calm to start, calm to land. */
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2)
/** Drag past this many pixels and the pointer-up is a swipe, not a click. */
const DRAG_SLOP = 4

/**
 * Photographs pinched by a lens laid across the row — full size at either
 * rim, shrinking toward the middle, so the strip's top and bottom edges each
 * trace an ellipse arc. (A diverging lens is exactly that shape: thick at the
 * edges, thin through the middle — hence the name.)
 *
 * The taper is literally an ellipse subtracted from the card size:
 * `scale(x) = A − B·√(1 − (x/a)²)`. The √ term is the ellipse's own vertical
 * extent, so what gets removed from each card IS an ellipse, clipped flat
 * once it passes the rim. The curve is anchored to the measured width, so the
 * pinch sits at the centre of the box and full size lands at the rims at any
 * container size.
 *
 * Spacing is the subtle part. Cards cannot be evenly spaced in pixels — a
 * constant pitch would crush the big rim cards together while the small
 * centre ones drift apart. Instead each card advances by its own local
 * PITCH — `scale(x)·itemWidth + gap`, the room that card actually needs —
 * accumulated into a strip coordinate σ where `dx = pitch(x)·dσ`. Cards sit
 * one σ apart, which lands a constant `gap` of clear space between every
 * neighbouring pair no matter how deep into the pinch they are. σ has no
 * closed form, so it is integrated once into a table and inverted by binary
 * search, then reused for both layout and drag.
 *
 * Motion is driven from a single `pos` (the strip offset, in card units)
 * rather than a CSS animation: chevrons, dragging and the auto-advance are
 * three inputs to the same value, which is the only way they can interrupt
 * and hand off to each other cleanly. That costs one rAF loop writing a
 * transform per card — the transforms themselves still composite on the GPU.
 */
export function LensCarousel({
  items,
  autoplay = true,
  interval = 2.4,
  transition = 0.85,
  itemWidth = 124,
  ratio = 1.5,
  minScale = 0.6,
  maxScale = 1,
  gap = 12,
  radius = 16,
  controls = true,
  draggable = true,
  reverse = false,
  pauseOnHover = true,
  className,
  style,
  ...props
}: LensCarouselProps) {
  const reduce = useReducedMotion()
  const [hover, setHover] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [width, setWidth] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  // useId carries colons, which are not valid in a CSS identifier.
  const uid = `axlns${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  // Layout effect, not effect — the width lands before the browser paints, so
  // the strip is never seen stacked at the origin waiting to be measured.
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const n = items.length
  const W = Math.max(width, 1)
  const baseH = Math.round(itemWidth * ratio)
  const lo = Math.min(minScale, maxScale)
  const hi = Math.max(minScale, maxScale)

  // Ellipse semi-axis: pushed half a card past the rim so the curve's steep
  // shoulder sits off screen, where the mask has already faded the cards out.
  const a = W / 2 + itemWidth / 2
  const q = Math.sqrt(Math.max(0, 1 - Math.min(1, (W / 2) / a) ** 2))
  // Solve A − B = lo (centre) and A − B·q = hi (rim) for the ellipse.
  const B = q < 1 ? (hi - lo) / (1 - q) : 0
  const A = lo + B
  const scaleAt = (x: number) => {
    const r = Math.min(1, Math.abs(x) / a)
    return Math.min(hi, A - B * Math.sqrt(Math.max(0, 1 - r * r)))
  }

  // The room one card occupies at x: its own scaled width plus the gap.
  const pitchAt = (x: number) => scaleAt(x) * itemWidth + gap

  // σ(x) = ∫ dx / pitch(x), in card-units, tabulated by trapezoid over a fine
  // grid. Placing cards one σ apart is what holds the gap constant.
  const xMax = W / 2 + itemWidth * hi * 2
  const dx = xMax / GRID
  const sig = new Float64Array(GRID + 1)
  for (let i = 1; i <= GRID; i++) {
    const x0 = (i - 1) * dx
    const x1 = i * dx
    sig[i] = sig[i - 1] + dx * 0.5 * (1 / pitchAt(x0) + 1 / pitchAt(x1))
  }
  const sigmaOf = (x: number) => {
    const i = Math.min(GRID, Math.max(0, Math.floor(Math.abs(x) / dx)))
    const j = Math.min(GRID, i + 1)
    const f = j > i ? (Math.abs(x) - i * dx) / dx : 0
    return Math.sign(x) * (sig[i] + f * (sig[j] - sig[i]))
  }
  const xOf = (s: number) => {
    const sign = s < 0 ? -1 : 1
    const t = Math.abs(s)
    if (t >= sig[GRID]) return sign * (xMax + (t - sig[GRID]) * pitchAt(xMax))
    let l = 0
    let r = GRID
    while (l < r - 1) {
      const m = (l + r) >> 1
      if (sig[m] <= t) l = m
      else r = m
    }
    const f = sig[r] > sig[l] ? (t - sig[l]) / (sig[r] - sig[l]) : 0
    return sign * (l * dx + f * dx)
  }

  // Enough cards to cover the box plus one fully clear of each rim.
  const needed = 2 * sigmaOf(W / 2 + itemWidth * hi)
  const count = Math.max(3, Math.ceil(needed))

  // Writes every card's transform for a given strip offset. Each card wraps
  // into [-count/2, count/2), so the one that falls off the left end
  // reappears at the right — always beyond the rim, never on screen.
  const apply = (pos: number) => {
    for (let i = 0; i < count; i++) {
      const el = cardRefs.current[i]
      if (!el) continue
      const s = (((i - pos + count / 2) % count) + count) % count - count / 2
      const x = xOf(s)
      el.style.transform = `translate(-50%,-50%) translateX(${x.toFixed(2)}px) scale(${scaleAt(x).toFixed(4)})`
    }
  }

  // Everything the rAF loop and the pointer handlers need, refreshed each
  // render so the loop itself never has to be torn down and restarted.
  const cfg = useRef({
    apply, sigmaOf, count,
    interval: 2.4, transition: 0.85, dir: 1,
    autoplay: true, paused: false, reduce: false,
  })
  useLayoutEffect(() => {
    cfg.current = {
      apply, sigmaOf, count,
      interval: Math.max(0.05, interval),
      transition: Math.max(0.05, transition),
      dir: reverse ? -1 : 1,
      autoplay,
      paused: (pauseOnHover && hover) || dragging,
      reduce: Boolean(reduce),
    }
  })

  const posRef = useRef(0)
  const tweenRef = useRef<{ from: number; to: number; start: number; dur: number } | null>(null)
  const nextAtRef = useRef(0)

  const glide = (to: number) => {
    const c = cfg.current
    const from = posRef.current
    if (c.reduce) {
      posRef.current = to
      tweenRef.current = null
      nextAtRef.current = performance.now() + c.interval * 1000
      c.apply(to)
      return
    }
    tweenRef.current = { from, to, start: performance.now(), dur: c.transition * 1000 }
  }
  /** One card forward (1) or back (-1), from wherever the row currently sits. */
  const step = (d: number) => glide(Math.round(posRef.current) + d)

  useEffect(() => {
    if (!width) return
    let live = true
    let raf = 0
    const frame = (now: number) => {
      if (!live) return
      const c = cfg.current
      const tw = tweenRef.current
      if (tw) {
        const p = Math.min(1, (now - tw.start) / tw.dur)
        posRef.current = tw.from + (tw.to - tw.from) * ease(p)
        if (p >= 1) {
          posRef.current = tw.to
          tweenRef.current = null
          nextAtRef.current = now + c.interval * 1000
        }
      } else if (c.autoplay && !c.paused && !c.reduce) {
        if (!nextAtRef.current) nextAtRef.current = now + c.interval * 1000
        else if (now >= nextAtRef.current) glide(Math.round(posRef.current) + c.dir)
      } else {
        nextAtRef.current = 0
      }
      c.apply(posRef.current)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { live = false; cancelAnimationFrame(raf) }
  }, [width, count])

  // Drag: the pointer's own position decides the conversion, so the card
  // under the finger tracks it 1:1 even though the pixel pitch changes across
  // the pinch — σ is the integral of that pitch, which is exactly the
  // quantity that makes the two ends agree.
  const drag = useRef<{ id: number; x0: number; pos0: number; anchor: number; moved: boolean } | null>(null)

  const onDown = (e: React.PointerEvent) => {
    if (!draggable || !width) return
    const box = trackRef.current?.getBoundingClientRect()
    if (!box) return
    tweenRef.current = null
    drag.current = {
      id: e.pointerId,
      x0: e.clientX,
      pos0: posRef.current,
      anchor: e.clientX - box.left - box.width / 2,
      moved: false,
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    setDragging(true)
  }
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dxPx = e.clientX - d.x0
    if (!d.moved && Math.abs(dxPx) > DRAG_SLOP) d.moved = true
    const c = cfg.current
    posRef.current = d.pos0 - (c.sigmaOf(d.anchor + dxPx) - c.sigmaOf(d.anchor))
  }
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    setDragging(false)
    // Settle on whole cards, so the row never rests half way between two.
    glide(Math.round(posRef.current))
  }

  // Trackpad swipes arrive as horizontal wheel deltas, not pointer events —
  // without this, a two-finger swipe does nothing and only the chevrons work.
  // Same σ-anchored math as onMove, just accumulated from a running total
  // instead of a pointer's absolute position.
  const wheel = useRef<{ x: number; pos0: number } | null>(null)
  const wheelSettle = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onWheel = (e: React.WheelEvent) => {
    if (!draggable || !width) return
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
    e.preventDefault()
    tweenRef.current = null
    if (!wheel.current) {
      wheel.current = { x: 0, pos0: posRef.current }
      setDragging(true)
    }
    wheel.current.x += e.deltaX
    const c = cfg.current
    posRef.current = wheel.current.pos0 - (c.sigmaOf(wheel.current.x) - c.sigmaOf(0))
    if (wheelSettle.current) clearTimeout(wheelSettle.current)
    wheelSettle.current = setTimeout(() => {
      wheel.current = null
      setDragging(false)
      glide(Math.round(posRef.current))
    }, 150)
  }
  useEffect(() => () => { if (wheelSettle.current) clearTimeout(wheelSettle.current) }, [])

  if (n === 0) return null

  const height = Math.round(baseH * hi + 20)
  const chevron = 'absolute top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-zinc-200/80 bg-white/85 text-zinc-700 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-600 dark:border-white/10 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white dark:focus-visible:ring-sky-400'

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={props['aria-label'] ?? 'Image carousel'}
      className={cn(`${uid}-root relative w-full overflow-hidden`, className)}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >
      {/* overflow-hidden hard-clips at the container edge, so the mask reaches
          fully transparent exactly AT that edge rather than short of it: a card
          is already invisible by the time the clip would slice it, and the strip
          gets the container's whole width instead of sitting inside a dead
          margin of its own making. */}
      <div
        ref={trackRef}
        className="relative select-none [mask-image:linear-gradient(to_right,transparent,black_9%,black_91%,transparent)]"
        style={{
          height,
          opacity: width ? undefined : 0,
          // pan-y keeps the page scrollable vertically while a horizontal
          // drag belongs to the carousel.
          touchAction: draggable ? 'pan-y' : undefined,
          cursor: draggable ? (dragging ? 'grabbing' : 'grab') : undefined,
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onWheel={onWheel}
      >
        {Array.from({ length: count }, (_, i) => {
          const item = items[i % n]
          return (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el }}
              className="absolute left-1/2 top-1/2 will-change-transform"
              role="group"
              aria-roledescription="slide"
              aria-label={`${(i % n) + 1} of ${n}`}
            >
              <Frame
                radius={radius}
                borderWidth={3}
                borderOpacity={1}
                borderColor={`var(--${uid}-stroke)`}
                className="overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.05),0_14px_30px_-12px_rgba(0,0,0,0.32)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.4),0_18px_36px_-14px_rgba(0,0,0,0.7)]"
                style={{ width: itemWidth, height: baseH }}
              >
                <img
                  src={item.src}
                  alt={item.alt ?? ''}
                  draggable={false}
                  className="h-full w-full select-none object-cover"
                />
              </Frame>
            </div>
          )
        })}
      </div>

      {controls && (
        <>
          <button type="button" aria-label="Previous image" onClick={() => step(-1)} className={cn(chevron, 'left-3')}>
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" aria-label="Next image" onClick={() => step(1)} className={cn(chevron, 'right-3')}>
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      <style>{`
        .${uid}-root{--${uid}-stroke:#3f3f46}
        html.dark .${uid}-root{--${uid}-stroke:#d4d4d8}
      `}</style>
    </div>
  )
}
