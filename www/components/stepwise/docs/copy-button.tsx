'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Copy01Icon, CheckIcon } from '@hugeicons/core-free-icons'
import { SmoothCorners } from '@lisse/react'
import { cn } from '@/lib/utils/cn'

interface CopyButtonProps {
  text: string
  className?: string
}

const iconVariants = {
  initial: { scale: 0.5, opacity: 0, filter: 'blur(3px)' },
  animate: { scale: 1,   opacity: 1, filter: 'blur(0px)' },
  exit:    { scale: 0.5, opacity: 0, filter: 'blur(3px)' },
}

const spring = { type: 'spring', duration: 0.15, bounce: 0 } as const

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    if (copied) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <SmoothCorners asChild corners={{ radius: 11, smoothing: 0.6 }}>
    <button
      onClick={copy}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      className={cn(
        'flex items-center justify-center w-8 h-8 transition-colors duration-[150ms]',
        copied
          ? 'text-emerald-500 bg-emerald-500/10'
          : 'text-zinc-400 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-200',
        className,
      )}
    >
      {/* fixed-size slot so icon swap never shifts layout */}
      <span className="relative flex items-center justify-center w-[16px] h-[16px]">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              className="absolute inset-0 flex items-center justify-center"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={spring}
            >
              <HugeiconsIcon icon={CheckIcon} size={16} strokeWidth={4} color="currentColor" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              className="absolute inset-0 flex items-center justify-center"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={spring}
            >
              <HugeiconsIcon icon={Copy01Icon} size={16} strokeWidth={3} color="currentColor" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
    </SmoothCorners>
  )
}
