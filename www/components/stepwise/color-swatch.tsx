'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ColorSwatchProps {
  /** The selectable colors - any CSS color. */
  colors: string[]
  value?: string
  defaultValue?: string
  onChange?: (color: string) => void
  /** Circle diameter in px. Default 26. */
  size?: number
  /** Optional labels announced to screen readers, parallel to `colors`. */
  labels?: string[]
  className?: string
}

/**
 * A row of colour circles with a single active selection. The selected swatch
 * draws a ring in its own colour while the inner circle shrinks to make room,
 * so the footprint stays the same and nothing shifts around it.
 */
export function ColorSwatch({
  colors,
  value,
  defaultValue,
  onChange,
  size = 26,
  labels,
  className,
}: ColorSwatchProps) {
  const [internal, setInternal] = useState(defaultValue ?? colors[0])
  const active = value ?? internal

  const select = (c: string) => {
    if (value === undefined) setInternal(c)
    onChange?.(c)
  }

  return (
    <div className={cn('flex items-center gap-3', className)} role="radiogroup">
      {colors.map((c, i) => {
        const isActive = c === active
        return (
          <button
            key={c + i}
            role="radio"
            aria-checked={isActive}
            aria-label={labels?.[i] ?? c}
            onClick={() => select(c)}
            className={cn(
              'relative shrink-0 rounded-full outline-none',
              'transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
              'hover:scale-110 focus-visible:scale-110 active:scale-95',
            )}
            style={{ width: size, height: size }}
          >
            {/* ring - same colour as the swatch, at the footprint edge; fades in on select */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-full transition-opacity duration-200 ease-out"
              style={{ boxShadow: `inset 0 0 0 2px ${c}`, opacity: isActive ? 1 : 0 }}
            />
            {/* inner colour - shrinks in when selected to reveal the ring; size never grows */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-full transition-transform duration-200 ease-[cubic-bezier(0.34,1.35,0.64,1)]"
              style={{
                background: c,
                transform: isActive ? 'scale(0.7)' : 'scale(1)',
                boxShadow: isActive ? 'none' : 'inset 0 0 0 1px rgba(0,0,0,0.1)',
              }}
            />
          </button>
        )
      })}
    </div>
  )
}
