'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface ZigzagLinesProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Wave direction. Default 'horizontal'. */
  variant?: 'horizontal' | 'vertical'
  /** Pattern tile size in px. Default 24. */
  size?: number
  /** Fade the pattern out toward the edges. Default true. */
  faded?: boolean
}

/**
 * A zig-zag line pattern for section backgrounds. Absolutely positioned to
 * fill its nearest positioned ancestor — give the parent `relative` and a
 * height.
 */
export const ZigzagLines = React.forwardRef<HTMLDivElement, ZigzagLinesProps>(
  ({ className, style, variant = 'horizontal', size = 24, faded = true, ...props }, ref) => {
    const patternId = React.useId()
    const cx = size / 2
    const cy = size / 2

    const maskStyle = faded
      ? {
          maskImage: 'radial-gradient(ellipse at center, white 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, white 30%, transparent 100%)',
        }
      : {}

    const path =
      variant === 'horizontal'
        ? `M 0 ${size / 4} L ${cx} ${size * 0.5} L ${size} ${size / 4}`
        : `M ${size / 4} 0 L ${size * 0.5} ${cy} L ${size / 4} ${size}`

    return (
      <div
        ref={ref}
        aria-hidden
        className={cn('absolute inset-0 z-0 h-full w-full pointer-events-none overflow-hidden', className)}
        style={{ ...maskStyle, ...style }}
        {...props}
      >
        <svg className="absolute inset-0 h-full w-full text-zinc-200/80 dark:text-zinc-800/80">
          <defs>
            <pattern id={patternId} width={size} height={size} patternUnits="userSpaceOnUse">
              <path d={path} fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
    )
  }
)
ZigzagLines.displayName = 'ZigzagLines'
