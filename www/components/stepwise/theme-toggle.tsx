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

  return (
    <SmoothCorners asChild corners={{ radius: 13, smoothing: 0.6 }}>
    <button
      onClick={e => { toggle(e); onClick?.(e) }}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn('flex items-center justify-center w-9 h-9 cursor-pointer transition-colors duration-150 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800', className)}
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
