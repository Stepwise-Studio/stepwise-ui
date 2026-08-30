'use client'

import { useId, useState, useRef, useLayoutEffect, type HTMLAttributes } from 'react'
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
   * Degrees of arc swept across the visible width. The curve is derived from
   * the measured width, so the bow reads identically at any container size.
   * 0 lays the cards out flat. Default 30.
   */
  arc?: number
  /** Card corner radius. Default 18. */
  radius?: number
  /** Travel right-to-left instead. */
  reverse?: boolean
  /** Halt travel while the strip is hovered. Default true. */
  pauseOnHover?: boolean
}

const DEG = Math.PI / 180
/** Keeps the generated arc a minor arc, so large-arc-flag is always 0. */
const MAX_HALF_SWEEP = 80 * DEG

/**
 * Photographs riding a real arc, drifting continuously.
 *
 * The cards ride a **CSS motion path** — one `offset-path` circular arc shared
 * by every card, each parked at a different `offset-distance` via a negative
 * animation delay, so the set spreads evenly along the curve and wraps
 * seamlessly. `offset-rotate: auto` is the whole point: the browser derives
 * each card's angle from the tangent of the path it is actually standing on.
 *
 * That is what the previous hand-rolled version got wrong. It generated
 * keyframes that set `translate()` from one formula and `rotate()` from a
 * different, unrelated one — the tilt was a linear ramp of horizontal
 * position while the drop was a cosine of that ramp. Those two curves only
 * agree at the peak, so every card away from the centre was tilted by an
 * angle the curve underneath it never had, and the strip read as cards
 * floating near an arc rather than sitting on one. Two independent knobs
 * (`arc` and `lift`) for one geometric quantity guaranteed it: on a real
 * curve the tilt *is* the tangent, so depth and angle cannot be set
 * separately. `lift` is gone for that reason — `arc` now drives both.
 *
 * Geometry is derived from the measured width rather than the card count, so
 * the bow looks the same whether there are six photos or sixty, and the path
 * is cut to exactly the viewport plus one card of overscan at each end — the
 * card list is repeated to fill it, so a short `items` array still yields an
 * unbroken strip.
 *
 * Requires `offset-path` (Chrome 46+, Firefox 72+, Safari 16+).
 */
