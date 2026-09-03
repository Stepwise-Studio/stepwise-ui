'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface DottedGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Pattern tile size in px. Default 24. */
  size?: number
  /** Dot radius in px. Default 1.5. */
  dotSize?: number
  /** Fade the pattern out toward the edges. Default true. */
  faded?: boolean
}

/**
 * A static dot grid for section backgrounds. Fills its nearest positioned
 * ancestor, so give the parent `relative` and a height. For the mouse-follow
 * version see `DottedSpotlight`.
 */
export const DottedGrid = React.forwardRef<HTMLDivElement, DottedGridProps>(
  ({ className, style, size = 24, dotSize = 1.5, faded = true, ...props }, ref) => {
    const patternId = React.useId()
    const cx = size / 2
    const cy = size / 2

    const maskStyle = faded
      ? {
          maskImage: 'radial-gradient(ellipse at center, white 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, white 30%, transparent 100%)',
        }
      : {}

    return (
      <div
        ref={ref}
        aria-hidden
        className={cn('absolute inset-0 z-0 h-full w-full pointer-events-none overflow-hidden', className)}
        style={{ ...maskStyle, ...style }}
        {...props}
      >
        <svg className="absolute inset-0 h-full w-full text-zinc-300/60 dark:text-zinc-700/70">
          <defs>
            <pattern id={patternId} width={size} height={size} patternUnits="userSpaceOnUse">
              <circle cx={cx} cy={cy} r={dotSize} fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
    )
  }
)
DottedGrid.displayName = 'DottedGrid'
