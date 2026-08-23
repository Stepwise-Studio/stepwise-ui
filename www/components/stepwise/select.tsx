'use client'

import { useState, useRef, useEffect, useId } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Chevron } from '@/components/stepwise/primitives/chevron'
import { ScrollArea } from '@/components/stepwise/scroll-area'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils/cn'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  options      : SelectOption[]
  value?       : string
  onChange?    : (value: string) => void
  placeholder? : string
  label?       : string
  disabled?    : boolean
  className?   : string
}

const FONT = 'var(--font-inter-display)'
const TRACKING = { letterSpacing: '-0.03em' }

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  disabled,
  className,
}: SelectProps) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(value)
  const [active, setActive] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const uid = useId()
  const triggerId = `${uid}-trigger`
  const labelId = `${uid}-label`
  const listboxId = `${uid}-listbox`
  const optionId = (i: number) => `${uid}-option-${i}`

  useEffect(() => { if (value !== undefined) setSelected(value) }, [value])

  const close = () => setIsOpen(false)

  useEffect(() => {
    if (!isOpen) return
    const onMouse = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouse)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  const selectedIndex = options.findIndex(o => o.value === selected)
  const selectedLabel = selectedIndex >= 0 ? options[selectedIndex].label : undefined

  const handleSelect = (val: string) => {
    setSelected(val)
    onChange?.(val)
    close()
    triggerRef.current?.focus()
  }

  const openToggle = () => {
    if (disabled) return
    setActive(selectedIndex >= 0 ? selectedIndex : 0)
    setIsOpen(o => !o)
  }

  // Focus never leaves the trigger — the roving highlight is tracked in
  // `active` and exposed via aria-activedescendant, the same pattern native
  // comboboxes use. That sidesteps focus-restore-on-close entirely (nothing
  // else was ever focused), and keeps the trigger as the only tab stop.
  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openToggle()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(a => (a + 1) % options.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(a => (a - 1 + options.length) % options.length)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (options[active]) handleSelect(options[active].value)
    } else if (e.key === 'Escape') {
      close()
    }
  }

  // Border tokens — idle matches Input; open steps up one notch like Input's
  // own focus state (zinc-400/500), not a near-black/near-white ring.
  const idleBorder = dark ? '#27272a' : '#e4e4e7'
  const openBorder = dark ? '#71717a' : '#a1a1aa'
  const borderColor = disabled ? idleBorder : (isOpen ? openBorder : idleBorder)
  const middleBorder = { width: 1, opacity: 1, color: borderColor }

  return (
    <div ref={containerRef} className={cn('relative flex flex-col gap-1.5', disabled && 'opacity-40 pointer-events-none', className)}>
      {label && (
        <label
          id={labelId}
          htmlFor={triggerId}
          className={cn(
            'pl-[2px] text-[13px] font-medium leading-none tracking-[-0.01em] transition-colors duration-150',
            isOpen ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500',
          )}
        >
          {label}
        </label>
      )}

      {/* trigger — stays mounted; styled exactly like an Input field */}
      <div className="relative h-11 w-full">
        <Surface radius={18} lisse={{ middleBorder }} className="relative h-11 w-full bg-white dark:bg-zinc-900">
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            onClick={openToggle}
            onKeyDown={onTriggerKeyDown}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-activedescendant={isOpen ? optionId(active) : undefined}
            aria-labelledby={label ? labelId : undefined}
            className="absolute inset-0 flex items-center justify-between px-[14px]"
            style={{ fontFamily: FONT }}
          >
            <span
              className={cn('min-w-0 flex-1 truncate text-left text-[15px]', selectedLabel ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500')}
              style={TRACKING}
            >
              {selectedLabel ?? placeholder}
            </span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex shrink-0 text-zinc-400 dark:text-zinc-500"
            >
              <Chevron size={16} />
            </motion.span>
          </button>
        </Surface>
      </div>

      {/* panel — floats below the trigger, matches Combobox's dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -2 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 z-50"
            style={{ top: label ? 74 : 50, transformOrigin: 'top center' }}
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
                className="p-1.5"
              >
                {options.map((opt, i) => {
                  const isSelected = opt.value === selected
                  return (
                    <motion.button
                      key={opt.value}
                      id={optionId(i)}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={-1}
                      onClick={() => handleSelect(opt.value)}
                      onMouseEnter={() => setActive(i)}
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: Math.min(i * 0.02, 0.12), ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'w-full flex items-center gap-2.5 rounded-[12px] px-2.5 py-2 text-left transition-colors duration-100 active:scale-[0.98]',
                        i === active ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800',
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
                      <span
                        className={cn(
                          'flex-1 truncate text-[14px]',
                          isSelected ? 'font-medium text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-200',
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