export function ArcCarousel({
  items,
  duration = 38,
  itemWidth = 128,
  ratio = 1.3,
  gap = 10,
  arc = 30,
  radius = 18,
  reverse = false,
  pauseOnHover = true,
  className,
  style,
  ...props
}: ArcCarouselProps) {
  const reduce = useReducedMotion()
  const [hover, setHover] = useState(false)
  const [width, setWidth] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  // useId carries colons, which are not valid in a CSS identifier.
  const uid = `axarc${useId().replace(/[^a-zA-Z0-9]/g, '')}`

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
  const itemHeight = Math.round(itemWidth * ratio)
  const W = Math.max(width, 1)
  const geometryKey = `${W}|${arc}|${itemWidth}|${ratio}|${gap}|${duration}`

  // A CSS animation's clock starts when its element is first rendered, so any
  // re-render that adds a card — the very first measure, or a resize that
  // changes `count` — leaves the newcomers running against a different origin
  // than their neighbours. The set stays evenly spread in *delay* but not in
  // *time*, which shows up as one stubbornly wrong gap travelling around the
  // strip while every other gap is exact. Pinning every card's animation to a
  // single startTime puts the whole set back on one clock.
  useLayoutEffect(() => {
    const el = trackRef.current
    if (!el) return
    const anims = Array.from(el.children).flatMap(c => c.getAnimations())
    if (anims.length < 2) return
    const base = anims.find(a => a.startTime != null)?.startTime ?? document.timeline.currentTime
    anims.forEach(a => { a.startTime = base })
  }, [geometryKey, n])

  // R is set by the width, not the path length, so the visible slice of the
  // circle always sweeps `arc` degrees no matter how long the strip is.
  const arcRad = Math.max(arc, 0) * DEG
  const nominal = itemWidth + gap
  const seed = Math.max(2, Math.ceil((W + nominal * 2) / nominal)) * nominal
  let R = arcRad > 1e-4 ? W / arcRad : 0
  if (R > 0 && seed / (2 * R) > MAX_HALF_SWEEP) R = seed / (2 * MAX_HALF_SWEEP)

  // Cards sit perpendicular to the radius, so neighbours fan out from a
  // centre below the arc: their inner (lower) corners converge while the
  // outer ones splay open. That means centre-to-centre distance is NOT the
  // clearance — pitching the cards a flat `itemWidth + gap` apart delivers
  // that gap only at the card's mid-line, and at the inner edge it collapses
  // to about a pixel, which is why neighbours read as touching while the
  // gap above them stayed obvious. Dividing by the fan factor solves for the
  // pitch that puts `gap` at the *closest* point instead, so the tightest
  // clearance is uniform and is the number that was actually asked for.
  const fan = R > 0 ? Math.max(0.55, 1 - itemHeight / (2 * R)) : 1
  const spacing = nominal / fan

  // Enough cards to cover the viewport plus one entering and one leaving.
  // `offset-distance` is measured in path length, so cards spaced evenly in
  // distance are spaced evenly along the curve — which means the path length
  // has to be an exact multiple of the card pitch.
  const count = Math.max(2, Math.ceil((W + spacing * 2) / spacing))
  const pathLen = count * spacing

  const halfSweep = R > 0 ? pathLen / (2 * R) : 0
  const chordHalf = R > 0 ? R * Math.sin(halfSweep) : pathLen / 2
  const sagitta   = R > 0 ? R * (1 - Math.cos(halfSweep)) : 0

  // The deepest / most tilted a card can be while still on screen — the box
  // only has to be tall enough for those, not for the ones the mask has
  // already faded out past the edges.
  const uEdge = Math.min(W / 2 + itemWidth / 2, chordHalf)
  const edgeDrop = R > 0 ? R - Math.sqrt(Math.max(0, R * R - uEdge * uEdge)) : 0
  const edgeTilt = R > 0 ? Math.asin(Math.min(1, uEdge / R)) : 0
  const rotH = itemHeight * Math.cos(edgeTilt) + itemWidth * Math.sin(edgeTilt)

  const peakY = rotH / 2 + 6
  const endY  = peakY + sagitta
  const height = Math.round(peakY + edgeDrop + rotH / 2 + 6)

  const x0 = W / 2 - chordHalf
  const x1 = W / 2 + chordHalf
  // sweep-flag 1 walks the circle in the increasing-angle direction, which
  // with y pointing down is the arc that bows upward; large-arc-flag stays 0
  // because MAX_HALF_SWEEP keeps this a minor arc.
  const d = R > 0
    ? `M ${x0.toFixed(2)} ${endY.toFixed(2)} A ${R.toFixed(2)} ${R.toFixed(2)} 0 0 1 ${x1.toFixed(2)} ${endY.toFixed(2)}`
    : `M ${x0.toFixed(2)} ${peakY.toFixed(2)} L ${x1.toFixed(2)} ${peakY.toFixed(2)}`

  if (n === 0) return null

  const frozen = Boolean(reduce) || (pauseOnHover && hover)

  return (
    <div
      ref={rootRef}
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
      {/* overflow-hidden hard-clips at the container edge, so the mask reaches
          fully transparent exactly AT that edge rather than short of it: a card
          is already invisible by the time the clip would slice it, and the strip
          gets the container's whole width instead of sitting inside a dead
          margin of its own making. */}
      <div
        ref={trackRef}
        className="relative [mask-image:linear-gradient(to_right,transparent,black_9%,black_91%,transparent)]"
        style={{ height, opacity: width ? undefined : 0 }}
      >
        {Array.from({ length: count }, (_, i) => {
          const item = items[i % n]
          return (
            <div
              key={i}
              className={`${uid}-t`}
              style={{ animationDelay: `${(-(i / count) * duration).toFixed(3)}s` }}
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
          )
        })}
      </div>

      <style>{`
        @keyframes ${uid}{from{offset-distance:0%}to{offset-distance:100%}}
        .${uid}-root{--${uid}-stroke:#3f3f46}
        html.dark .${uid}-root{--${uid}-stroke:#d4d4d8}
        .${uid}-t{
          position:absolute;top:0;left:0;
          offset-path:path("${d}");
          offset-rotate:auto;
          offset-anchor:50% 50%;
          animation:${uid} ${duration}s linear infinite${reverse ? ' reverse' : ''};
          will-change:offset-distance;
        }
        .${uid}-root[data-paused="true"] .${uid}-t{animation-play-state:paused}
      `}</style>
    </div>
  )
}
