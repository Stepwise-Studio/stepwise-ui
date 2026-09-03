'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ShimmerTextProps {
  /** Text to shimmer. Must be a plain string - it is rendered twice. */
  children  : string
  /** Sweep duration in seconds. Default 2. */
  duration? : number
  /** Width of the highlight band as a % of the text width. Default 300. */
  band?     : number
  className?: string
}

/* The highlight band, as one gradient per theme. Written out in full rather
 * than built from a token because Tailwind only emits CSS for class names it
 * can read as literal text - and a token in a stylesheet is exactly the kind
 * of thing that does not travel with an installed component. */
const BAND =
  'bg-[linear-gradient(90deg,transparent_0%,transparent_40%,#18181b_50%,transparent_60%,transparent_100%)] ' +
  'dark:bg-[linear-gradient(90deg,transparent_0%,transparent_40%,#fafafa_50%,transparent_60%,transparent_100%)]'

/**
 * A highlight band sweeping across muted text, on a loop - the "thinking" or
 * "generating" label.
 *
 * The text is rendered twice: once as the muted base, and once in an
 * aria-hidden overlay whose own glyphs are transparent and clip the moving
 * gradient (`background-clip: text`). The overlay is a real element rather
 * than a `::before`, because the sweep is animated through the Web Animations
 * API and JavaScript cannot reach a pseudo-element reliably - and driving it
 * from a CSS keyframe would leave the animation behind in a stylesheet the
 * component does not ship with.
 */
export function ShimmerText({ children, duration = 2, band = 300, className }: ShimmerTextProps) {
  const overlay = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = overlay.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const anim = el.animate(
      [{ backgroundPosition: '100% 0' }, { backgroundPosition: '0% 0' }],
      { duration: duration * 1000, iterations: Infinity, easing: 'linear' },
    )
    return () => anim.cancel()
  }, [duration])

  return (
    <span className={cn('relative inline-block text-zinc-400 dark:text-zinc-500', className)}>
      {children}
      <span
        ref={overlay}
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0 bg-no-repeat bg-clip-text text-transparent', BAND)}
        style={{ backgroundSize: `${band}% 100%` }}
      >
        {children}
      </span>
    </span>
  )
}
