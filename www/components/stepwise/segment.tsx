'use client'

import { useId, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Surface } from '@/components/stepwise/primitives/surface'
import { cn } from '@/lib/utils/cn'

export interface SegmentOption<T extends string = string> {
  value: T
  label: string
  icon?: React.ReactNode
  /** Optional panel shown below the control when this option is active (tabs). */
  content?: ReactNode
}

export interface SegmentProps<T extends string = string> {
  /** The selectable options. */
  options: SegmentOption<T>[]
  /** Controlled selected value. */
  value?: T
  /** Uncontrolled initial value. Defaults to the first option. */
  defaultValue?: T
  /** Called whenever the selection changes. */
  onChange?: (value: T) => void
  /** 'sm' → 28px buttons  |  'md' → 32px buttons (default). */
  size?: 'sm' | 'md'
  /** 'pill' → filled sliding pill (default)  |  'underline' → sliding underline. */
  variant?: 'pill' | 'underline'
  className?: string
}

const PANEL_EASE = [0.22, 1, 0.36, 1] as const

export function Segment<T extends string = string>({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  size = 'md',
  variant = 'pill',
  className,
}: SegmentProps<T>) {
  const id = useId()

  const [internal, setInternal] = useState<T>(() => defaultValue ?? options[0]?.value)
  const isControlled = controlledValue !== undefined
  const active = isControlled ? controlledValue : internal

  function select(v: T) {
    if (!isControlled) setInternal(v)
    onChange?.(v)
  }

  const fs = size === 'sm' ? 'text-[12px]' : 'text-[13px]'
  const activeOpt = options.find(o => o.value === active)
  const hasPanels = options.some(o => o.content !== undefined)

  // ── the control row ────────────────────────────────────────────────────────
  let control: ReactNode
  if (variant === 'underline') {
    control = (
      <div className="flex w-fit items-center gap-1 border-b border-zinc-200 dark:border-zinc-800">
        {options.map(opt => {
          const isActive = opt.value === active
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => select(opt.value)}
              className={cn(
                'relative flex items-center gap-1.5 px-3 pb-2.5 pt-1 font-medium select-none cursor-pointer',
                'transition-colors duration-150', fs,
                isActive
                  ? 'text-zinc-900 dark:text-white'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={`${id}-underline`}
                  className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-zinc-900 dark:bg-white"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
                />
              )}
              {opt.icon && <span className="flex items-center">{opt.icon}</span>}
              {opt.label}
            </button>
          )
        })}
      </div>
    )
  } else {
    const h  = size === 'sm' ? 'h-7'    : 'h-8'
    const px = size === 'sm' ? 'px-2.5' : 'px-3'
    control = (
      <Surface
        radius={100}
        lisse={{ middleBorder: { width: 1, opacity: 0.625, color: 'var(--ui-border, rgb(138 138 141 / 0.23))' } }}
        className="flex w-fit items-center gap-px bg-zinc-100 p-[3px] dark:bg-zinc-800/60"
      >
        {options.map(opt => {
          const isActive = opt.value === active
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => select(opt.value)}
              className={cn(
                'relative flex items-center gap-1.5 rounded-full font-medium select-none cursor-pointer',
                'active:scale-[0.96] transition-[color,transform] duration-150',
                h, px, fs,
                isActive
                  ? 'text-zinc-800 dark:text-zinc-100'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={`${id}-pill`}
                  className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-zinc-700/40 dark:shadow-none"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
                />
              )}
              {opt.icon && <span className="relative z-10 flex items-center">{opt.icon}</span>}
              <span className="relative z-10">{opt.label}</span>
            </button>
          )
        })}
      </Surface>
    )
  }

  // ── no panels → just the control (keeps the old Segment behaviour) ──────────
  if (!hasPanels) {
    return <div className={cn('w-fit', className)}>{control}</div>
  }

  // ── with panels → control + blur-fade content (tabs) ────────────────────────
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {control}
      {activeOpt?.content !== undefined && (
        <div className="relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 4, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
              transition={{ duration: 0.2, ease: PANEL_EASE }}
            >
              {activeOpt.content}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
