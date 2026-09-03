'use client'

import { forwardRef, useEffect, useRef, useState, ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { SmoothCorners } from '@lisse/react'
import { cn } from '@/lib/utils/cn'
import { useTheme } from '@/lib/theme'

export type GlowButtonSize = 'default' | 'lg'

export interface GlowButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  size?: GlowButtonSize
  /** Stretches the button to 100% of its parent's width. */
  fullWidth?: boolean
  /** Corner radius in px. Defaults to the size's own step; pass `height / 2` for a full pill. */
  radius?: number
  /** Icon shown on hover, same `slideIcon` roll technique as Button. */
  icon?: ReactNode
  /** Rolls the label up on hover to reveal a second row with the icon. */
  slideIcon?: boolean
  iconPosition?: 'left' | 'right'
}

// Matches Button's "default" and "lg" steps so a CTA next to a regular
// Button reads at the same type scale.
const metrics = {
  default: { h: 36, px: 14, r: 18, text: 14 },
  lg:      { h: 40, px: 16, r: 20, text: 15 },
} as const

// A low-opacity rim rather than a structural border, since the glow already
// carries most of the visual weight. Dark mode needs a stronger value: the
// fill sits against a near-black page, where 6% disappears.
const edgeColor = { light: 'rgb(0 0 0 / 6%)', dark: 'rgb(255 255 255 / 14%)' }

/**
 * A CTA button with a rainbow glow along the inside of its bottom edge.
 * Separate from Button because no other button needs this geometry.
 */
/* ── glow ────────────────────────────────────────────────────────────────────
 * All of this used to live in the site's globals.css, which meant an installed
 * GlowButton rendered with no glow at all - the class names resolved to
 * nothing. It is expressed as inline style and a Web Animations call instead,
 * so the whole effect travels with the component.
 */

/* 4x, not 2x. At 2x the button showed roughly half the spectrum at once, which
 * read as a rainbow decal rather than light: six hues across 230px. At 4x only
 * a quarter is visible, so any frame is two or three neighbouring hues
 * blending, and the full spectrum is something you notice over the loop. */
const GLOW_GRADIENT =
  'linear-gradient(90deg, #ff6b81, #ff9f6b, #f5d778, #6fdfa4, #56b0ef, #8f7bf0, #ff6b81)'
const GLOW_SIZE = '400% 100%'

/* A percentage background-position resolves against (element - image) width, so
 * shifting by exactly one image width - the only offset that loops without a
 * seam - is size / (1 - size). At 4x that is -133.333%, not -400%. */
const GLOW_TRAVEL = '-133.3333% 0'
const GLOW_DURATION_MS = 9000

/** Every layer reads the same moving gradient, so they can never show clashing
 *  hues at their shared edges - there is only one strip of colour being masked
 *  three different ways. */
const glowColor: CSSProperties = {
  backgroundImage: GLOW_GRADIENT,
  backgroundSize: GLOW_SIZE,
}

const maskStack = (...layers: string[]): CSSProperties => ({
  maskImage: layers.join(', '),
  WebkitMaskImage: layers.join(', '),
  maskComposite: 'intersect',
  WebkitMaskComposite: 'source-in',
} as CSSProperties)

/* The vertical stop list is a falloff curve, not a ramp. A single linear fade
 * gave the wash a constant-density body with an even top edge, which read as a
 * strip of tape across the bottom rather than light pooling inside the pill.
 * Horizontally it reaches to 12%/88%: the corners curve away well before 20%,
 * so wider stops ended the light in open space short of the corner. */
const washMask = maskStack(
  'linear-gradient(to top, #000 0%, #000 8%, rgb(0 0 0 / 45%) 34%, rgb(0 0 0 / 16%) 62%, transparent 100%)',
  'linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)',
)

/* The ellipse needs a wide fade band (10% -> 92%) for its curve to have room to
 * round off; a narrow band reads as a hard edge instead of a soft pool. */
