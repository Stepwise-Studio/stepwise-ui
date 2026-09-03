import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ScaleProps {
  /** Strip direction. Default 'horizontal'. */
  orientation?: 'horizontal' | 'vertical'
  /** Strip thickness in px. Default 40. */
  thickness?: number
  className?: string
  /* CSSProperties alone rejects custom properties, so the documented usage
   * - style={{ '--pattern': '...' }} - fails to typecheck under `strict`,
   * which Quick Start asks for. Widening it here is better than telling
   * people to cast at every call site. */
  style?: CSSProperties & Record<`--${string}`, string | number>
}

/**
 * A ruler-tick strip: diagonal hairlines at a fixed pitch, bordered on the
 * long edges. The line colour comes from a `--pattern` CSS variable, left
 * undefined so it can be set per context rather than guessed here.
 */
export function Scale({ orientation = 'horizontal', thickness = 40, className, style }: ScaleProps) {
  const horizontal = orientation === 'horizontal'
  return (
    <div
      aria-hidden="true"
      className={cn(
        horizontal ? 'w-full border-y' : 'h-full border-x',
        'bg-[repeating-linear-gradient(315deg,var(--pattern,rgb(138_138_141_/_0.35))_0,var(--pattern,rgb(138_138_141_/_0.35))_1px,transparent_1px,transparent_50%)] bg-size-[10px_10px] border-[var(--pattern,rgb(138_138_141_/_0.35))] pointer-events-none',
        className,
      )}
      style={{ [horizontal ? 'height' : 'width']: thickness, ...style }}
    />
  )
}
