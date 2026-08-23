'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/cn'
import { Surface } from '@/components/stepwise/primitives/surface'

export interface QtyInputProps {
  value?        : number
  defaultValue? : number
  onChange?     : (value: number) => void
  min?          : number
  max?          : number
  step?         : number
  disabled?     : boolean
  className?    : string
  /** Names what's being counted for assistive tech, e.g. "Items in cart". Default "Quantity". */
  ariaLabel?    : string
}

function PlusIcon()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function MinusIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-3.5 h-3.5"><line x1="5" y1="12" x2="19" y2="12"/></svg> }

export function QtyInput({
  value,
  defaultValue = 1,
  onChange,
  min      = 0,
  max      = Infinity,
  step     = 1,
  disabled = false,
  className,
  ariaLabel = 'Quantity',
}: QtyInputProps) {
  const [internal, setInternal] = useState(defaultValue)
  const qty = value ?? internal
  const reduce = useReducedMotion()
  // +1 when incrementing, -1 when decrementing — drives the slide direction
  const dir = useRef(1)

  const set = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next))
    dir.current = clamped >= qty ? 1 : -1
    if (value === undefined) setInternal(clamped)
    onChange?.(clamped)
  }

  const atMin = qty <= min
  const atMax = qty >= max

  // One place-slot per digit, keyed by position-from-right (units=0, tens=1, …)
  // — not by array index — so a place's identity survives the digit count
  // changing. 12 → 13 only remounts the units slot (key 0); the tens slot
  // (key 1, still "1") keeps its React identity and never re-renders its
  // animation. Scales to any digit count: crossing 9 → 10 mounts a brand new
  // place (key 1) with its own enter, and 10 → 9 unmounts it with an exit —
  // the untouched units slot is unaffected either way.
  const negative = qty < 0
  const digitsStr = String(Math.abs(qty))
  const places = digitsStr.split('').map((digit, idx) => ({
    place: digitsStr.length - 1 - idx,
    digit,
  }))

  const btnClass = (disabled_: boolean) => cn(
    'flex items-center justify-center w-8 h-8 rounded-[10px] cursor-pointer',
    'focus-visible:outline-2 focus-visible:outline-offset-2',
    'focus-visible:outline-sky-600 dark:focus-visible:outline-sky-400',
    'transition-colors active:scale-[0.96] transition-transform duration-75',
    disabled || disabled_
      ? 'opacity-30 cursor-not-allowed'
      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
  )

  // Zero-duration transitions under reduced motion: the digit spans still
  // mount/unmount (so layout stays correct), they just don't spring/blur/slide.
  const flipTransition = reduce ? { duration: 0 } : { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <Surface
      radius={14}
      role="group"
      aria-label={ariaLabel}
      lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
      className={cn(
        'inline-flex items-center gap-1 p-1',
        'bg-white dark:bg-zinc-900',
        disabled && 'opacity-50',
        className,
      )}
    >
      <button
        type="button"
        className={btnClass(atMin)}
        onClick={() => set(qty - step)}
        disabled={disabled || atMin}
        aria-label="Decrease"
      >
        <MinusIcon />
      </button>

      {/* directional per-digit swap: + slides each changed digit up in (old up
          out), − slides it down in (old down out), with a fade + blur either
          way. Only the place(s) whose digit actually changed animate — see
          the `places` comment above for how identity is kept stable. The
          decorative digits are aria-hidden; the sr-only span below is the
          single source screen readers actually read, so a fast run of clicks
          announces one coherent number instead of fragmented digit spans. */}
      <span className="relative inline-flex h-8 min-w-[32px] items-center justify-center overflow-hidden" aria-hidden="true">
        {negative && (
          <span className="text-center text-[15px] font-semibold tabular-nums tracking-[-0.01em] text-zinc-900 dark:text-zinc-100 select-none">
            −
          </span>
        )}
        <AnimatePresence initial={false} mode="popLayout">
          {places.map(({ place, digit }) => (
            <motion.span
              key={place}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, position: 'absolute' }}
              transition={flipTransition}
              className="relative inline-block overflow-hidden"
            >
              <AnimatePresence mode="popLayout" initial={false} custom={dir.current}>
                <motion.span
                  key={digit}
                  custom={dir.current}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, y: reduce ? 0 : d * 12, filter: reduce ? 'none' : 'blur(3px)' }),
                    center: { opacity: 1, y: 0, filter: 'blur(0px)' },
                    exit:  (d: number) => ({ opacity: 0, y: reduce ? 0 : d * -12, filter: reduce ? 'none' : 'blur(3px)', position: 'absolute' }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={flipTransition}
                  className="inline-block text-center text-[15px] font-semibold tabular-nums tracking-[-0.01em] text-zinc-900 dark:text-zinc-100 select-none"
                >
                  {digit}
                </motion.span>
              </AnimatePresence>
            </motion.span>
          ))}
        </AnimatePresence>
      </span>
      {/* stable live region, updated in place — screen readers announce the
          new count as one clean number on every change */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">{qty}</span>

      <button
        type="button"
        className={btnClass(atMax)}
        onClick={() => set(qty + step)}
        disabled={disabled || atMax}
        aria-label="Increase"
      >
        <PlusIcon />
      </button>
    </Surface>
  )
}
