'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface DiagonalLinesProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Direction of lean. Default 'right'. */
  variant?: 'left' | 'right'
  /** Pattern tile size in px. Default 24. */
  size?: number
  /** Fade the pattern out toward the edges. Default true. */
  faded?: boolean
}

/**
 * Diagonal hairlines for section backgrounds. Absolutely positioned to fill
 * its nearest positioned ancestor — give the parent `relative` and a height.
 */
export const DiagonalLines = React.forwardRef<HTMLDivElement, DiagonalLinesProps>(
  ({ className, style, variant = 'right', size = 24, faded = true, ...props }, ref) => {
    const patternId = React.useId()
    const cx = size / 2
    const cy = size / 2
    const rotate = variant === 'left' ? -45 : 45

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
        <svg className="absolute inset-0 h-full w-full text-zinc-200/50 dark:text-zinc-800">
          <defs>
            <pattern
              id={patternId}
              width={size}
              height={size}
              patternUnits="userSpaceOnUse"
              patternTransform={`rotate(${rotate}, ${cx}, ${cy})`}
            >
              <line x1={cx} y1="0" x2={cx} y2={size} stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
    )
  }
)
DiagonalLines.displayName = 'DiagonalLines'
