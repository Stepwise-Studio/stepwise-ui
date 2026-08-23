'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/cn'

export interface FlowerLoaderProps {
  /** Size in px. Default 96. */
  size?       : number
  /** Number of petals. Default 6. */
  petals?     : number
  /** Petal colour. Default a soft rose. */
  petalColor? : string
  /** Centre colour. Default a warm amber. */
  centerColor?: string
  /** Seconds for one full rotation. Default 6. */
  duration?   : number
  className?  : string
}

// A single teardrop petal pointing up from the flower centre (50,50 → 50,8).
const PETAL = 'M50 50 C40 32 40 16 50 8 C60 16 60 32 50 50 Z'

/**
 * A cute little flower that spins slowly while its petals pulse in a wave —
 * each petal blooms and eases back a beat after the one before it, so the whole
 * thing reads as a flower gently opening and closing while you wait.
 */
export function FlowerLoader({
  size = 96,
  petals = 6,
  petalColor = '#fb7185',
  centerColor = '#fbbf24',
  duration = 6,
  className,
}: FlowerLoaderProps) {
  const reduce = useReducedMotion()
  const step = 360 / petals
  const pulse = Math.max(1.4, duration / 3) // one bloom-wave lasts a third of a turn

  return (
    <span
      className={cn('inline-block', className)}
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="overflow-visible"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={reduce ? undefined : { duration, repeat: Infinity, ease: 'linear' }}
      >
        {Array.from({ length: petals }, (_, i) => (
          <motion.path
            key={i}
            d={PETAL}
            fill={petalColor}
            style={{ transformBox: 'view-box', transformOrigin: '50px 50px', rotate: `${i * step}deg` }}
            initial={false}
            animate={reduce ? { scale: 1, opacity: 0.9 } : { scale: [0.62, 1, 0.62], opacity: [0.65, 1, 0.65] }}
            transition={reduce ? { duration: 0 } : {
              duration: pulse,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (i / petals) * pulse,
            }}
          />
        ))}

        {/* centre */}
        <motion.circle
          cx="50" cy="50" r="9"
          fill={centerColor}
          style={{ transformBox: 'view-box', transformOrigin: '50px 50px' }}
          animate={reduce ? undefined : { scale: [1, 1.15, 1] }}
          transition={reduce ? undefined : { duration: pulse / 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.svg>
    </span>
  )
}
