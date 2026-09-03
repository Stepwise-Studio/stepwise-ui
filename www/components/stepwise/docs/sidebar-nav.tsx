'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Text } from '@/components/stepwise/typography'
import { cn } from '@/lib/utils/cn'

interface NavItem {
  href: string
  label: string
}

interface NavSection {
  label: string
  items: NavItem[]
}

/** Split a label on the query so the match can be emphasised - same
 *  technique and styling as `Combobox`'s own `highlight`, used here by
 *  `MobileBottomNav`'s in-sheet search. */
function highlight(label: string, query: string) {
  if (!query) return <>{label}</>
  const i = label.toLowerCase().indexOf(query.toLowerCase())
  if (i === -1) return <>{label}</>
  return (
    <>
      {label.slice(0, i)}
      <mark className="bg-transparent text-sky-600 dark:text-sky-400 font-semibold">
        {label.slice(i, i + query.length)}
      </mark>
      {label.slice(i + query.length)}
    </>
  )
}

export function SidebarNav({ sections, query }: { sections: NavSection[]; query?: string }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-6">
      {sections.map(section => (
        <div key={section.label}>
          {/* Deliberately a step stronger than the items below it
              (zinc-500/400): at the same colour, weight and size alone were
              not enough separation to read as a heading. */}
          <Text variant="h6" as="p" className="text-zinc-800 dark:text-zinc-200 mb-2 px-2">
            {section.label}
          </Text>
          <ul className="flex flex-col gap-0.5">
            {section.items.map(item => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'group relative flex items-center px-3 py-2 rounded-[14px]',
                      'transition-colors duration-150',
                      active
                        ? ''
                        : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-900',
                    )}
                  >
                    {/* Independent fade per item instead of one shared pill
                        sliding/morphing across the list (layoutId) - the old
                        active item's highlight fades out on its own while
                        the new one fades in on its own, no cross-item motion.
                        A small scale overshoot on entrance only (never on
                        exit - a bouncy close reads wrong) gives it some life
                        instead of a flat fade. */}
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          key="pill"
                          className="absolute inset-0 rounded-[14px] bg-sky-500/10"
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.1, ease: [0.22, 1, 0.36, 1] } }}
                          transition={{ duration: 0.2, ease: [0.34, 1.4, 0.64, 1] }}
                        />
                      )}
                    </AnimatePresence>
                    <Text
                      variant="detail"
                      as="span"
                      className={cn(
                        'relative z-10 transition-colors font-medium duration-150',
                        active
                          ? 'text-sky-500'
                          : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100',
                      )}
                    >
                      {query ? highlight(item.label, query) : item.label}
                    </Text>
                  </Link>
                </li>
              )
            })}
            {section.items.length === 0 && (
              <li className="px-2 py-2">
                <Text variant="body" as="span" className="text-zinc-400 dark:text-zinc-700">
                  Coming soon
                </Text>
              </li>
            )}
          </ul>
        </div>
      ))}
    </nav>
  )
}
