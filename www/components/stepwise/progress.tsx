'use client'

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export type ProgressColor = 'brand' | 'success' | 'warning' | 'danger'

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** 0–100. Omit (or pass undefined) for an indeterminate loading bar. */
  value?: number
  color?: ProgressColor
  /** Track/bar thickness in px. Default 6. */
  size?: number
  /** Label shown above the track, on the left. */
  label?: string
  /** Show the current value on the right. Ignored (and never shown) while
   *  indeterminate — there's no percentage to report. Default false. */
  showValue?: boolean
  /** Format the displayed value. Default `${n}%`. */
  formatValue?: (value: number) => string
  className?: string
}

// success/warning need to be darker in light mode than dark to clear WCAG
// 1.4.11's 3:1 non-text-contrast minimum against the light track (zinc-100)
// — green-500/amber-500 measure only 2.07:1 / 1.95:1 there. Tailwind's own
// 700 step clears it but reads muddy/desaturated at full track width; these
// are custom OKLCH shades instead — same hue and chroma as the 500s (so they
// stay just as vivid, not "darker AND duller"), lightness lowered only as
// far as the contrast floor actually requires, with a little headroom
// (3.3–3.7:1) rather than sitting right on the 3.0 edge. Against the dark
// track (zinc-800) the 500 shades already pass comfortably (6.5:1+), so only
// light mode needs the swap.
const bar: Record<ProgressColor, string> = {
  brand:   'bg-zinc-900 dark:bg-white',
  success: 'bg-[oklch(0.56_0.219_149.579)] dark:bg-green-500',
  warning: 'bg-[oklch(0.63_0.188_70.08)] dark:bg-amber-500',
  danger:  'bg-rose-500',
}

export function Progress({
  value,
  color = 'brand',
  size = 6,
  label,
  showValue = false,
  formatValue,
  className,
  style,
  ...props
}: ProgressProps) {
  const indeterminate = value == null
  const pct = indeterminate ? 0 : Math.min(100, Math.max(0, value))
  const fmt = (v: number) => (formatValue ? formatValue(v) : `${Math.round(v)}%`)

  const showLabelRow = !!label || (showValue && !indeterminate)

  return (
    <div className="w-full">
      {showLabelRow && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          {label && (
            // leading-[1.2], not leading-none — this label truncates
            // (overflow:hidden), and a line-height of exactly 1 sits tighter
            // than the font's true glyph metrics, so a descender like the
            // 'g' in "Uploading" was getting sliced off by the truncate
            // clip. Same fix as Button's own label needed for the same reason.
            <span className="min-w-0 truncate text-[13px]/[1.2] font-medium tracking-[-0.01em] text-zinc-500 dark:text-zinc-400">
              {label}
            </span>
          )}
          {showValue && !indeterminate && (
            <span className="shrink-0 whitespace-nowrap text-[13px]/[1.2] font-semibold tabular-nums tracking-[-0.02em] text-zinc-700 dark:text-zinc-200">
              {fmt(pct)}
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : pct}
        aria-valuetext={indeterminate ? undefined : fmt(pct)}
        aria-label={props['aria-label'] ?? label}
        className={cn('relative w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800', className)}
        style={{ height: size, ...style }}
        {...props}
      >
        {indeterminate ? (
          <div className={cn('ax-prog-indet absolute inset-y-0 rounded-full', bar[color])}>
            {/* Soft leading/trailing fade instead of a flat-cut block — a
                block sliding at a constant width read as a solid brick
                shoving back and forth rather than something moving. */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0.35) 55%, transparent 100%)',
                mixBlendMode: 'overlay',
              }}
            />
          </div>
        ) : (
          <div
            className={cn('h-full rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]', bar[color])}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
      <style>{`
        .ax-prog-indet { width: 40%; animation: ax-prog-indet 1.2s cubic-bezier(0.65,0,0.35,1) infinite; }
        @keyframes ax-prog-indet {
          0%   { left: -40%; }
          100% { left: 100%; }
        }
        @media (prefers-reduced-motion: reduce) { .ax-prog-indet { animation-duration: 2.4s; } }
      `}</style>
    </div>
  )
}
