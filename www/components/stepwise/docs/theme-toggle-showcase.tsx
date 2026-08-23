'use client'

import { useTheme } from '@/lib/theme'
import { ThemeToggle } from '@/components/stepwise/theme-toggle'

export function ThemeToggleShowcase() {
  const { toggle } = useTheme()
  return (
    <div
      onClick={toggle}
      className="border border-zinc-200 dark:border-zinc-700/70 rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150 cursor-pointer"
    >
      {/* pointer-events-none so the inner button doesn't double-fire */}
      <div className="pointer-events-none">
        <ThemeToggle />
      </div>
    </div>
  )
}
