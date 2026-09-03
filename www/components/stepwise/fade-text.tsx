'use client'

import { motion, AnimatePresence, useReducedMotion, type Variants } from 'motion/react'
import { cn } from '@/lib/utils/cn'

export interface FadeTextProps {
  children  : string
  /** Split granularity. Default "word". */
  by?       : 'word' | 'char'
  /** Toggle to animate out (false) / in (true). Default true. */
  show?     : boolean
  /** Per-chunk stagger in seconds. Default 0.05. */
  stagger?  : number
  className?: string
}

const container = (stagger: number, show: boolean): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, staggerDirection: show ? 1 : -1 },
  },
  exit: {
    transition: { staggerChildren: stagger * 0.6, staggerDirection: -1 },
  },
})

// Enter: blur+rise (make-interfaces-feel-better). Exit: subtle, smaller travel.
const chunk: Variants = {
  hidden:  { opacity: 0, y: 8,  filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { type: 'spring', duration: 0.5, bounce: 0 } },
  exit:    { opacity: 0, y: -4, filter: 'blur(3px)', transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
}

/** Words plus whitespace runs - keeps double spaces intact. */
function splitParts(text: string, by: 'word' | 'char') {
  if (by === 'char') return text.split('')
  return text.split(/(\s+)/).filter(part => part.length > 0)
}

/**
 * Fades text in and out. Splits into words or characters and staggers each
 * chunk, with a blurred rise on enter and a softer, smaller exit. Toggle
 * `show` to play it in either direction.
 */
export function FadeText({ children, by = 'word', show = true, stagger = 0.05, className }: FadeTextProps) {
  const reduce = useReducedMotion()
  const parts = splitParts(children, by)

  if (reduce) {
    return <span className={cn('inline-block', className)}>{show ? children : ''}</span>
  }

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.span
          key="fade-text"
          className={cn('inline-block', className)}
          variants={container(stagger, show)}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {parts.map((part, i) => {
            const isSpace = by === 'word' && /^\s+$/.test(part)
            if (isSpace) {
              return (
                <span key={`${i}-ws`} className="whitespace-pre" aria-hidden>
                  {part}
                </span>
              )
            }
            return (
              <motion.span key={`${i}-${part}`} variants={chunk} className="inline-block whitespace-pre">
                {part}
              </motion.span>
            )
          })}
        </motion.span>
      )}
    </AnimatePresence>
  )
}
