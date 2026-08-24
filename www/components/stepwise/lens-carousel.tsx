'use client'

import { useId, useState, type HTMLAttributes } from 'react'
import { useReducedMotion } from 'motion/react'
import { Frame } from '@/components/stepwise/frame'
import { cn } from '@/lib/utils/cn'

export interface LensCarouselItem {
  src: string
  alt?: string
}

export interface LensCarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items: LensCarouselItem[]
  /** Seconds for one full pass. Default 34. */
  duration?: number
  /** Card width in px — constant across the row. Default 116. */
  itemWidth?: number
  /** Tallest card's height ÷ width, at the centre. Default 1.5. */
  maxRatio?: number
  /** Shortest card's height ÷ width, at the rim. Default 0.85. */
  minRatio?: number
  /** Space between cards, px. Default 10. */
  gap?: number
  /**
   * Card-widths from the peak at which a card reaches its shortest — a
   * bigger number spreads the same taper across more cards. Default 4.
   */
  spread?: number
  /** Card corner radius. Default 16. */
  radius?: number
  /** Travel left-to-right instead. */
  reverse?: boolean
  /** Halt travel while the strip is hovered. Default true. */
  pauseOnHover?: boolean
}

/** Sampling resolution of the generated keyframe track. */
const STOPS = 28

/**
 * Photographs sized as if bounded by an ellipse laid over the row — tallest
 * at the centre, tapering toward a shared height at either rim, rather than
 * moving up or down. Two invisible arcs, one above and one below, define the
 * space each card fills.
 *
 * Every card follows one shared path — the same keyframes, offset per card by
 * a negative animation delay so the set spreads evenly along the row. That
 * keeps the whole thing on the compositor with no per-frame JS. Height is
 * driven by `scaleY` on a fixed-size box rather than the `height` property
 * itself, so it animates as a transform, not a layout change.
 *
 * Cards are `Frame`s at a custom size, sharing Arc Carousel's stroke instead
 * of a shadow-only edge.
 */
export function LensCarousel({
  items,
  duration = 34,
  itemWidth = 116,
  maxRatio = 1.5,
  minRatio = 0.85,
  gap = 10,
  spread = 4,
  radius = 16,
  reverse = false,
  pauseOnHover = true,
  className,
  style,
  ...props
}: LensCarouselProps) {
  const reduce = useReducedMotion()
  const [paused, setPaused] = useState<boolean | null>(null)
  const [hover, setHover] = useState(false)
  // useId carries colons, which are not valid in a CSS identifier.
  const uid = `axlns${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  const n = items.length
  const isPaused = paused ?? Boolean(reduce)
  const frozen = isPaused || (pauseOnHover && hover)

  const maxHeight = Math.round(itemWidth * maxRatio)
  const minScale = minRatio / maxRatio
  const spacing = itemWidth + gap
  const span = spacing * n

  // One pass of the shared path. `cards` is x measured in card-widths from
  // the peak, clamped to ±spread and normalised to u ∈ [-1, 1]; the ellipse
  // equation sqrt(1 − u²) gives 1 at the centre and 0 at the rim, so scaleY
  // traces a true elliptical taper rather than a linear one.
  const track = Array.from({ length: STOPS + 1 }, (_, k) => {
    const t = k / STOPS
    const x = (0.5 - t) * span
    const cards = x / spacing
    const u = Math.max(-1, Math.min(1, cards / spread))
    const rim = Math.sqrt(1 - u * u)
    const scaleY = minScale + (1 - minScale) * rim
    return `${(t * 100).toFixed(3)}%{transform:translate(-50%,-50%) translateX(${x.toFixed(2)}px) scaleY(${scaleY.toFixed(4)})}`
  }).join('')

  if (n === 0) return null

  const height = maxHeight + 24

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={props['aria-label'] ?? 'Image carousel'}
      data-paused={frozen ? 'true' : 'false'}
      className={cn(`${uid}-root relative w-full overflow-hidden`, className)}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >
      {/* overflow-hidden hard-clips at the container edge, so the mask has to
          reach full transparency well before that edge — otherwise a card
          gets sliced by a straight cut rather than fading away. */}
      <div
        className="relative [mask-image:linear-gradient(to_right,transparent,transparent_13%,black_28%,black_72%,transparent_87%,transparent)]"
        style={{ height }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className={`${uid}-t`}
            style={{ animationDelay: `${-((i + 0.5) / n) * duration}s` }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}`}
          >
            <Frame
              radius={radius}
              borderWidth={3}
              borderOpacity={1}
              borderColor={`var(--${uid}-stroke)`}
              className="overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.05),0_14px_30px_-12px_rgba(0,0,0,0.32)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.4),0_18px_36px_-14px_rgba(0,0,0,0.7)]"
              style={{ width: itemWidth, height: maxHeight }}
            >
              <img
                src={item.src}
                alt={item.alt ?? ''}
                draggable={false}
                className="h-full w-full select-none object-cover"
              />
            </Frame>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ${uid}{${track}}
        .${uid}-root{--${uid}-stroke:#3f3f46}
        html.dark .${uid}-root{--${uid}-stroke:#d4d4d8}
        .${uid}-t{
          position:absolute;left:50%;top:50%;
          animation:${uid} ${duration}s linear infinite${reverse ? ' reverse' : ''};
          will-change:transform;
        }
        .${uid}-root[data-paused="true"] .${uid}-t{animation-play-state:paused}
        @media (prefers-reduced-motion:reduce){
          .${uid}-root:not([data-paused="false"]) .${uid}-t{animation-play-state:paused}
        }
      `}</style>
    </div>
  )
}
