'use client'

import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/cn'

export type SpinnerStatus = 'loading' | 'success' | 'error'
export type SpinnerSize = 'sm' | 'default' | 'lg'
export type SpinnerVariant = 'arc' | 'dots'

export interface SpinnerProps {
  /** Drive this from your async state. Default "loading". */
  status?   : SpinnerStatus
  /** "sm" (16px) / "default" (24px) / "lg" (32px), or an exact px diameter. Default "default". */
  size?     : SpinnerSize | number
  /** "arc" — a single sweeping stroke, the general-purpose default. "dots" — eight
   *  fading dots, the iOS/macOS activity-indicator look. Default "arc". */
  variant?  : SpinnerVariant
  className?: string
}

const SIZE_MAP: Record<SpinnerSize, number> = { sm: 16, default: 24, lg: 32 }
const DOTS = 8
const TICK  = 'M6 12.5 L10.2 16.6 L18 8.4'
const CROSS = 'M8 8 L16 16 M16 8 L8 16'

/**
 * The loading indicator, and the moment after it. Give it a `status` and it
 * resolves into a filled disc, then the tick (or cross) draws itself on with
 * a spring — so the resolve reads as one gesture instead of a swap. Loading
 * and resolved states share one AnimatePresence so the crossfade is a single
 * synced transition, not two independently-timed ones.
 */
export function Spinner({ status = 'loading', size = 'default', variant = 'arc', className }: SpinnerProps) {
  const reduce = useReducedMotion()
  const done = status !== 'loading'
  const px = typeof size === 'number' ? size : SIZE_MAP[size]
  const tint = status === 'error' ? '#e11d48' : '#16a34a'

  const stroke = Math.max(2, px * 0.15)
  const r = (px - stroke) / 2
  const c = 2 * Math.PI * r

  const dotSize = Math.max(2.5, px * 0.16)
  const dotRadius = px / 2 - dotSize / 2 - stroke / 2

  return (
    <span
      className={cn('relative inline-block', className)}
      style={{ width: px, height: px }}
      role="status"
      aria-live="polite"
      aria-label={status === 'loading' ? 'Loading' : status === 'success' ? 'Done' : 'Failed'}
    >
      <AnimatePresence initial={false}>
        {!done ? (
          variant === 'arc' ? (
            <motion.svg
              key="arc"
              width={px} height={px} viewBox={`0 0 ${px} ${px}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              {/* track */}
              <circle
                cx={px / 2} cy={px / 2} r={r}
                fill="none" strokeWidth={stroke}
                className="stroke-zinc-200 dark:stroke-zinc-800"
              />
              {/* one clean arc that just spins — plain CSS animation, not a
                  Framer `rotate` value: nested inside the crossfade's
                  motion.svg, a framer-driven rotate here silently no-ops
                  (it's not the direct AnimatePresence child, so its
                  initial/animate collapse to the same value on mount) */}
              <circle
                cx={px / 2} cy={px / 2} r={r}
                fill="none" strokeWidth={stroke} strokeLinecap="round"
                className="text-zinc-900 dark:text-white"
                stroke="currentColor"
                strokeDasharray={`${c * 0.28} ${c * 0.72}`}
                style={{
                  transformOrigin: '50% 50%',
                  animation: reduce ? undefined : 'stepwise-spinner-spin 0.7s linear infinite',
                }}
              />
            </motion.svg>
          ) : (
            <motion.span
              key="dots"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              {Array.from({ length: DOTS }).map((_, i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2 rounded-full bg-zinc-900 dark:bg-white"
                  style={{
                    width: dotSize,
                    height: dotSize,
                    marginLeft: -dotSize / 2,
                    marginTop: -dotSize / 2,
                    transform: `rotate(${(i * 360) / DOTS}deg) translateY(${-dotRadius}px)`,
                    opacity: reduce ? 0.5 : undefined,
                    animation: reduce ? undefined : 'stepwise-spinner-fade 1s linear infinite',
                    animationDelay: reduce ? undefined : `${-(1 - i / DOTS)}s`,
                  }}
                />
              ))}
            </motion.span>
          )
        ) : (
          <motion.svg
            key={status}
            width={px} height={px} viewBox="0 0 24 24"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <motion.circle
              cx="12" cy="12" r={11}
              fill={tint}
              initial={reduce ? { scale: 1 } : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              style={{ transformOrigin: '50% 50%' }}
            />
            <motion.path
              d={status === 'success' ? TICK : CROSS}
              fill="none" stroke="#fff" strokeWidth={2.4}
              strokeLinecap="round" strokeLinejoin="round"
              initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: reduce ? 0 : 0.22, delay: reduce ? 0 : 0.06, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.svg>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes stepwise-spinner-fade {
          0%   { opacity: 1; }
          100% { opacity: 0.15; }
        }
        @keyframes stepwise-spinner-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  )
}
