'use client'

import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'motion/react'
import { Surface } from '@/components/stepwise/primitives/surface'
import { cn } from '@/lib/utils/cn'

export type CarouselPattern = 'deck' | 'helix' | 'marquee'

export interface CarouselItem {
  src: string
  alt?: string
}

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items: CarouselItem[]
  /** Travel path. Default `helix`. */
  pattern?: CarouselPattern
  /** Seconds for one full cycle. Deck: seconds per card. */
  duration?: number
  reverse?: boolean
  /** Pause while the stage is hovered. Default true. Deck fans instead. */
  pauseOnHover?: boolean
  /** Tile width in px. */
  itemSize?: number
  /** Gap between marquee tiles, px. Default 20. */
  gap?: number
  /** Helix radius, px. */
  radius?: number
  /** Optional centre copy. */
  children?: ReactNode
}

const DEFAULTS: Record<CarouselPattern, { duration: number; itemSize: number; radius: number }> = {
  helix:   { duration: 32, itemSize: 68,  radius: 132 },
  deck:    { duration: 3.2, itemSize: 144, radius: 0 },
  marquee: { duration: 40, itemSize: 84,  radius: 0 },
}

const DECK_SPRING = { type: 'spring' as const, stiffness: 380, damping: 34, mass: 0.9 }
const ICON_SPRING = { type: 'spring' as const, duration: 0.3, bounce: 0 }

function Tile({
  item, size, radius = 14, ratio = 1, index, total, interactive = true, active, onSelect, className, style,
}: {
  item: CarouselItem
  size: number
  radius?: number
  ratio?: number
  index?: number
  total?: number
  interactive?: boolean
  active?: boolean
  onSelect?: () => void
  className?: string
  style?: CSSProperties
}) {
  const h = Math.round(size * ratio)
  const labelled = index !== undefined && total !== undefined
  return (
    <Surface
      radius={radius}
      role={labelled ? 'group' : undefined}
      aria-roledescription={labelled ? 'slide' : undefined}
      aria-label={labelled ? `${index + 1} of ${total}` : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={onSelect ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect() } } : undefined}
      className={cn(
        'group shrink-0 overflow-hidden bg-zinc-100',
        'shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_20px_-6px_rgba(0,0,0,0.28)]',
        'dark:bg-zinc-800 dark:shadow-[0_1px_2px_rgba(0,0,0,0.35),0_12px_28px_-8px_rgba(0,0,0,0.65)]',
        interactive && 'transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        interactive && 'hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_14px_28px_-8px_rgba(0,0,0,0.38)]',
        interactive && 'hover:-translate-y-0.5',
        onSelect && 'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-sky-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950',
        active && 'ring-2 ring-sky-500/90 ring-offset-2 ring-offset-zinc-50 dark:ring-offset-zinc-950',
        className,
      )}
      style={{ width: size, height: h, ...style }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.src}
        alt={item.alt ?? ''}
        width={size}
        height={h}
        draggable={false}
        className={cn(
          'h-full w-full object-cover outline outline-1 -outline-offset-1 outline-black/[0.08] dark:outline-white/[0.1]',
          interactive && 'transition-[filter,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-[1.03] group-hover:scale-[1.02]',
        )}
      />
    </Surface>
  )
}

function Center({ children, veil = false, style }: { children?: ReactNode; veil?: boolean; style?: CSSProperties }) {
  if (!children) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8 text-center" style={style}>
      <div
        className={cn(
          'pointer-events-auto max-w-[min(100%,280px)] [text-wrap:balance]',
          veil && 'rounded-2xl border border-zinc-200/60 bg-white/85 px-5 py-3.5 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.2)] backdrop-blur-md dark:border-zinc-700/50 dark:bg-zinc-950/80',
        )}
      >
        {children}
      </div>
    </div>
  )
}

