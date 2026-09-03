'use client'

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export type ChipColor   = 'danger' | 'warning' | 'success' | 'info' | 'magical' | 'idle'
export type ChipVariant = 'outline' | 'soft' | 'solid'
export type ChipSize    = 'sm' | 'default' | 'lg'

export interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  color?   : ChipColor
  variant? : ChipVariant
  size?    : ChipSize
  icon?    : React.ReactNode
  /** Leading status dot - great for "Live", counts, and statuses. */
  dot?     : boolean
}

const sizes = {
  //               base padding ─────────┐  dot left ─────┐  icon left ──┐  base gap ──┐  dot gap ──┐  icon gap ──┐
  sm:      { pyBase: 6,  pyFillNoIcon: 8,  px: 10, dotPxLeft:  8, iconPxLeft:  8, fontSize: 11, iconSize: 14, gap: 3, dotGap: 5, iconGap: 4 },
  default: { pyBase: 8,  pyFillNoIcon: 10, px: 12, dotPxLeft: 10, iconPxLeft: 10, fontSize: 14, iconSize: 18, gap: 4, dotGap: 8, iconGap: 6 },
  lg:      { pyBase: 10, pyFillNoIcon: 12, px: 14, dotPxLeft: 11, iconPxLeft: 11, fontSize: 15, iconSize: 20, gap: 5, dotGap: 9, iconGap: 6 },
} as const

type ColorDef = {
  text: string          // text for soft + outline
  soft: string          // soft fill - dark uses the hue at low opacity, not a muddy -950
  softBorder: string    // hairline of the same hue
  solid: string         // saturated fill + legible text
  solidBorder: string   // subtle same-hue edge on the saturated fill
  outlineBorder: string // outline stroke (inline hex)
  dot: string
}

const colors: Record<ChipColor, ColorDef> = {
  danger:  { text: 'text-rose-600 dark:text-rose-500',     soft: 'bg-rose-50 dark:bg-rose-500/7',     softBorder: 'border-rose-500/10 dark:border-rose-400/10',     solid: 'bg-rose-500 text-white dark:bg-rose-600',        solidBorder: 'border-rose-600/40',     outlineBorder: 'border-rose-200 dark:border-rose-800/60',        dot: 'bg-rose-500' },
  warning: { text: 'text-amber-600 dark:text-amber-500',   soft: 'bg-amber-50 dark:bg-amber-500/7',   softBorder: 'border-amber-500/15 dark:border-amber-400/10',   solid: 'bg-amber-400 text-white dark:bg-amber-500',   solidBorder: 'border-amber-500/50',    outlineBorder: 'border-amber-200 dark:border-amber-500/40',        dot: 'bg-amber-500' },
  success: { text: 'text-green-600 dark:text-green-500',   soft: 'bg-green-50 dark:bg-green-500/7',   softBorder: 'border-green-500/10 dark:border-green-400/10',   solid: 'bg-green-500 text-white dark:bg-green-600/95',       solidBorder: 'border-green-600/40',    outlineBorder: 'border-green-200 dark:border-green-800/60',        dot: 'bg-green-500' },
  info:    { text: 'text-sky-600 dark:text-sky-500',       soft: 'bg-sky-50 dark:bg-sky-500/7',       softBorder: 'border-sky-500/10 dark:border-sky-400/10',       solid: 'bg-sky-500 text-white dark:bg-sky-600',         solidBorder: 'border-sky-600/40',      outlineBorder: 'border-sky-200 dark:border-sky-700/60',        dot: 'bg-sky-500' },
  magical: { text: 'text-indigo-600 dark:text-indigo-400', soft: 'bg-indigo-50 dark:bg-indigo-500/9', softBorder: 'border-indigo-500/10 dark:border-indigo-400/10', solid: 'bg-indigo-500 text-white dark:bg-indigo-600',      solidBorder: 'border-indigo-600/40',   outlineBorder: 'border-indigo-200 dark:border-indigo-700/60',   dot: 'bg-indigo-500' },
  idle:    { text: 'text-zinc-600 dark:text-zinc-300',     soft: 'bg-zinc-100 dark:bg-zinc-800/30',       softBorder: 'border-zinc-200 dark:border-zinc-700',          solid: 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900', solidBorder: 'border-zinc-900/10 dark:border-white/10', outlineBorder: 'border-zinc-200 dark:border-zinc-700', dot: 'bg-zinc-400 dark:bg-zinc-500' },
}

export function Chip({
  color   = 'idle',
  variant = 'outline',
  size    = 'default',
  icon,
  dot     = false,
  className,
  children,
  ...props
}: ChipProps) {
  const s = sizes[size]
  const c = colors[color]
  const filled = variant !== 'outline'
  // a lone-text soft chip gets extra vertical padding (Figma spec); once it has a
  // leading icon OR dot, drop back to the base padding so heights match across variants
  const py = variant === 'soft' && !icon && !dot ? s.pyFillNoIcon : s.pyBase

  // dot chips: only the dot itself is colored - body uses idle neutrals
  const dc = dot ? colors.idle : c
  const skin =
    variant === 'solid' ? cn(dc.solid, 'border', dc.solidBorder)
    : variant === 'soft' ? cn(dc.soft, dc.text, 'border', dc.softBorder)
    : cn('bg-transparent border', dc.text, dc.outlineBorder)

  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap select-none rounded-full',
        filled ? 'font-medium' : 'font-normal',
        skin,
        className,
      )}
      style={{
        paddingTop: py, paddingBottom: py,
        paddingLeft:  dot ? s.dotPxLeft : icon ? s.iconPxLeft : s.px,
        paddingRight: s.px,
        gap: dot ? s.dotGap : icon ? s.iconGap : s.gap,
      }}
      {...props}
    >
      {dot && (
        <span
          className={cn('shrink-0 rounded-full', variant === 'solid' ? 'bg-white/85' : c.dot)}
          style={{ width: size === 'sm' ? 5 : 6, height: size === 'sm' ? 5 : 6 }}
        />
      )}
      {icon && (
        <span className="flex items-center justify-center shrink-0" style={{ width: s.iconSize, height: s.iconSize }}>
          {icon}
        </span>
      )}
      <span style={{
        fontSize: s.fontSize,
        letterSpacing: '-0.02625rem',
        lineHeight: 1,
        textBoxTrim: 'trim-both',
        textBoxEdge: 'cap alphabetic',
        // Mixed-case lowercase letters cluster in the lower 60% of the cap→baseline box.
        // Shift up to realign the visual weight center with the geometric center.
        transform: 'translateY(-0.07em)',
      } as React.CSSProperties}>
        {children}
      </span>
    </span>
  )
}
