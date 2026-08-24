import { cn } from '@/lib/utils/cn'

export interface ScaleProps {
  /** Strip direction. Default 'horizontal'. */
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

/**
 * A ruler-tick strip — diagonal hairlines at a fixed pitch, bounded by a
 * border on the strip's long edges. Reads its line color from a `--pattern`
 * CSS variable, left undefined so the consumer sets it per context rather
 * than the component guessing a color that won't fit everywhere it's used.
 */
export function Scale({ orientation = 'horizontal', className }: ScaleProps) {
  const horizontal = orientation === 'horizontal'
  return (
    <div
      className={cn(
        horizontal ? 'h-10 w-full border-y' : 'w-10 h-full border-x',
        'bg-[repeating-linear-gradient(315deg,var(--pattern)_0,var(--pattern)_1px,transparent_1px,transparent_50%)] bg-size-[10px_10px] border-(--pattern) pointer-events-none',
        className,
      )}
    />
  )
}
