'use client'

import { forwardRef, InputHTMLAttributes, useState, useId } from 'react'
import { motion, AnimatePresence } from 'motion/react'

import { cn } from '@/lib/utils/cn'

export type RadioSize = 'sm' | 'default' | 'lg'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?  : RadioSize
  label? : string
}

const sizes = {
  sm:      { sq: 16, dot: 6,  label: 'text-[12px]' },
  default: { sq: 20, dot: 8,  label: 'text-[13px]' },
  lg:      { sq: 24, dot: 10, label: 'text-[14px]' },
} as const

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  size = 'default', label, className, checked, defaultChecked, onChange, disabled, id: idProp, ...props
}, ref) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const s = sizes[size]
  const isControlled = checked !== undefined
  const [local, setLocal] = useState(defaultChecked ?? false)
  const visual = isControlled ? !!checked : local
  const handleClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    if (disabled) return
    if (visual) {
      e.preventDefault()
      if (!isControlled) setLocal(false)
      onChange?.({ target: { checked: false, name: (props.name ?? '') } } as any)
    }
  }

  return (
    <label
      htmlFor={id}
      onClick={handleClick}
      className={cn('inline-flex items-center gap-2 cursor-pointer select-none', disabled && 'opacity-40 pointer-events-none', className)}
    >
      <input
        id={id} ref={ref} type="radio" className="sr-only" checked={visual}
        onChange={e => { if (!isControlled) setLocal(e.target.checked); onChange?.(e) }}
        disabled={disabled} {...props}
      />
      <span
        className={cn(
          'shrink-0 inline-flex items-center justify-center rounded-full transition-colors duration-150',
          visual
            ? 'bg-zinc-900 dark:bg-white'
            : 'bg-white dark:bg-zinc-900 border border-[var(--ui-border)]',
        )}
        style={{ width: s.sq, height: s.sq }}
      >
        <AnimatePresence>
          {visual && (
            <motion.span
              key="dot"
              className="rounded-full bg-white dark:bg-zinc-900 block shrink-0"
              style={{ width: s.dot, height: s.dot }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </AnimatePresence>
      </span>
      {label && (
        <span className={cn(
          s.label, 'font-medium leading-none transition-colors duration-200',
          visual ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400',
        )}>
          {label}
        </span>
      )}
    </label>
  )
})
Radio.displayName = 'Radio'
