'use client'

import { ButtonHTMLAttributes } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Moon02Icon, Sun01Icon } from '@hugeicons/core-free-icons'
import { SmoothCorners } from '@lisse/react'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils/cn'

const iconVariants = {
  initial: { scale: 0.4, opacity: 0, filter: 'blur(4px)' },
  animate: { scale: 1,   opacity: 1, filter: 'blur(0px)' },
  exit:    { scale: 0.4, opacity: 0, filter: 'blur(4px)' },
}

const spring = { type: 'spring', duration: 0.2, bounce: 0 } as const

export function ThemeToggle({ className, onClick, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { theme, toggle } = useTheme()

  // radius = half the 36px box, not the project's usual squircle step -
  // that's what turns the hover shape into a true circle, matching the
  // GitHub icon button's plain `rounded-full` next to it.
  return (
    <SmoothCorners asChild corners={{ radius: 18, smoothing: 0.6 }}>
    <button
      onClick={e => { toggle(e); onClick?.(e) }}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      // Same palette as the GitHub icon button next to it everywhere this
      // renders - translucent `zinc-900/5` / `white/10` hover fill, not an
      // opaque `zinc-100`/`zinc-800`, and the same hover text step.
      className={cn('flex items-center justify-center w-9 h-9 cursor-pointer transition-colors duration-150 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-900/5 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-white/10', className)}
      {...props}
    >
      <span className="relative flex items-center justify-center w-[18px] h-[18px]">
        <AnimatePresence mode="wait" initial={false}>
          {theme === 'dark' ? (
            <motion.span
              key="moon"
              className="absolute inset-0 flex items-center justify-center"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={spring}
            >
              <HugeiconsIcon icon={Moon02Icon} size={18} strokeWidth={2} color="currentColor" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              className="absolute inset-0 flex items-center justify-center"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={spring}
            >
              <HugeiconsIcon icon={Sun01Icon} size={18} strokeWidth={2} color="currentColor" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
    </SmoothCorners>
  )
}
