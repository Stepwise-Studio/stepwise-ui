'use client'

import { cn } from '@/lib/utils/cn'
import { useReducedMotion } from 'motion/react'

export type VeilTone = 'light' | 'dark'

interface ShaderBackdropProps {
  /** Optional edge fade so shader blends into page bg */
  fade?: 'bottom' | 'top' | 'both' | 'none'
  tone?: VeilTone
  className?: string
  children: React.ReactNode
}

const FADE: Record<NonNullable<ShaderBackdropProps['fade']>, string> = {
  bottom: 'linear-gradient(to bottom, transparent 40%, var(--fade) 100%)',
  top: 'linear-gradient(to top, transparent 50%, var(--fade) 100%)',
  both: 'linear-gradient(to bottom, var(--fade) 0%, transparent 25%, transparent 65%, var(--fade) 100%)',
  none: 'none',
}

/** Full-bleed shader layer. No white wash - shader stays visible. */
export function ShaderBackdrop({
  fade = 'bottom',
  tone = 'light',
  className,
  children,
}: ShaderBackdropProps) {
  const fadeColor = tone === 'dark' ? '#09090b' : '#fafaf9'

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
      style={{ '--fade': fadeColor } as React.CSSProperties}
    >
      <div className="absolute inset-0">{children}</div>
      {fade !== 'none' && (
        <div
          className="absolute inset-0"
          style={{ background: FADE[fade] }}
        />
      )}
    </div>
  )
}

export function useShaderSpeed(fallback = 0.15): number {
  const reduce = useReducedMotion()
  return reduce ? 0 : fallback
}
