'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Menu01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { SmoothCorners } from '@lisse/react'
import { Text } from '@/components/stepwise/typography'
import { Surface } from '@/components/stepwise/primitives/surface'
import { ThemeToggle } from '@/components/stepwise/theme-toggle'
import { CommandPalette, type CommandGroup } from '@/components/stepwise/command'
import { Kbd } from '@/components/stepwise/kbd'
import { SidebarNav } from './sidebar-nav'

interface NavItem { href: string; label: string }
interface NavSection { label: string; items: NavItem[] }

const iconVariants = {
  initial: { scale: 0.7, opacity: 0 },
  animate: { scale: 1,   opacity: 1 },
  exit:    { scale: 0.7, opacity: 0 },
}

export function DocsHeader({ sections }: { sections: NavSection[] }) {
  const [open, setOpen] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const router = useRouter()

  const groups: CommandGroup[] = sections.map(section => ({
    heading: section.label,
    items: section.items.map(item => ({
      id: item.href,
      label: item.label,
      onSelect: () => router.push(item.href),
    })),
  }))

  return (
    <>
      {/* Sticky top bar */}
      <header className="sticky top-0 z-40 flex items-center h-14 px-3 border-b border-zinc-100 dark:border-zinc-900 bg-white/85 dark:bg-[oklch(0.09_0_0)]/85 backdrop-blur-md">
        {/* Hamburger — mobile only */}
        <SmoothCorners asChild corners={{ radius: 11, smoothing: 0.6 }}>
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden flex items-center justify-center w-9 h-9 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150"
          aria-label="Toggle navigation"
        >
          <span className="relative flex items-center justify-center w-[18px] h-[18px]">
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span key="close" className="absolute inset-0 flex items-center justify-center" variants={iconVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.12 }}>
                  <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} color="currentColor" />
                </motion.span>
              ) : (
                <motion.span key="menu" className="absolute inset-0 flex items-center justify-center" variants={iconVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.12 }}>
                  <HugeiconsIcon icon={Menu01Icon} size={18} strokeWidth={2} color="currentColor" />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </button>
        </SmoothCorners>

        {/* Brand — mobile only (desktop sidebar has it) */}
        <Link href="/" className="flex items-center gap-2 px-2 md:hidden">
          <Surface radius={5} className="w-5 h-5 bg-zinc-900 dark:bg-white" />
          <Text variant="h6" as="span" className="text-zinc-900 dark:text-white">Stepwise UI</Text>
        </Link>

        <div className="flex-1" />

        <button
          onClick={() => setCmdOpen(true)}
          className="mr-2 hidden h-9 items-center gap-2 rounded-full border border-zinc-200 px-3 text-[13px] text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-800 sm:flex dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="shrink-0">
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 3 3" />
          </svg>
          Search docs
          <Kbd className="ml-1">⌘K</Kbd>
        </button>

        <ThemeToggle />
      </header>

      <CommandPalette
        groups={groups}
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        placeholder="Search components, effects, cards…"
      />

      {/* Mobile slide-over drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-black/20 dark:bg-black/50 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 40, bounce: 0 }}
              className="fixed top-14 left-0 bottom-0 z-40 w-64 border-r border-zinc-100 dark:border-zinc-900 bg-white dark:bg-[oklch(0.09_0_0)] px-4 py-6 overflow-y-auto md:hidden"
            >
              <SidebarNav sections={sections} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
