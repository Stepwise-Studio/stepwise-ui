'use client'

import { HTMLAttributes, useRef } from 'react'
import { useSmoothCorners } from '@lisse/react'
import { cn } from '@/lib/utils/cn'

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Pass ['⌘','K'] to render each key in its own cap. */
  keys?: string[]
}

/** Spoken names for symbol keys. Screen readers don't announce these glyphs
 *  consistently, so the accessible name uses words instead. */
const SYMBOL_NAMES: Record<string, string> = {
  '⌘': 'Command', '⇧': 'Shift', '⌥': 'Option', '⌃': 'Control',
  '⏎': 'Enter', '⌫': 'Backspace', '⇥': 'Tab', '␣': 'Space',
  '↑': 'Up', '↓': 'Down', '←': 'Left', '→': 'Right',
}
const nameFor = (key: string) => SYMBOL_NAMES[key] ?? key

const capClass = cn(
  'inline-flex items-center justify-center select-none align-middle',
  'min-w-[20px] h-[20px] px-1.5',
  // Tailwind's Preflight makes <kbd> monospace. Put it back on the UI font.
  'font-sans text-[11px] font-medium leading-none tracking-[-0.01em]',
  'bg-zinc-50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
  // The border is an inset shadow rather than a real border, because a plain
  // border would be cut away by the squircle clip-path. `rounded-[6px]` curves
  // the shadow so it follows that clip-path instead of showing square corners
  // underneath it. Colour comes from --ui-border (see UiBorderTokens), which already
  // flips per theme.
  'rounded-[6px] inset-shadow-[0_0_0_1px_var(--ui-border,rgb(138_138_141_/_0.23))]',
)

/** One key cap. Kbd has to work inline inside a paragraph, so the squircle is
 *  applied to the <kbd> directly via the hook rather than through Surface,
 *  which would add a wrapper <div> that isn't valid inside <p>.
 *
 *  `autoEffects: false` matters: left on, it strips the inset-shadow border
 *  above to redraw it in its own SVG layer, which needs that wrapper. */
function Cap({ children, className, ...props }: HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null)
  useSmoothCorners(ref, { radius: 6, smoothing: 0.6 }, { autoEffects: false })
  return (
    <kbd ref={ref} className={cn(capClass, className)} {...props}>
      {children}
    </kbd>
  )
}

export function Kbd({ keys, className, children, ...props }: KbdProps) {
  if (keys?.length) {
    // The chord is announced once as a whole ("Command Shift P"); the caps
    // inside are hidden so each glyph isn't read out separately.
    return (
      <span
        role="text"
        aria-label={keys.map(nameFor).join(' ')}
        className={cn('inline-flex items-center gap-1', className)}
        {...props}
      >
        {keys.map((k, i) => <Cap key={i} aria-hidden="true">{k}</Cap>)}
      </span>
    )
  }
  const label = typeof children === 'string' ? SYMBOL_NAMES[children] : undefined
  return <Cap aria-label={label} className={className} {...props}>{children}</Cap>
}
