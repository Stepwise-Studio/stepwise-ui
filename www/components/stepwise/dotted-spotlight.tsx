'use client'

import * as React from 'react'
import { useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/cn'

export interface DottedSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Pattern tile size in px. Default 24. */
  size?: number
  /** Dot radius in px. Default 1.5. */
  dotSize?: number
  /** Fade the pattern out toward the edges. Default true. */
  faded?: boolean
  /** Flashlight radius, px. Default 400. */
  radius?: number
}

/**
 * A dot grid with a mouse-follow flashlight — dots brighten near the
 * cursor. Absolutely positioned to fill its nearest positioned ancestor —
 * give the parent `relative` and a height. For the static version, see
 * `DottedGrid`.
 */
export const DottedSpotlight = React.forwardRef<HTMLDivElement, DottedSpotlightProps>(
  ({ className, style, size = 24, dotSize = 1.5, faded = true, radius = 400, ...props }, ref) => {
    const reduce = useReducedMotion()
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })
    const containerRef = React.useRef<HTMLDivElement>(null)
    const patternId = React.useId()
    const basePatternId = `${patternId}-base`
    const hoverPatternId = `${patternId}-hover`
    const cx = size / 2
    const cy = size / 2

    React.useEffect(() => {
      // Reduced motion: skip tracking entirely and let the flashlight layer
      // render at its plain, unmasked opacity instead — no listener needed.
      if (reduce) return
      const handleMouseMove = (e: MouseEvent) => {
        const el = containerRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        // The listener is on `window` (not the container) because this
        // element is pointer-events:none — it can never be the hit-test
        // target for its own mousemove, so a container-scoped listener
        // would just never fire. That means this handler runs on every
        // mouse move anywhere on the page; skip the state update (and the
        // re-render + layout read it would trigger) once the cursor is
        // outside the container, where the flashlight can't be visible.
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) return
        setMousePos({ x, y })
      }
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [reduce])

    const maskStyle = faded
      ? {
          maskImage: 'radial-gradient(ellipse at center, white 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, white 30%, transparent 100%)',
        }
      : {}

    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref]
    )

    return (
      <div
        ref={mergedRef}
        aria-hidden
        className={cn('absolute inset-0 z-0 h-full w-full pointer-events-none overflow-hidden', className)}
        style={{ ...maskStyle, ...style }}
        {...props}
      >
        {/* Base Layer — dim dots, always visible */}
        <svg className="absolute inset-0 h-full w-full text-zinc-300/60 dark:text-zinc-700/50">
          <defs>
            <pattern id={basePatternId} width={size} height={size} patternUnits="userSpaceOnUse">
              <circle cx={cx} cy={cy} r={dotSize} fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${basePatternId})`} />
        </svg>

        {/* Flashlight Layer — brighter dots, masked to the cursor. Under
            reduced motion there's no tracking to mask against, so it's left
            fully visible rather than hidden — a brighter static grid instead
            of a cursor-chasing one. */}
        <svg
          className="absolute inset-0 h-full w-full text-zinc-400 transition-opacity duration-300 dark:text-zinc-500"
          style={
            reduce
              ? undefined
              : {
                  maskImage: `radial-gradient(${radius}px circle at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 100%)`,
                  WebkitMaskImage: `radial-gradient(${radius}px circle at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 100%)`,
                }
          }
        >
          <defs>
            <pattern id={hoverPatternId} width={size} height={size} patternUnits="userSpaceOnUse">
              <circle cx={cx} cy={cy} r={dotSize} fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${hoverPatternId})`} />
        </svg>
      </div>
    )
  }
)
DottedSpotlight.displayName = 'DottedSpotlight'
