'use client'

import { forwardRef, useRef, useState, ButtonHTMLAttributes, ReactNode } from 'react'
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
  /** Rolls the label up on hover to reveal a second row with the icon attached — instead of just showing/hiding the icon in place. */
  slideIcon?: boolean
  iconPosition?: 'left' | 'right'
}

// Same two sizes and typography as Button's own "default"/"lg" steps
// (h-9/text-[14px]/[1.2] and h-10/text-[15px]/[1.2], both tracking-[-0.02em]
// font-medium) — a CTA next to a regular Button should read as the same
// type scale, not its own invented one.
const metrics = {
  default: { h: 36, px: 14, r: 18, text: 14 },
  lg:      { h: 40, px: 16, r: 20, text: 15 },
} as const

// A very low-opacity edge, same middleBorder technique Button uses for its
// own subtle variants — just quieter, since the glow underneath already
// carries the button's visual weight.
const edgeColor = { light: 'rgb(0 0 0 / 6%)', dark: 'rgb(255 255 255 / 6%)' }

/**
 * A single-purpose CTA button — a rainbow glow lives inside the pill along
 * its bottom edge, not a general-purpose Button variant, since no other
 * button in the library needs this geometry.
 */
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
  // No fixed width/height here — sizing the box off `s.text` (the metrics
  // table's own font-size step) broke whenever a caller overrode the font
  // size via `style` (the hero CTA does, 18px vs the "lg" step's 15px),
  // cramming a visually-18px icon into a 15px box. Firefox and Chromium
  // handle that overflow differently (only one of them visibly re-centers
  // it), which is what read as a cross-browser misalignment — it was
  // actually a size mismatch. Sizing to content sidesteps both.
  const iconBox = (node: ReactNode) => (
    <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center leading-none">
      {node}
    </span>
  )

  // Speeds the glow up from wherever it currently sits, instead of via CSS
  // `animation-duration` — changing a running animation's duration keeps its
  // elapsed real time fixed and reinterprets that against the new duration,
  // which snaps the flow to a different point in the loop (reads as
  // restarting). `playbackRate` instead scales how fast time advances from
  // the current position onward, so the color keeps moving continuously.
  const setGlowRate = (rate: number) => {
    glowRef.current?.querySelectorAll('.stepwise-glow-color').forEach(el => {
      el.getAnimations().forEach(a => { a.playbackRate = rate })
    })
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
            // Same inverted-contrast convention as Button's own "solid"
            // variant would use for a primary action — dark fill on a light
            // page, light fill on a dark page — is deliberately NOT what this
            // wants: a hero CTA reads as one consistent object with its own
            // fixed identity, so instead it follows the page's own light/dark
            // surface direction: light bg in light mode, dark bg in dark mode.
            'font-medium tracking-[-0.02em] bg-gradient-to-b from-white to-zinc-100 text-zinc-900',
            'dark:from-zinc-900 dark:to-black dark:text-white',
            'cursor-pointer select-none',
            // No hover:brightness in light mode — it composites onto the
            // glow layers underneath (filter cascades through descendants)
            // and read as the whole button dimming/muddying, not the hover
            // vibrancy this wants. Dark mode's brightness bump already reads
            // fine, so it stays; the glow's own saturate/speed hover below
            // (`.group:hover .stepwise-glow-filter-*`) carries light mode's
            // hover feedback instead.
            'transition-[filter] duration-150 dark:hover:brightness-110',
            fullWidth && 'w-full',
            className,
          )}
          style={{ height: s.h, padding: `0 ${s.px}px`, borderRadius: r, fontSize: s.text, lineHeight: 1.2, ...style }}
          {...props}
        >
          {/* Rainbow inner glow. Every layer's `background` points at the
              same moving gradient (stepwise-glow-color) so they're always
              displaying the identical slice of one continuous rainbow — the
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
              className="stepwise-glow-corner-shape stepwise-glow-corner-shape-left stepwise-glow-color stepwise-glow-filter stepwise-glow-filter-corner mix-blend-normal opacity-[0.62] dark:mix-blend-plus-lighter dark:opacity-[0.88]"
              style={{ '--glow-blur': `${s.h * 0.14}px` } as React.CSSProperties}
            />
            <span
              className="stepwise-glow-corner-shape stepwise-glow-corner-shape-right stepwise-glow-color stepwise-glow-filter stepwise-glow-filter-corner mix-blend-normal opacity-[0.62] dark:mix-blend-plus-lighter dark:opacity-[0.88]"
              style={{ '--glow-blur': `${s.h * 0.14}px` } as React.CSSProperties}
            />
            <span
              className="stepwise-glow-wash-shape stepwise-glow-color stepwise-glow-filter stepwise-glow-filter-wash mix-blend-normal opacity-[0.72] dark:mix-blend-plus-lighter dark:opacity-[0.95]"
              style={{
                left: 0,
                right: 0,
                bottom: -2,
                height: s.h * 0.24 + 2,
                '--glow-blur': `${s.h * 0.12}px`,
              } as React.CSSProperties}
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
              // Text roll: both rows live in one wrapper twice the line height,
              // clipped to a single line by the outer overflow-hidden window —
              // same technique as Button's own slideIcon variant. The mask
              // fades the top/bottom couple px of the clip window so the
              // next/prev row's edge never reads as a hard, visible sliver
              // mid-roll — softer than tightening the easing curve alone.
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
