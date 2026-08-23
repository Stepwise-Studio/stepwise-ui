'use client'

import { useState, useRef, useEffect, forwardRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { TickCircle } from 'iconsax-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Chevron } from '@/components/stepwise/primitives/chevron'
import { ScrollArea } from '@/components/stepwise/scroll-area'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils/cn'

export interface MultiselectOption {
  value: string
  label: string
}

export interface MultiselectProps {
  options      : MultiselectOption[]
  value?       : string[]
  onChange?    : (values: string[]) => void
  placeholder? : string
  label?       : string
  disabled?    : boolean
  maxVisible?  : number
  className?   : string
}

const FONT = 'var(--font-inter-display)'
const TRACKING = { letterSpacing: '-0.03em' }
// A toggle chip fires on every click — a high-frequency, low-ceremony
// interaction, not an emphasis moment. Symmetric duration/easing both ways
// (same as icon-swap/text-swap, not a split open/close pair), no spring:
// springs have no fixed duration and their rest-detection tail delays when
// the element actually unmounts and lets siblings reflow, which reads as lag
// on a repeated interaction. scale 0.9, not 0.6 — anything below ~0.9 reads
// as a "zoom" rather than a subtle pop, which is its own source of felt lag.
const PILL_TRANSITION = { duration: 0.12, ease: [0.22, 1, 0.36, 1] } as const

// Selected items shown as removable pills in the trigger — pops in / shrinks out.
//
// `mode="popLayout"` clones each direct child to inject a ref and a
// `position: absolute` style the moment it starts exiting, which is what takes
// the leaving pill out of the flow so the rest can close the gap immediately.
// A plain function component swallows both, so the exiting pill used to sit in
// the flow at full width for the whole exit — leaving a blank slot, shoving the
// promoted pill and the +N counter out of the row until it finally unmounted.
// Forwarding the ref and merging the injected style is what makes popLayout
// actually apply here.
const SelectedPill = forwardRef<HTMLSpanElement, {
  label: string
  onRemove: () => void
  style?: React.CSSProperties
}>(function SelectedPill({ label, onRemove, style }, ref) {
  return (
    <motion.span
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={PILL_TRANSITION}
      className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-[100px] border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      style={{ fontSize: 13, fontFamily: FONT, lineHeight: 1, paddingTop: 5, paddingBottom: 5, paddingLeft: 8, paddingRight: 6, ...style }}
    >
      {label}
      <span
        role="button"
        aria-label={`Remove ${label}`}
        onClick={e => { e.stopPropagation(); onRemove() }}
        className="flex cursor-pointer items-center text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-100"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={10} strokeWidth={2} color="currentColor" />
      </span>
    </motion.span>
  )
})

export function Multiselect({
  options,
  value,
  onChange,
  placeholder = 'Select options',
  label,
  disabled,
  maxVisible = 2,
  className,
}: MultiselectProps) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>(value ?? [])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (value !== undefined) setSelected(value) }, [value])

  useEffect(() => {
    if (!isOpen) return
    const onMouse = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouse)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  const toggle = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter(v => v !== val)
      : [...selected, val]
    setSelected(next)
    onChange?.(next)
  }

  const removeItem = (val: string) => {
    const next = selected.filter(v => v !== val)
    setSelected(next)
    onChange?.(next)
  }

  const visibleChips = selected.slice(0, maxVisible)
  const overflow = selected.length - maxVisible

  // Open steps up one notch like Input's own focus state (zinc-400/500), not
  // a near-black/near-white ring.
  const idleBorder = dark ? '#27272a' : '#e4e4e7'
  const openBorder = dark ? '#71717a' : '#a1a1aa'
  const borderColor = disabled ? idleBorder : (isOpen ? openBorder : idleBorder)
  const openToggle = () => { if (!disabled) setIsOpen(o => !o) }

  return (
    <div ref={containerRef} className={cn('relative flex flex-col gap-1.5', disabled && 'opacity-40 pointer-events-none', className)}>
      {label && (
        <label className={cn(
          'pl-[2px] text-[13px] font-medium leading-none tracking-[-0.01em] transition-colors duration-150',
          isOpen ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500',
        )}>
          {label}
        </label>
      )}

      {/* trigger — stays mounted; pills for selected values. Its own height
          grows as pills wrap to more than one line, so the panel below is
          positioned with top-full off THIS wrapper, not a fixed pixel guess
          off the outer column — otherwise a taller (wrapped) trigger pushes
          straight through a panel still parked at the old, shorter offset. */}
      <div className="relative min-h-11 w-full">
        <Surface radius={18} className="relative min-h-11 w-full bg-white dark:bg-zinc-900">
          <button
            type="button"
            onClick={openToggle}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className="flex w-full items-center justify-between"
            style={{
              minHeight: 44,
              paddingLeft: selected.length ? 8 : 14, paddingRight: 12,
              paddingTop: selected.length ? 7 : 0, paddingBottom: selected.length ? 7 : 0,
              fontFamily: FONT,
            }}
          >
            {/* relative: popLayout parks the exiting pill with position:absolute,
                which needs this row as its containing block or it flies off to
                whatever ancestor happens to be positioned. */}
            <div className="relative mr-2 flex min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-hidden">
              {selected.length === 0 ? (
                <span className="text-[15px] text-zinc-400 dark:text-zinc-500" style={TRACKING}>
                  {placeholder}
                </span>
              ) : (
                <AnimatePresence initial={false} mode="popLayout">
                  {visibleChips.map(val => {
                    const opt = options.find(o => o.value === val)
                    if (!opt) return null
                    return <SelectedPill key={val} label={opt.label} onRemove={() => removeItem(val)} />
                  })}
                  {overflow > 0 && (
                    <motion.span
                      key="overflow"
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={PILL_TRANSITION}
                      className="inline-flex shrink-0 items-center rounded-[100px] border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      style={{ fontSize: 12, fontFamily: FONT, lineHeight: 1, padding: '5px 8px', fontWeight: 500 }}
                    >
                      +{overflow}
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
            </div>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex shrink-0 text-zinc-400 dark:text-zinc-500"
            >
              <Chevron size={16} />
            </motion.span>
          </button>
        </Surface>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ borderRadius: 18, borderWidth: 1, borderStyle: 'solid', borderColor, transition: 'border-color 250ms ease' }}
        />

        {/* panel — floats below the trigger, matches Select/Combobox */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -2 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 top-full z-50 mt-2"
              style={{ transformOrigin: 'top center' }}
            >
              <Surface
                radius={18}
                className="w-full bg-white dark:bg-zinc-900 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.06)]"
              >
                <ScrollArea maxHeight={240} className="p-1.5">
                  {options.map((opt, i) => {
                    const checked = selected.includes(opt.value)
                    return (
                      <motion.button
                        key={opt.value}
                        type="button"
                        onClick={() => toggle(opt.value)}
                        aria-pressed={checked}
                        initial={{ opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, delay: Math.min(i * 0.02, 0.12), ease: [0.22, 1, 0.36, 1] }}
                        className="w-full flex items-center gap-2.5 rounded-[12px] px-2.5 py-2 text-left transition-colors duration-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        style={{ fontFamily: FONT }}
                      >
                        <span className="relative block shrink-0" style={{ width: 16, height: 16 }}>
                          {!checked && (
                            <span className="absolute inset-0 block rounded-full border-[1.5px] border-zinc-300 dark:border-zinc-600" />
                          )}
                          <AnimatePresence>
                            {checked && (
                              <motion.span
                                key="tick"
                                className="absolute inset-0"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <TickCircle variant="Bold" size={16} className="text-zinc-900 dark:text-white" color="currentColor" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                        <span
                          className={cn(
                            'flex-1 truncate text-[14px]',
                            checked ? 'font-medium text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-200',
                          )}
                          style={TRACKING}
                        >
                          {opt.label}
                        </span>
                      </motion.button>
                    )
                  })}
                </ScrollArea>
              </Surface>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ borderRadius: 18, borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--ui-border)' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
