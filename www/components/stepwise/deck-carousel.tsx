'use client'

import { useRef, useState, type HTMLAttributes, type PointerEvent as ReactPointerEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Frame } from '@/components/stepwise/frame'
import { cn } from '@/lib/utils/cn'

export interface DeckCarouselItem {
  src: string
  alt?: string
  /** Shown over the bottom of the card. */
  title?: string
  /** Sits under the title, quieter. */
  subtitle?: string
  /** Small pill in the top corner — a rating, a tag, a price. */
  badge?: string
}

export interface DeckCarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items: DeckCarouselItem[]
  /** Card width in px. Default 190. */
  itemWidth?: number
  /** Card height ÷ width. Default 1.32. */
  ratio?: number
  /** Horizontal step between neighbouring cards, px. Default 84. */
  spread?: number
  /** Rotation added per step out from the front, degrees. Default 7. */
  tilt?: number
  /** Drop added per step out from the front, px. Default 18. */
  lift?: number
  /** Scale removed per step out from the front. Default 0.07. */
  scaleStep?: number
  /** Cards rendered either side of the front one. Default 2. */
  visible?: number
  /** Card corner radius. Default 22. */
  radius?: number
  /** Drag with a pointer or swipe on touch to change cards. Default true. */
  swipeable?: boolean
  /** Wrap around at the ends. Default true. */
  loop?: boolean
  /** Index of the card to open on. Default 0. */
  defaultIndex?: number
  onIndexChange?: (index: number) => void
}

const SPRING = { type: 'spring' as const, stiffness: 320, damping: 34, mass: 0.9 }
const DEG = Math.PI / 180
/** Drag distance that commits to the next card. */
const COMMIT_PX = 50

/**
 * A fanned hand of cards — the front one square on, its neighbours falling
 * away to either side.
 *
 * Browse it by dragging, swiping, clicking a card in the fan, or with the
 * arrow keys. The swipe is tracked with plain pointer events rather than a
 * Framer `drag` gesture bound to the same element the cards animate on:
 * `drag` would move the whole stack's own transform live, and on release its
 * built-in elastic snap-back would run at the same time as our own
 * index-driven spring — two independent animations both racing to settle
 * the same cards, fighting each other into a visibly janky release. Tracking
 * the gesture separately and only ever committing an index change leaves a
 * single spring in charge of every card, always.
 *
 * Cards are `Frame`s at a custom size, so they carry the library's squircle,
 * border, and shadow.
 */
