'use client'

import { useId, useState, type HTMLAttributes } from 'react'
import { useReducedMotion } from 'motion/react'
import { Frame } from '@/components/stepwise/frame'
import { cn } from '@/lib/utils/cn'

export interface ArcCarouselItem {
  src: string
  alt?: string
}

export interface ArcCarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items: ArcCarouselItem[]
  /** Seconds for one full pass. Default 38. */
  duration?: number
  /** Card width in px. Default 128. */
  itemWidth?: number
  /** Card height ÷ width. Default 1.3. */
  ratio?: number
  /** Space between cards, px. Default 10. */
  gap?: number
  /**
   * Total sweep of the arc in degrees — a card `spread` slots from the peak
   * tilts by half of this. 0 lays the cards out flat. Default 20.
   */
  arc?: number
  /**
   * How far a card `spread` slots from the peak falls below it, px. Negative
   * bows the strip the other way. Default 34.
   */
  lift?: number
  /**
   * Card-widths from the peak at which the arc reaches its full angle —
   * higher spreads the same sweep across more cards for a gentler curve.
   * Default 4.5.
   */
  spread?: number
  /** Card corner radius. Default 18. */
  radius?: number
  /** Travel left-to-right instead. */
  reverse?: boolean
  /** Halt travel while the strip is hovered. Default true. */
  pauseOnHover?: boolean
}

/** Sampling resolution of the generated keyframe track. */
const STOPS = 28
const DEG = Math.PI / 180

/**
 * Photographs riding a shallow arc, drifting continuously.
 *
 * Every card follows one shared path — the same keyframes, offset per card by
 * a negative animation delay so the set spreads evenly along the curve. That
 * keeps the whole thing on the compositor with no per-frame JS, and it means
 * the strip renders in the right place on the very first paint instead of
 * snapping into position once an effect runs.
 *
 * Tilt is driven by each card's distance from the peak in card-widths, not by
 * its raw pixel position. Deriving it from pixels ties the curve's steepness
 * to the measured width of the component, so the same `arc` value reads as a
 * gentle roll on a wide screen and a sharp fan on a narrow one — tying it to
 * `spread` card-widths instead makes the curve read identically everywhere.
 *
 * Each card's delay is centred on half a slot (`(i + 0.5) / n`, not `i / n`)
 * — with an even card count, `i / n` puts every card's phase in the right
 * half of the cycle and none in the left, so the whole set drifts off-centre
 * from the curve's true middle for as long as it runs. The half-slot offset
 * is what actually centres the set, not an approximation of it.
 *
 * Cards are `Frame`s, so they carry the same squircle and resting shadow as
 * every other surface in the library, with a deliberately more visible
 * border than Frame's default hairline — enough to read as a stroke around
 * a photo rather than the faint edge of a UI surface.
 */
export function ArcCarousel({
  items,
  duration = 38,
  itemWidth = 128,
  ratio = 1.3,
  gap = 10,
  arc = 29,
  lift = 49,
  spread = 4.5,
  radius = 18,
  reverse = false,
  pauseOnHover = true,
  className,
  style,
  ...props
}: ArcCarouselProps) {
  const reduce = useReducedMotion()
  const [paused, setPaused] = useState<boolean | null>(null)
  const [hover, setHover] = useState(false)
  // useId carries colons, which are not valid in a CSS identifier.
  const uid = `axarc${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  const n = items.length
  const isPaused = paused ?? Boolean(reduce)
  const frozen = isPaused || (pauseOnHover && hover)

  const itemHeight = Math.round(itemWidth * ratio)
  const spacing = itemWidth + gap
  const span = spacing * n
  const half = arc / 2
  // Normalises the drop so `lift` means the same thing at any arc angle.
  const depth = 1 - Math.cos(half * DEG)

  // One pass of the shared path. Cards enter at +span/2 and leave at -span/2;
  // `cards` is x measured in card-widths from the peak, so tilt depends only
  // on how many slots a card sits from centre, never on pixel position.
  const track = Array.from({ length: STOPS + 1 }, (_, k) => {
    const t = k / STOPS
    const x = (0.5 - t) * span
    const cards = x / spacing
    const theta = Math.max(-half, Math.min(half, (cards / spread) * half))
    const y = depth === 0 ? 0 : lift * ((1 - Math.cos(theta * DEG)) / depth)
    return `${(t * 100).toFixed(3)}%{transform:translate(-50%,-50%) translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${theta.toFixed(3)}deg)}`
  }).join('')

  if (n === 0) return null

  // Rotation and drop both push cards past the plain card box.
  const height = Math.round(
    itemHeight + Math.abs(lift) + itemWidth * Math.sin(Math.abs(half) * DEG) + 36,
  )

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
      {/* overflow-hidden hard-clips at the container edge; the mask has to
          finish fading a card to fully transparent well before that edge, or
          a tilted card gets sliced by a straight vertical cut and reads as
          broken rather than faded away. */}
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
              style={{ width: itemWidth, height: itemHeight }}
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
