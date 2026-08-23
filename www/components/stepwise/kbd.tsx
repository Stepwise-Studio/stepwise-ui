'use client'

import { HTMLAttributes, useRef } from 'react'
import { useSmoothCorners } from '@lisse/react'
import { cn } from '@/lib/utils/cn'

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Convenience: pass ['⌘','K'] to render each key in its own cap with a thin gap. */
  keys?: string[]
}

// Symbol keys read as glyphs to a sighted user, but a screen reader's
// glyph-to-word dictionary isn't guaranteed to cover them (or agree on the
// word) across platforms — spelling it out here removes the guesswork.
const SYMBOL_NAMES: Record<string, string> = {
  '⌘': 'Command', '⇧': 'Shift', '⌥': 'Option', '⌃': 'Control',
  '⏎': 'Enter', '⌫': 'Backspace', '⇥': 'Tab', '␣': 'Space',
  '↑': 'Up', '↓': 'Down', '←': 'Left', '→': 'Right',
}
const nameFor = (key: string) => SYMBOL_NAMES[key] ?? key

const capClass = cn(
  'inline-flex items-center justify-center select-none align-middle',
  'min-w-[20px] h-[20px] px-1.5',
  // Tailwind's Preflight defaults `code/kbd/samp/pre` to a monospace stack —
  // that's meant for code, not a short symbolic badge, so it's overridden
  // back to the UI's own font here rather than left as an accident.
  'font-sans text-[11px] font-medium leading-none tracking-[-0.01em]',
  'bg-zinc-50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
  // Border via an INSET box-shadow, not a real `border` — Kbd has to stay
  // inline inside plain paragraph text (see the "Inline" example), which
  // rules out SmoothCorners' own middleBorder: it needs a wrapper <div> to
  // host the border's SVG overlay even with `asChild`, and a <div> can't
  // legally sit inside a <p> (this shipped once and broke hydration for
  // exactly that reason). An outer border/shadow would get clip-path'd away
  // like any plain CSS `border` does — but an INSET shadow paints strictly
  // inside the clipped region, so it survives untouched with zero extra DOM.
  //
  // The shadow itself is a plain sharp-cornered rectangle, though — it knows
  // nothing about the squircle clip-path sitting on top of it. Without a
  // matching `rounded-*`, the shadow's square corners get chopped off
  // unevenly right where the clip-path's curve starts, which is exactly the
  // "border fading out at the corners" symptom this had. `rounded-[6px]`
  // doesn't affect the element's own silhouette (clip-path already owns
  // that) — it only curves the shadow enough to track the squircle closely,
  // the same fix the border-vs-clip-path mismatch always needs.
  //
  // Color comes from --ui-border (the project's own standard component-
  // border token, globals.css) rather than a hardcoded hex — one declaration
  // instead of a light/dark pair, since the variable itself already flips
  // per theme.
  'rounded-[6px] inset-shadow-[0_0_0_1px_var(--ui-border)]',
)

/** One key cap — squircle corners applied directly to the `<kbd>` itself via
 *  the bare `useSmoothCorners` hook (no wrapper element at all), since the
 *  effects-driven `SmoothCorners`/`Surface` components need a wrapper `<div>`
 *  the moment any border/shadow effect is involved. */
function Cap({ children, className, ...props }: HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null)
  // autoEffects defaults to true even with no third argument at all — it
  // silently detects and STRIPS any border/box-shadow it finds on the
  // element to redraw it through its own SVG effects system, which needs a
  // wrapper this component deliberately doesn't have. Without turning it
  // off, it was erasing the inset-shadow border below the moment this ran.
  useSmoothCorners(ref, { radius: 6, smoothing: 0.6 }, { autoEffects: false })
  return (
    <kbd ref={ref} className={cn(capClass, className)} {...props}>
      {children}
    </kbd>
  )
}

export function Kbd({ keys, className, children, ...props }: KbdProps) {
  if (keys?.length) {
    return (
      // The chord's accessible name lives here as one spelled-out string
      // ("Command Shift P") — each cap underneath is aria-hidden so a
      // screen reader announces the chord once, not each raw glyph
      // separately (some of which it may not have a reading for at all).
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
