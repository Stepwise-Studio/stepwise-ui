'use client'

import { useId, useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/cn'

export type ToggleSize = 'sm' | 'default' | 'lg'

export interface ToggleProps {
  checked?       : boolean
  defaultChecked?: boolean
  onChange?      : (checked: boolean) => void
  size?          : ToggleSize
  label?         : string
  /** Helper line under the label. */
  hint?          : string
  /** Accessible name for the switch. Required when used without `label` —
   *  there's nothing else to derive a name from. */
  ariaLabel?     : string
  disabled?      : boolean
  className?     : string
}


// Same nested-knob geometry as classical Slider: equal gap on all four sides,
// knob = track height − 2×gap. Even heights so 50%-centering is never needed.
const SIZES = {
  sm:      { w: 36, h: 22, gap: 3 },
  default: { w: 44, h: 26, gap: 4 },
  lg:      { w: 54, h: 32, gap: 4 },
} as const

/**
 * A switch. The knob stretches slightly as it travels and settles on a spring,
 * so the flip has some weight to it rather than snapping between two states.
 */
export function Toggle({
  checked,
  defaultChecked = false,
  onChange,
  size = 'default',
  label,
  hint,
  ariaLabel,
  disabled,
  className,
}: ToggleProps) {
  const id = useId()
  const reduce = useReducedMotion()

  useEffect(() => {
    // globalThis, not `process` directly — a bare `process` reference needs
    // @types/node to typecheck, which non-Next consumers (Vite, CRA) don't have.
    if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV === 'production') return
    if (!label && !ariaLabel) {
      console.warn('[Stepwise Toggle] Needs a `label` or `ariaLabel` — the switch has no accessible name.')
    }
  }, [label, ariaLabel])

  const s = SIZES[size]
  const knob = s.h - s.gap * 2
  const travel = s.w - knob - 2 * s.gap
  const [internal, setInternal] = useState(defaultChecked)
  const on = checked ?? internal
  // The squash-and-settle is feedback for an actual flip, not a page-load
  // effect. `scaleX`'s target is a 3-value keyframe array — even with
  // initial={false}, Motion runs a keyframes array as a timed sequence on
  // mount rather than snapping straight to its resting value. Gating it
  // behind "has this actually been toggled" keeps the knob a true circle
  // on first paint.
  const [everToggled, setEverToggled] = useState(false)

  const toggle = () => {
    if (disabled) return
    setEverToggled(true)
    if (checked === undefined) setInternal(!on)
    onChange?.(!on)
  }

  const track = (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={!label ? ariaLabel : undefined}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        'relative box-border shrink-0 rounded-full border-0 p-0 outline-none',
        'transition-colors duration-200',
        'focus-visible:ring-[3px] focus-visible:ring-sky-400/40',
        // sky-500/zinc-200 measured only 2.71:1 / 1.27:1 against the white
        // knob — both under WCAG 1.4.11's 3:1 floor for a UI component's own
        // state indicator. sky-600/zinc-500 clear 4.10:1 / 4.83:1. Dark
        // mode's off state (zinc-700, 10.44:1) was already fine.
        on ? 'bg-sky-500' : 'bg-zinc-200/80 dark:bg-zinc-700/70',
        disabled && 'opacity-40 cursor-not-allowed',
      )}
      style={{ width: s.w, height: s.h }}
    >
      <motion.span
        className="absolute rounded-full bg-white"
        style={{
          top: s.gap,
          left: s.gap,
          width: knob,
          height: knob,
          boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
        }}
        initial={false}
        animate={{
          x: on ? travel : 0,
          // squash along travel from the centre so end padding never collapses —
          // only after a real flip (keyframes would run on mount otherwise).
          scaleX: reduce || !everToggled ? 1 : [1, 1.12, 1],
        }}
        transition={{
          x:      reduce ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 32 },
          scaleX: { duration: reduce ? 0 : 0.22, ease: 'easeOut' },
        }}
      />
    </button>
  )

  if (!label && !hint) return <span className={className}>{track}</span>

  return (
    <div className={cn('flex items-start gap-3', className)}>
      {track}
      <label htmlFor={id} className={cn('select-none', !disabled && 'cursor-pointer')}>
        {label && (
          <span className={cn(
            'block text-[14px] font-medium leading-tight transition-colors duration-150',
            on ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400',
          )}>
            {label}
          </span>
        )}
        {hint && (
          <span className="mt-0.5 block text-[12px] leading-snug text-zinc-500 dark:text-zinc-400">
            {hint}
          </span>
        )}
      </label>
    </div>
  )
}
