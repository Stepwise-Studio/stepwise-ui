'use client'

import React, { useRef } from 'react'
import { motion, type HTMLMotionProps, useInView } from 'motion/react'
import { cn } from '@/lib/utils/cn'

export interface AnimatedGradientProps extends HTMLMotionProps<'span'> {
  text: string
  duration?: number
  withGrain?: boolean
  loop?: boolean
}

export const AnimatedGradient = React.forwardRef<HTMLSpanElement, AnimatedGradientProps>(
  (
    {
      text,
      duration = 8,
      withGrain = false,
      loop = true,
      className,
      ...props
    },
    ref
  ) => {
    const localRef = useRef<HTMLSpanElement>(null)
    const isInView = useInView(localRef, { once: false, amount: 0.5 })

    return (
      // The outer span is a plain DOM element, but `props` is typed as
      // HTMLMotionProps (this component's own prop type extends it) — cast
      // narrows back to plain span attributes for the spread; behavior is
      // unaffected since only DOM-valid props are ever actually passed here.
      <span className={cn('relative inline-block', className)} {...(props as React.HTMLAttributes<HTMLSpanElement>)}>
        {/* Base dark text behind the gradient */}
        <span className="text-slate-900 dark:text-slate-100">{text}</span>
        {/* The animated rainbow band wipes across, overlaid exactly on top */}
        <motion.span
          ref={(node) => {
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
            if (localRef) localRef.current = node
          }}
          initial={{ backgroundPosition: '-200% 50%' }}
          animate={isInView ? { backgroundPosition: '200% 50%' } : { backgroundPosition: '-200% 50%' }}
          transition={{
            duration: duration,
            repeat: loop ? Infinity : 0,
            ease: 'linear',
          }}
          className="absolute inset-0 block bg-clip-text text-transparent bg-[length:300%_auto] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
          style={{
            // One continuous rainbow band, feathered to transparent only at
            // its own leading/trailing edge — no internal gaps, so nothing
            // flickers in and out as it wipes across.
            backgroundImage: `linear-gradient(90deg, transparent 0%, #ef4444 8%, #f97316 16%, #eab308 24%, #22c55e 32%, #06b6d4 40%, #3b82f6 48%, #8b5cf6 56%, #ec4899 64%, transparent 72%)`,
            ...(withGrain
              ? {
                  backgroundBlendMode: 'overlay',
                }
              : {}),
          }}
        >
          {text}
        </motion.span>
      </span>
    )
  }
)

AnimatedGradient.displayName = 'AnimatedGradient'
