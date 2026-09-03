'use client'

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  /** Optional centered label - only for horizontal separators. */
  label?: React.ReactNode
}

export function Separator({ orientation = 'horizontal', label, className, ...props }: SeparatorProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('w-px rounded-full self-stretch bg-zinc-200 dark:bg-zinc-800', className)}
        {...props}
      />
    )
  }

  if (label) {
    return (
      <div role="separator" aria-orientation="horizontal" className={cn('flex w-full items-center gap-3', className)} {...props}>
        <span className="h-px flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-[12px] font-medium tracking-[-0.01em] text-zinc-400 dark:text-zinc-500">{label}</span>
        <span className="h-px flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
    )
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('h-px w-full rounded-full bg-zinc-200 dark:bg-zinc-800', className)}
      {...props}
    />
  )
}
