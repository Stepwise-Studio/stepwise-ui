'use client'

import { useState, useEffect, useRef, useMemo, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Kbd } from '@/components/stepwise/kbd'
import { ScrollArea } from '@/components/stepwise/scroll-area'
import { cn } from '@/lib/utils/cn'

export interface CommandItem {
  id: string
  label: string
  icon?: ReactNode
  /** Extra words to match against beyond the label. */
  keywords?: string
  shortcut?: string[]
  onSelect?: () => void
}

export interface CommandGroup {
  heading?: string
  items: CommandItem[]
}

export interface CommandPaletteProps {
  groups: CommandGroup[]
  /**
   * Portal target. Defaults to `document.body`. Point it at an element that
   * establishes a containing block to scope the palette's `fixed` overlay to
   * that box instead of the viewport.
   */
  container?: HTMLElement | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Bind ⌘K / Ctrl+K to toggle. Default true. */
  hotkey?: boolean
  placeholder?: string
}

const EASE = [0.22, 1, 0.36, 1] as const

export function CommandPalette({
  groups,
  container,
  open: controlledOpen,
  onOpenChange,
  hotkey = true,
  placeholder = 'Type a command or search…',
}: CommandPaletteProps) {
  const [internal, setInternal] = useState(false)
  const open = controlledOpen ?? internal
  const setOpen = (v: boolean) => {
    if (controlledOpen === undefined) setInternal(v)
    onOpenChange?.(v)
  }

  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  // ⌘K / Ctrl+K toggle
  useEffect(() => {
    if (!hotkey) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, hotkey])

  // reset on open, focus input, and restore focus to the trigger on close
  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null
      setQuery('')
      setActive(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      restoreFocusRef.current?.focus()
    }
  }, [open])

  // filter → flat list of {item, groupHeading?} preserving group order
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const out: { item: CommandItem; heading?: string; firstInGroup: boolean }[] = []
    for (const g of groups) {
      const matches = g.items.filter(it =>
        !q || `${it.label} ${it.keywords ?? ''}`.toLowerCase().includes(q),
      )
      matches.forEach((item, i) => out.push({ item, heading: g.heading, firstInGroup: i === 0 }))
    }
    return out
  }, [groups, query])

  useEffect(() => { setActive(0) }, [query])

  const run = (item: CommandItem) => {
    item.onSelect?.()
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(a => Math.min(a + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(a => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const sel = filtered[active]
      if (sel) run(sel.item)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // keep active row in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  // This custom Next.js build's SSR pass apparently exposes a partial
  // `document` global (typeof check alone isn't enough here) — guard on
  // `document.body` actually existing before handing it to createPortal.
  if (typeof document === 'undefined' || !document.body) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* scrim */}
          <div
            className="absolute inset-0 bg-zinc-950/30 backdrop-blur-[2px] dark:bg-black/50"
            onClick={() => setOpen(false)}
          />

          <motion.div
            className="relative w-full max-w-[560px]"
            initial={{ opacity: 0, scale: 0.97, y: -8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, y: -4, filter: 'blur(2px)' }}
            transition={{ duration: 0.2, ease: EASE }}
            onKeyDown={onKeyDown}
          >
            <Surface
              radius={20}
              lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
              className="overflow-hidden bg-white shadow-[0_20px_60px_-12px_rgba(0,0,0,0.28)] dark:bg-zinc-900 dark:shadow-[0_24px_70px_-12px_rgba(0,0,0,0.8)]"
            >
              {/* search row */}
              <div className="flex items-center gap-3 border-b border-zinc-100 px-4 dark:border-zinc-800">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="shrink-0 text-zinc-400">
                  <circle cx="9" cy="9" r="6" />
                  <path d="m14 14 3 3" />
                </svg>
                <input
                  ref={inputRef}
                  role="combobox"
                  aria-label="Search commands"
                  aria-expanded={open}
                  aria-controls="cmdk-list"
                  aria-activedescendant={filtered[active] ? `cmdk-${filtered[active].item.id}` : undefined}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-transparent py-4 text-[15px] tracking-[-0.02em] text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
                <Kbd className="shrink-0">Esc</Kbd>
              </div>

              {/* results */}
              <ScrollArea ref={listRef} id="cmdk-list" role="listbox" maxHeight={340} showScrollbar className="p-1.5">
                {filtered.length === 0 ? (
                  <div className="px-3 py-10 text-center text-[13.5px] text-zinc-400 dark:text-zinc-500">
                    No results for “{query}”
                  </div>
                ) : (
                  filtered.map(({ item, heading, firstInGroup }, idx) => (
                    <div key={item.id}>
                      {heading && firstInGroup && (
                        <div className={cn('px-2.5 pb-1.5 text-[12px] font-medium tracking-normal text-zinc-500 dark:text-zinc-400', idx > 0 && 'pt-3')}>
                          {heading}
                        </div>
                      )}
                      <button
                        id={`cmdk-${item.id}`}
                        role="option"
                        aria-selected={idx === active}
                        data-idx={idx}
                        onMouseMove={() => setActive(idx)}
                        onClick={() => run(item)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-[11px] px-2.5 py-2.5 text-left transition-colors duration-75',
                          idx === active ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-transparent',
                        )}
                      >
                        {item.icon && (
                          <span className={cn('flex h-[18px] w-[18px] shrink-0 items-center justify-center', idx === active ? 'text-zinc-700 dark:text-zinc-200' : 'text-zinc-400 dark:text-zinc-500')}>
                            {item.icon}
                          </span>
                        )}
                        <span className="flex-1 truncate text-[13.5px] font-medium tracking-[-0.01em] text-zinc-700 dark:text-zinc-200">
                          {item.label}
                        </span>
                        {item.shortcut && <Kbd keys={item.shortcut} />}
                      </button>
                    </div>
                  ))
                )}
              </ScrollArea>
            </Surface>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    container ?? document.body,
  )
}
