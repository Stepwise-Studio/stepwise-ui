'use client'

import { useState, useRef, useEffect, useMemo, useId } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { SearchNormal1 } from 'iconsax-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { SearchRemoveIcon } from '@hugeicons/core-free-icons'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Chevron } from '@/components/stepwise/primitives/chevron'
import { ScrollArea } from '@/components/stepwise/scroll-area'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils/cn'

export interface ComboboxOption {
  value: string
  label: string
  /** Optional secondary line shown under the label. */
  description?: string
}

export interface ComboboxProps {
  options      : ComboboxOption[]
  value?       : string
  onChange?    : (value: string) => void
  placeholder? : string
  label?       : string
  /** Shown when the query matches nothing. */
  emptyMessage?: string
  disabled?    : boolean
  className?   : string
}

const FONT = 'var(--font-inter-display)'

/** Split a label on the query so the match can be emphasised. */
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

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Search…',
  label,
  emptyMessage = 'No results found',
  disabled,
  className,
}: ComboboxProps) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const uid = useId()
  const id = `${uid}-input`
  const labelId = `${uid}-label`
  const listboxId = `${uid}-listbox`
  const optionId = (i: number) => `${uid}-option-${i}`

  const [open, setOpen]       = useState(false)
  const [query, setQuery]     = useState('')
  const [active, setActive]   = useState(0)
  const [focused, setFocused] = useState(false)
  const [selected, setSelected] = useState(value)

  const rootRef  = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef  = useRef<HTMLDivElement>(null)

  useEffect(() => { if (value !== undefined) setSelected(value) }, [value])

  const selectedOption = options.find(o => o.value === selected)

  // While closed, the field shows the chosen label; typing takes over.
  const display = open ? query : (selectedOption?.label ?? '')

  const filtered = useMemo(() => {
    if (!open || !query) return options
    const q = query.toLowerCase()
    return options.filter(o =>
      o.label.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q),
    )
  }, [options, query, open])

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // keep the active option scrolled into view
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const close = () => { setOpen(false); setQuery(''); setActive(0) }

  // Reopening should highlight the current selection, not always index 0 —
  // otherwise arrow-key navigation starts from the wrong place and there's
  // no visual cue of the existing choice.
  const openWithActive = () => {
    setOpen(true)
    const i = options.findIndex(o => o.value === selected)
    setActive(i >= 0 ? i : 0)
  }

  const commit = (opt: ComboboxOption) => {
    setSelected(opt.value)
    onChange?.(opt.value)
    close()
    // Focus stays on the input — it already shows the selected label once
    // closed, and a keyboard user's next Tab should continue naturally from
    // this field rather than being dropped to the page body.
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) { openWithActive(); return }
      setActive(a => {
        const n = filtered.length
        if (!n) return 0
        return e.key === 'ArrowDown' ? (a + 1) % n : (a - 1 + n) % n
      })
      return
    }
    if (e.key === 'Enter') {
      if (open && filtered[active]) { e.preventDefault(); commit(filtered[active]) }
      return
    }
    if (e.key === 'Escape') { close(); return }
  }

  // Active steps up one notch like Input's own focus state (zinc-400/500),
  // not a near-black/near-white ring.
  const isActive = focused || open
  const borderColor = disabled
    ? (dark ? '#27272a' : '#e4e4e7')
    : isActive
      ? (dark ? '#71717a' : '#a1a1aa')
      : (dark ? '#27272a' : '#e4e4e7')
  const fieldMiddleBorder = { width: 1, opacity: 1, color: borderColor }

  return (
    <div ref={rootRef} className={cn('relative w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label
          id={labelId}
          htmlFor={id}
          className={cn(
            'text-[13px] tracking-[-0.01em] font-medium leading-none select-none pl-[2px] transition-colors duration-150',
            focused || open ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500',
          )}
        >
          {label}
        </label>
      )}

      {/* field — the panel below is nested inside this wrapper too, so
          top-full tracks whatever height the field actually renders at
          (a wrapped label makes it taller) instead of a fixed pixel guess */}
      <div className={cn('relative w-full h-11', disabled && 'opacity-50 pointer-events-none')}>
        <Surface radius={18} lisse={{ middleBorder: fieldMiddleBorder }} className="relative h-11 w-full bg-white dark:bg-zinc-900">
          <span
            aria-hidden
            className={cn(
              'absolute left-[13px] top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150',
              isActive ? 'text-zinc-600 dark:text-zinc-300' : 'text-zinc-400 dark:text-zinc-500',
            )}
          >
            <SearchNormal1 size={17} variant="Linear" color="currentColor" />
          </span>

          <input
            ref={inputRef}
            id={id}
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={open ? optionId(active) : undefined}
            aria-labelledby={label ? labelId : undefined}
            autoComplete="off"
            disabled={disabled}
            placeholder={placeholder}
            value={display}
            onChange={e => { setQuery(e.target.value); setOpen(true); setActive(0) }}
            onFocus={() => { setFocused(true); openWithActive() }}
            onBlur={() => setFocused(false)}
            onKeyDown={onKeyDown}
            className="absolute inset-0 w-full h-full bg-transparent outline-none text-[15px] tracking-[-0.03em] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            style={{ paddingLeft: 40, paddingRight: 40, fontFamily: FONT }}
          />

          <button
            type="button"
            tabIndex={-1}
            aria-label={open ? 'Close options' : 'Open options'}
            onClick={() => { if (open) close(); else openWithActive(); inputRef.current?.focus() }}
            className="absolute right-[10px] top-1/2 -translate-y-1/2 w-7 h-7 grid place-items-center rounded-[9px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-[color,background-color] duration-150"
          >
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex"
            >
              <Chevron size={16} />
            </motion.span>
          </button>
        </Surface>

        {/* dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -2 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 top-full z-50 mt-2"
              style={{ transformOrigin: 'top center' }}
            >
              <Surface
                radius={18}
                lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
                className="w-full bg-white dark:bg-zinc-900 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.06)]"
              >
                <ScrollArea
                  id={listboxId}
                  role="listbox"
                  aria-labelledby={label ? labelId : undefined}
                  tabIndex={-1}
                  maxHeight={240}
                  showScrollbar
                  className="p-1.5"
                  ref={listRef}
                >
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 px-3 py-8">
                      <span className="text-zinc-300 dark:text-zinc-600">
                        <HugeiconsIcon icon={SearchRemoveIcon} size={22} strokeWidth={1.8} color="currentColor" />
                      </span>
                      <p className="text-center text-[13px] text-zinc-400 dark:text-zinc-500" style={{ fontFamily: FONT }}>
                        {emptyMessage}
                      </p>
                    </div>
                  ) : (
                    filtered.map((opt, i) => {
                      const isActive = i === active
                      const isSelected = opt.value === selected
                      return (
                        <motion.button
                          key={opt.value}
                          id={optionId(i)}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          tabIndex={-1}
                          data-idx={i}
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18, delay: Math.min(i * 0.02, 0.12), ease: [0.22, 1, 0.36, 1] }}
                          onMouseEnter={() => setActive(i)}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => commit(opt)}
                          className={cn(
                            'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[12px] text-left transition-colors duration-100 active:scale-[0.98]',
                            isActive ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-transparent',
                          )}
                          style={{ fontFamily: FONT }}
                        >
                          <span
                            className={cn(
                              'flex shrink-0 items-center justify-center rounded-full transition-colors duration-150',
                              isSelected
                                ? 'bg-zinc-900 dark:bg-white'
                                : 'bg-white dark:bg-zinc-900 border border-[var(--ui-border)]',
                            )}
                            style={{ width: 16, height: 16 }}
                          >
                            <AnimatePresence>
                              {isSelected && (
                                <motion.span
                                  key="dot"
                                  className="block shrink-0 rounded-full bg-white dark:bg-zinc-900"
                                  style={{ width: 6, height: 6 }}
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                />
                              )}
                            </AnimatePresence>
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className={cn('block text-[14px] truncate', isSelected ? 'font-medium text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-200')}>
                              {highlight(opt.label, query)}
                            </span>
                            {opt.description && (
                              <span className="block text-[12px] text-zinc-400 dark:text-zinc-500 truncate">
                                {highlight(opt.description, query)}
                              </span>
                            )}
                          </span>
                        </motion.button>
                      )
                    })
                  )}
                </ScrollArea>
              </Surface>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