function PauseButton({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  const reduce = useReducedMotion()
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={paused ? 'Play rotation' : 'Pause rotation'}
      className={cn(
        'ax-c-pause absolute bottom-3 right-3 z-30 flex h-9 w-9 items-center justify-center',
        'rounded-full border border-zinc-200/80 bg-white/92 text-zinc-600',
        'shadow-[0_1px_2px_rgba(0,0,0,0.05),0_6px_14px_-6px_rgba(0,0,0,0.2)]',
        'backdrop-blur-sm dark:border-zinc-700/70 dark:bg-zinc-900/92 dark:text-zinc-300',
        'transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:opacity-100 active:scale-[0.96] motion-reduce:active:scale-100',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:focus-visible:outline-sky-400',
        'opacity-85',
      )}
    >
      <span className="relative flex h-3 w-3 items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          {paused ? (
            <motion.svg
              key="play"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="currentColor"
              aria-hidden
              className="absolute translate-x-[1px]"
              initial={reduce ? false : { opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
              transition={ICON_SPRING}
            >
              <path d="M3 1.6v8.8L11 6 3 1.6z" />
            </motion.svg>
          ) : (
            <motion.svg
              key="pause"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="currentColor"
              aria-hidden
              className="absolute"
              initial={reduce ? false : { opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
              transition={ICON_SPRING}
            >
              <rect x="2.2" y="2" width="2.4" height="8" rx="0.6" />
              <rect x="7.4" y="2" width="2.4" height="8" rx="0.6" />
            </motion.svg>
          )}
        </AnimatePresence>
      </span>
    </button>
  )
}

function Helix({ items, size, radius, reverse, children }: {
  items: CarouselItem[]; size: number; radius: number; reverse?: boolean; children?: ReactNode
}) {
  const photos = items.slice(0, 8)
  const n = photos.length
  const pitch = 26
  const turns = 1.1
  const h = 380
  const tileH = Math.round(size * 1.18)

  return (
    <div
      className="relative mx-auto w-full max-w-[420px]"
      style={{ height: h, perspective: 1200 }}
    >
      <Center veil={Boolean(children)}>{children}</Center>
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]">
        <div
          className={cn('ax-c-anim ax-c-helix absolute left-1/2 top-1/2', reverse && 'ax-c-reverse')}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {photos.map((item, i) => {
            const angle = (360 * turns * i) / n
            const y = (i - (n - 1) / 2) * pitch
            return (
              <div
                key={i}
                className="absolute [backface-visibility:hidden]"
                style={{
                  marginLeft: -size / 2,
                  marginTop: -tileH / 2,
                  transform: `rotateY(${angle}deg) translateZ(${radius}px) translateY(${y}px)`,
                }}
              >
                <Tile item={item} size={size} radius={14} ratio={1.18} index={i} total={n} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function MarqueeLane({ items, size, gap, reverse }: {
  items: CarouselItem[]; size: number; gap: number; reverse?: boolean
}) {
  return (
    <div className={cn('ax-c-anim ax-c-marquee flex w-max items-center', reverse && 'ax-c-reverse')}>
      {[0, 1].map((copy) => (
        <div
          key={copy}
          className="flex shrink-0 items-center"
          style={{ gap, paddingInlineEnd: gap }}
          aria-hidden={copy === 1 ? true : undefined}
        >
          {items.map((item, i) => (
            <Tile
              key={`${copy}-${i}`}
              item={item}
              size={size}
              radius={14}
              ratio={1.24}
              index={i}
              total={items.length}
              interactive={copy === 0}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function Marquee({ items, size, gap, reverse, children }: {
  items: CarouselItem[]; size: number; gap: number; reverse?: boolean; children?: ReactNode
}) {
  return (
    <div className="relative w-full overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <MarqueeLane items={items} size={size} gap={gap} reverse={reverse} />
      {children && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[radial-gradient(ellipse_80%_70%_at_center,var(--ax-c-veil)_0%,transparent_68%)]">
          <div className="pointer-events-auto max-w-[min(100%,280px)] px-6 text-center [text-wrap:balance]">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

function deckPose(i: number, n: number, fanned: boolean, front: number) {
  const mid = (n - 1) / 2
  if (fanned) {
    const t = mid === 0 ? 0 : (i - mid) / mid
    return {
      x: t * 88,
      y: Math.abs(t) * 12,
      rotate: t * 20,
      scale: 1,
      opacity: 1,
      z: n - Math.abs(i - Math.round(mid)),
    }
  }
  const d = (i - front + n) % n
  if (d > 4) {
    return { x: 0, y: 18, rotate: 0, scale: 0.92, opacity: 0, z: 0 }
  }
  return {
    x: 0,
    y: d * 4.5,
    rotate: d * -2.2,
    scale: 1 - d * 0.028,
    opacity: 1 - d * 0.1,
    z: 10 - d,
  }
}

function Deck({ items, size, playing, duration, reverse, fanned, onFrontChange, children }: {
  items: CarouselItem[]
  size: number
  playing: boolean
  duration: number
  reverse?: boolean
  fanned: boolean
  onFrontChange?: (i: number) => void
  children?: ReactNode
}) {
  const photos = items.slice(0, 7)
  const n = photos.length
  const [front, setFront] = useState(0)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    if (!playing || fanned || pinned || n < 2) return
    const id = window.setInterval(() => {
      setFront(f => (reverse ? (f - 1 + n) % n : (f + 1) % n))
    }, duration * 1000)
    return () => window.clearInterval(id)
  }, [playing, fanned, pinned, n, duration, reverse])

  useEffect(() => { onFrontChange?.(front) }, [front, onFrontChange])

  const choose = (i: number) => { setFront(i); setPinned(true) }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (n < 2) return
    if (e.key === 'ArrowLeft')  { e.preventDefault(); choose((front - 1 + n) % n) }
    if (e.key === 'ArrowRight') { e.preventDefault(); choose((front + 1) % n) }
    if (e.key === 'Home')       { e.preventDefault(); choose(0) }
    if (e.key === 'End')        { e.preventDefault(); choose(n - 1) }
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[520px] outline-none"
      style={{ height: Math.round(size * 1.65) }}
      tabIndex={n > 1 ? 0 : undefined}
      role={n > 1 ? 'group' : undefined}
      aria-label={n > 1 ? 'Use arrow keys to browse' : undefined}
      onKeyDown={onKeyDown}
    >
      <Center
        veil
        style={{
          opacity: fanned ? 0 : 1,
          transition: 'opacity 280ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {children}
      </Center>
      {photos.map((item, i) => {
        const p = deckPose(i, n, fanned, front)
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-[10%]"
            style={{ marginLeft: -size / 2, zIndex: p.z }}
            initial={false}
            animate={{ x: p.x, y: p.y, rotate: p.rotate, scale: p.scale, opacity: p.opacity }}
            transition={DECK_SPRING}
          >
            <Tile
              item={item}
              size={size}
              radius={14}
              ratio={1.28}
              index={i}
              total={n}
              active={i === front}
              onSelect={() => choose(i)}
            />
          </motion.div>
        )
      })}
    </div>
  )
}

/**
 * Images on a loop — a helix, a peeling deck that fans on hover, or a marquee.
 * Pass children for centre copy.
 */
export function Carousel({
  items,
  pattern = 'helix',
  duration,
  reverse = false,
  pauseOnHover = true,
  itemSize,
  gap = 20,
  radius,
  children,
  className,
  style,
  ...props
}: CarouselProps) {
  const d = DEFAULTS[pattern]
  const dur = duration ?? d.duration
  const size = itemSize ?? d.itemSize
  const r = radius ?? d.radius
  const reduce = useReducedMotion()
  const [paused, setPaused] = useState<boolean | null>(null)
  const [hover, setHover] = useState(false)
  const [front, setFront] = useState(0)
  const isPaused = paused ?? !!reduce
  const frozen = isPaused || (pattern !== 'deck' && pauseOnHover && hover)

  if (items.length === 0) return null

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={props['aria-label'] ?? 'Image carousel'}
      data-paused={frozen ? 'true' : 'false'}
      className={cn('ax-c group relative w-full', className)}
      style={{ '--ax-c-dur': `${dur}s`, ...style } as CSSProperties}
      {...props}
    >
      <div
        className="ax-c-stage"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={pattern}
            initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduce ? undefined : { opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {pattern === 'helix' && (
              <Helix items={items} size={size} radius={r} reverse={reverse}>{children}</Helix>
            )}
            {pattern === 'marquee' && (
              <Marquee items={items} size={size} gap={gap} reverse={reverse}>{children}</Marquee>
            )}
            {pattern === 'deck' && (
              <Deck
                items={items}
                size={size}
                playing={!isPaused}
                duration={dur}
                reverse={reverse}
                fanned={hover && !reduce}
                onFrontChange={setFront}
              >
                {children}
              </Deck>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {pattern === 'deck' && items.length > 1 && (
        <span className="sr-only" aria-live="polite">{`Slide ${front + 1} of ${Math.min(items.length, 7)}`}</span>
      )}
      <PauseButton paused={isPaused} onToggle={() => setPaused(!isPaused)} />
    </div>
  )
}
