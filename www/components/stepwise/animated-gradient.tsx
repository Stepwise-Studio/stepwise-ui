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
      duration = 5,
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
        {/* The animated colorful gradient overlaid exactly on top with transparent gaps */}
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
            // Discontinuous "strip" highlights separated by transparent gaps
            backgroundImage: `linear-gradient(165deg, transparent 15%, #06b6d4 22%, transparent 29%, transparent 40%, #ec4899 47%, transparent 54%, transparent 65%, #eab308 72%, transparent 79%)`,
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
