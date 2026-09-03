'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils/cn'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Chevron } from '@/components/stepwise/primitives/chevron'
import { Text } from '@/components/stepwise/typography'

export interface AccordionItem {
  id      : string
  title   : string
  content : React.ReactNode
}

export interface AccordionProps {
  items     : AccordionItem[]
  /** Allow multiple panels open at once. Default false. */
  multiple? : boolean
  /**
   * Item id(s) open on first render. Uncontrolled - the component owns the
   * state afterwards. An array is only honoured when `multiple` is set; a
   * single id works either way.
   */
  defaultOpen?: string | string[]
  /** Fill tint (any CSS color). Very light at rest, darker when hovered/open. */
  color?    : string
  className?: string
}

const EASE = [0.22, 1, 0.36, 1] as const

export function Accordion({ items, multiple = false, defaultOpen, color, className }: AccordionProps) {
  // Lazy initialiser: the default only seeds the first render, so later prop
  // changes do not reopen a panel the reader deliberately closed.
  const [open, setOpen] = useState<Set<string>>(() => {
    if (defaultOpen == null) return new Set()
    const ids = Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen]
    return new Set(multiple ? ids : ids.slice(0, 1))
  })
  const [hovered, setHovered] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpen(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else { if (!multiple) next.clear(); next.add(id) }
      return next
    })
  }

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      {items.map(item => {
        const isOpen = open.has(item.id)
        const active = isOpen || hovered === item.id

        // colour: default a barely-there neutral (reads almost like disabled);
        // hovered/open steps to a darker variant to signal the active row.
        const tintStyle = color
          ? { background: `color-mix(in srgb, ${color} ${active ? 26 : 12}%, transparent)` }
          : undefined
        const tintClass = color
          ? ''
          : active
            ? 'bg-zinc-200/80 dark:bg-zinc-700/45'
            : 'bg-zinc-100/70 dark:bg-zinc-800/35'

        return (
          <Surface key={item.id} radius={16} smoothing={0.6} className="overflow-hidden">
            <div
              className={cn('transition-colors duration-200 ease-out', tintClass)}
              style={{ ...tintStyle, ...(color ? { transition: 'background-color 200ms ease-out' } : {}) }}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(h => (h === item.id ? null : h))}
            >
              <button
                onClick={() => toggle(item.id)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left"
                aria-expanded={isOpen}
              >
                <Text
                  variant="h6-soft"
                  as="span"
                  className={cn(
                    'transition-colors duration-200',
                    active ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-300',
                  )}
                >
                  {item.title}
                </Text>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                  className={cn('shrink-0 transition-colors duration-200', active ? 'text-zinc-500 dark:text-zinc-300' : 'text-zinc-400 dark:text-zinc-500')}
                >
                  <Chevron size={16} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="overflow-hidden"
                  >
                    {/* answer fades + slides in a touch after the panel opens */}
                    <motion.div
                      initial={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
                      transition={{ duration: 0.3, ease: EASE, delay: 0.04 }}
                    >
                      <Text variant="caption-soft" as="div" className="px-4 pb-4 leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {item.content}
                      </Text>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Surface>
        )
      })}
    </div>
  )
}