export function DeckCarousel({
  items,
  itemWidth = 190,
  ratio = 1.32,
  spread = 84,
  tilt = 7,
  lift = 18,
  scaleStep = 0.07,
  visible = 2,
  radius = 22,
  swipeable = true,
  loop = true,
  defaultIndex = 0,
  onIndexChange,
  className,
  style,
  ...props
}: DeckCarouselProps) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(defaultIndex)
  const [dragging, setDragging] = useState(false)
  // A drag that moved is not a click — without this, releasing the pointer
  // over a card would also select whatever card it landed on.
  const moved = useRef(false)
  const startX = useRef(0)

  const n = items.length
  if (n === 0) return null

  const go = (next: number) => {
    const i = loop ? (next + n) % n : Math.min(n - 1, Math.max(0, next))
    setActive(i)
    onIndexChange?.(i)
  }

  const itemHeight = Math.round(itemWidth * ratio)
  const height = Math.round(
    itemHeight + visible * lift + itemWidth * Math.sin(visible * tilt * DEG) + 24,
  )

  /** Signed steps from the front card, taking the short way round when looping. */
  const offsetOf = (i: number) => {
    let d = i - active
    if (loop) {
      if (d > n / 2) d -= n
      if (d < -n / 2) d += n
    }
    return d
  }

  const onPointerDown = (e: ReactPointerEvent) => {
    if (!swipeable || n < 2) return
    startX.current = e.clientX
    moved.current = false
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging) return
    if (Math.abs(e.clientX - startX.current) > 4) moved.current = true
  }

  const onPointerUp = (e: ReactPointerEvent) => {
    if (!dragging) return
    setDragging(false)
    const dx = e.clientX - startX.current
    if (dx < -COMMIT_PX) go(active + 1)
    else if (dx > COMMIT_PX) go(active - 1)
    // Cleared after the click that ends the gesture has had a chance to fire.
    requestAnimationFrame(() => { moved.current = false })
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (n < 2) return
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(active - 1) }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1) }
    if (e.key === 'Home')       { e.preventDefault(); go(0) }
    if (e.key === 'End')        { e.preventDefault(); go(n - 1) }
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={props['aria-label'] ?? 'Card carousel'}
      className={cn('relative w-full select-none', className)}
      style={style}
      {...props}
    >
      <div
        className={cn(
          'relative mx-auto touch-pan-y outline-none',
          swipeable && n > 1 && (dragging ? 'cursor-grabbing' : 'cursor-grab'),
        )}
        style={{ height }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        tabIndex={n > 1 ? 0 : undefined}
        role={n > 1 ? 'group' : undefined}
        aria-label={n > 1 ? 'Use the arrow keys to browse cards' : undefined}
        onKeyDown={onKeyDown}
      >
        {items.map((item, i) => {
          const d = offsetOf(i)
          const away = Math.abs(d)
          const hidden = away > visible
          const front = d === 0
          // Fades gradually toward the visibility boundary instead of
          // switching from fully opaque to fully hidden in one step — a
          // binary cutoff makes the outermost visible card look stranded
          // rather than part of the same continuous fan.
          const opacity = hidden ? 0 : 1 - away / (visible + 1)

          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-0"
              style={{ marginLeft: -itemWidth / 2, zIndex: n - away }}
              initial={false}
              animate={{
                x: d * spread,
                y: away * lift,
                rotate: d * tilt,
                scale: 1 - away * scaleStep,
                opacity,
              }}
              transition={reduce ? { duration: 0 } : SPRING}
              aria-hidden={hidden || undefined}
            >
              <Frame
                radius={radius}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}`}
                tabIndex={!front && !hidden ? 0 : undefined}
                onClick={() => { if (!moved.current && !hidden) go(i) }}
                onKeyDown={e => {
                  if (front || hidden) return
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i) }
                }}
                className={cn(
                  'relative overflow-hidden outline-none',
                  front
                    ? 'shadow-[0_4px_10px_rgba(0,0,0,0.07),0_26px_50px_-18px_rgba(0,0,0,0.42)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.45),0_30px_60px_-20px_rgba(0,0,0,0.8)]'
                    : 'shadow-[0_2px_5px_rgba(0,0,0,0.05),0_14px_30px_-14px_rgba(0,0,0,0.3)] dark:shadow-[0_2px_5px_rgba(0,0,0,0.4),0_18px_38px_-16px_rgba(0,0,0,0.7)]',
                  !front && !hidden && 'cursor-pointer',
                  !front && !hidden && 'focus-visible:ring-2 focus-visible:ring-sky-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950',
                )}
                style={{ width: itemWidth, height: itemHeight, pointerEvents: hidden ? 'none' : undefined }}
              >
                <img
                  src={item.src}
                  alt={item.alt ?? ''}
                  draggable={false}
                  className="h-full w-full select-none object-cover"
                />

                {/* Cards behind the front one sit back into the scene. */}
                <div
                  className="pointer-events-none absolute inset-0 bg-zinc-950 transition-opacity duration-300"
                  style={{ opacity: away * 0.1 }}
                />

                {item.badge && (
                  <span className="absolute right-2.5 top-2.5 rounded-full bg-zinc-950/55 px-2 py-0.5 text-[11px] font-medium tabular-nums text-white backdrop-blur-sm">
                    {item.badge}
                  </span>
                )}

                {(item.title || item.subtitle) && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/45 to-transparent px-3.5 pb-3 pt-10">
                    {item.title && (
                      <p className="text-[15px] font-semibold leading-tight tracking-[-0.01em] text-white [text-wrap:balance]">
                        {item.title}
                      </p>
                    )}
                    {item.subtitle && (
                      <p className="mt-0.5 text-[12px] leading-snug text-white/70">{item.subtitle}</p>
                    )}
                  </div>
                )}
              </Frame>
            </motion.div>
          )
        })}
      </div>

      {n > 1 && (
        <span className="sr-only" aria-live="polite">{`Card ${active + 1} of ${n}`}</span>
      )}
    </div>
  )
}
