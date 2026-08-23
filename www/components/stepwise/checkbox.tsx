'use client'

import { forwardRef, InputHTMLAttributes, useState, useId } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils/cn'

export type CheckboxSize = 'sm' | 'default' | 'lg'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?          : CheckboxSize
  label?         : string
  indeterminate? : boolean
}

const sizes = {
  sm:      { sq: 14, r: 5, label: 'text-[12px]' },
  default: { sq: 18, r: 7, label: 'text-[13px]' },
  lg:      { sq: 22, r: 9, label: 'text-[14px]' },
} as const

const Checkmark = ({ sq }: { sq: number }) => (
  <svg width={Math.round(sq * 0.62)} height={Math.round(sq * 0.62)} viewBox="0 0 12 12" fill="none">
    <motion.path
      d="M2 6.5L4.5 9L10 3.5"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    />
  </svg>
)

const Dash = ({ sq }: { sq: number }) => (
  <svg width={Math.round(sq * 0.55)} height={Math.round(sq * 0.55)} viewBox="0 0 10 10" fill="none">
    <motion.path
      d="M1 5H9"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    />
  </svg>
)

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  size = 'default', label, className, indeterminate, checked, defaultChecked, onChange, disabled, id: idProp, ...props
}, ref) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const s = sizes[size]
  const isControlled = checked !== undefined
  const [local, setLocal] = useState(defaultChecked ?? false)
  const visual = isControlled ? !!checked : local
  const active = visual || !!indeterminate

  return (
    <label
      htmlFor={id}
      className={cn('inline-flex items-center gap-1 cursor-pointer select-none', disabled && 'opacity-40 pointer-events-none', className)}
    >
      <input
        id={id} ref={ref} type="checkbox" className="sr-only" checked={visual}
        onChange={e => { if (!isControlled) setLocal(e.target.checked); onChange?.(e) }}
        disabled={disabled} {...props}
      />
      <span
        className={cn(
          'shrink-0 inline-flex items-center justify-center transition-colors duration-150',
          active
            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
            : 'bg-white dark:bg-zinc-900 border border-[var(--ui-border)]',
        )}
        style={{ width: s.sq, height: s.sq, borderRadius: s.r }}
      >
        {indeterminate ? <Dash sq={s.sq} /> : visual ? <Checkmark sq={s.sq} /> : null}
      </span>
      {label && (
        <span className={cn(
          s.label, 'font-medium leading-none transition-colors duration-200',
          active ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400',
        )}>
          {label}
        </span>
      )}
    </label>
  )
})
Checkbox.displayName = 'Checkbox'