const cornerMask = (side: '0%' | '100%') => maskStack(
  'linear-gradient(to top, #000 0%, #000 18%, transparent 60%)',
  `radial-gradient(ellipse 66% 92% at ${side} 100%, #000 0%, #000 10%, transparent 92%)`,
)

const glowFilter = (blur: number, saturate: number): CSSProperties => ({
  filter: `blur(${blur}px) saturate(${saturate})`,
  transition: 'filter 200ms ease-out',
})

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(({
  size = 'default',
  fullWidth = false,
  radius,
  icon,
  slideIcon = false,
  iconPosition = 'left',
  className,
  children,
  style,
  ...props
}, ref) => {
  const s = metrics[size]
  const r = radius ?? s.r
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const glowRef = useRef<HTMLSpanElement>(null)
  const [hovered, setHovered] = useState(false)
  const reduceMotion = useReducedMotion()

  const isSliding = !!icon && slideIcon
  const iconOnLeft = iconPosition === 'left'
  const rowH = Math.round(s.text * 1.2)
  // Sized to its content rather than to the metrics font-size step, so a
  // caller overriding the font size via `style` still gets a matching box.
  const iconBox = (node: ReactNode) => (
    <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center leading-none">
      {node}
    </span>
  )

  // Start the colour flow on each of the three layers. They are created here
  // rather than by a CSS keyframe so nothing has to exist in the host
  // project's stylesheet for the glow to move.
  const glowAnims = useRef<Animation[]>([])
  useEffect(() => {
    if (reduceMotion) return
    const layers = glowRef.current?.querySelectorAll<HTMLElement>('[data-glow-layer]')
    if (!layers) return
    glowAnims.current = [...layers].map(el => el.animate(
      [{ backgroundPosition: '0% 0' }, { backgroundPosition: GLOW_TRAVEL }],
      { duration: GLOW_DURATION_MS, iterations: Infinity, easing: 'linear' },
    ))
    return () => { glowAnims.current.forEach(a => a.cancel()); glowAnims.current = [] }
  }, [reduceMotion])

  // `playbackRate`, not duration: changing the duration of a running animation
  // jumps it to a different point in the loop. Scaling the rate keeps the
  // colour moving forward from wherever it currently is.
  const setGlowRate = (rate: number) => {
    glowAnims.current.forEach(a => { a.playbackRate = rate })
  }

  return (
    <div
      className={cn(
        'group relative origin-center transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.96] motion-reduce:active:scale-100',
        fullWidth ? 'block w-full' : 'inline-flex',
      )}
      style={{ borderRadius: r }}
      onMouseEnter={() => { setGlowRate(1.35); setHovered(true) }}
      onMouseLeave={() => { setGlowRate(1); setHovered(false) }}
    >
      <SmoothCorners
        corners={{ radius: r, smoothing: 0.6 }}
        className={fullWidth ? 'block w-full' : undefined}
        autoEffects={false}
        middleBorder={{ width: 1, opacity: 1, color: isDark ? edgeColor.dark : edgeColor.light }}
      >
        <button
          ref={ref}
          className={cn(
            'relative isolate flex items-center justify-center whitespace-nowrap',
            // Follows the page's light/dark direction (light fill in light mode,
            // dark fill in dark mode) rather than inverting like Button's solid
            // variant, so the CTA keeps one identity across themes.
            'font-medium tracking-[-0.02em] bg-gradient-to-b from-white to-zinc-100 text-zinc-900',
            'dark:from-zinc-800 dark:to-zinc-950 dark:text-white',
            'cursor-pointer select-none',
            // Dark mode only: `filter` cascades into the glow layers, and in
            // light mode brightening them reads as the button muddying. Light
            // mode's hover feedback comes from the glow's own saturate/speed
            // change below instead.
            'transition-[filter] duration-150 dark:hover:brightness-110',
            fullWidth && 'w-full',
            className,
          )}
          style={{ height: s.h, padding: `0 ${s.px}px`, borderRadius: r, fontSize: s.text, lineHeight: 1.2, ...style }}
          {...props}
        >
          {/* Rainbow inner glow. Every layer's `background` points at the
              same moving gradient (stepwise-glow-color) so they're always
              displaying the identical slice of one continuous rainbow - the
              corners and the wash can never show clashing hues, since
              there's only ever one strip of color being read from three
              different masked windows onto it. */}
          <span
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            style={{ borderRadius: r }}
          >
            <span
              data-glow-layer
              className="absolute bottom-0 left-0 mix-blend-normal opacity-[0.62] dark:mix-blend-plus-lighter dark:opacity-[0.88]"
              style={{
                width: '48%', height: '64%',
                ...glowColor,
                ...cornerMask('0%'),
                ...glowFilter(s.h * 0.14, hovered ? 1.55 : 1.3),
              }}
            />
            <span
              data-glow-layer
              className="absolute bottom-0 right-0 mix-blend-normal opacity-[0.62] dark:mix-blend-plus-lighter dark:opacity-[0.88]"
              style={{
                width: '48%', height: '64%',
                ...glowColor,
                ...cornerMask('100%'),
                ...glowFilter(s.h * 0.14, hovered ? 1.55 : 1.3),
              }}
            />
            <span
              data-glow-layer
              className="absolute mix-blend-normal opacity-[0.72] dark:mix-blend-plus-lighter dark:opacity-[0.95]"
              style={{
                left: 0,
                right: 0,
                bottom: -2,
                // Was 0.24 of the height. A band that shallow has nowhere to
                // fall off in, so however the mask is shaped it still reads as
                // a bar with a visible top edge. The extra height is all
                // falloff - the mask keeps the bright part pinned to the
                // bottom edge, so the glow gets softer, not taller.
                height: s.h * 0.30 + 2,
                ...glowColor,
                ...washMask,
                ...glowFilter(s.h * 0.13, hovered ? 1.65 : 1.35),
              }}
            />
          </span>

          {isSliding ? (
            reduceMotion ? (
              <span className="relative z-[1] grid items-center justify-center overflow-hidden">
                <span className="[grid-area:1/1] flex items-center justify-center transition-opacity duration-150 ease-out" style={{ opacity: hovered ? 0 : 1 }}>
                  {children}
                </span>
                <span className="[grid-area:1/1] flex items-center justify-center transition-opacity duration-150 ease-out" style={{ opacity: hovered ? 1 : 0 }}>
                  {iconOnLeft && <span className="flex shrink-0" style={{ marginRight: 8 }}>{iconBox(icon)}</span>}
                  <span>{children}</span>
                  {!iconOnLeft && <span className="flex shrink-0" style={{ marginLeft: 8 }}>{iconBox(icon)}</span>}
                </span>
              </span>
            ) : (
              // Text roll: two rows in a wrapper twice the line height, clipped
              // to one line by the overflow-hidden window. The mask softens the
              // top and bottom few px so the other row never shows a hard edge
              // mid-roll.
              <span
                className="relative z-[1] overflow-hidden"
                style={{
                  height: rowH,
                  maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
                }}
              >
                <motion.span
                  initial={false}
                  className="flex flex-col items-center"
                  animate={{ y: hovered ? '-50%' : '0%' }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="flex items-center justify-center leading-none" style={{ height: rowH }}>{children}</span>
                  <span className="flex items-center justify-center leading-none" style={{ height: rowH }}>
                    {iconOnLeft && <span className="flex shrink-0" style={{ marginRight: 8 }}>{iconBox(icon)}</span>}
                    <span>{children}</span>
                    {!iconOnLeft && <span className="flex shrink-0" style={{ marginLeft: 8 }}>{iconBox(icon)}</span>}
                  </span>
                </motion.span>
              </span>
            )
          ) : (
            <span className="relative z-[1]">{children}</span>
          )}
        </button>
      </SmoothCorners>
    </div>
  )
})

GlowButton.displayName = 'GlowButton'
