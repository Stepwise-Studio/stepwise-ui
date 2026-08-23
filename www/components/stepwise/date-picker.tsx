'use client'

import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Calendar03Icon } from '@hugeicons/core-free-icons'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Calendar, CalendarRange } from '@/components/stepwise/calendar'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils/cn'

export type DatePickerVariant = 'date' | 'range' | 'text'

export interface DatePickerProps {
  variant?: DatePickerVariant
  label?: string
  placeholder?: string
  value?: Date | null
  onChange?: (date: Date | null) => void
  from?: Date | null
  to?: Date | null
  onRangeChange?: (from: Date | null, to: Date | null) => void
  /** Fires whenever the calendar popover opens or closes — lets a parent reserve space for it. */
  onOpenChange?: (open: boolean) => void
  className?: string
}

function fmtDate(d: Date | null) {
  return d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
}

function fmtRange(f: Date | null, t: Date | null) {
  if (!f && !t) return ''
  const a = f ? f.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'
  const b = t ? t.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'
  return `${a}  →  ${b}`
}

const clampSeg = (s: string, lo: number, hi: number) =>
  String(Math.min(Math.max(parseInt(s, 10), lo), hi)).padStart(2, '0')

// DD/MM/YYYY mask: clamps day→1-31 and month→1-12 as segments complete, and drops
// the "/" in the moment a segment fills. `deleting` lets backspace remove that "/"
// instead of it snapping straight back.
function maskDate(input: string, deleting = false): string {
  const d = input.replace(/\D/g, '').slice(0, 8)
  let dd = d.slice(0, 2)
  let mm = d.slice(2, 4)
  const yy = d.slice(4, 8)
  if (dd.length === 2) dd = clampSeg(dd, 1, 31)
  if (mm.length === 2) mm = clampSeg(mm, 1, 12)

  let out = dd
  if (d.length > 2 || (d.length === 2 && !deleting)) out += '/'
  out += mm
  if (d.length > 4 || (d.length === 4 && !deleting)) out += '/'
  out += yy
  return out
}

function parseDate(s: string): Date | null {
  const d = s.replace(/\D/g, '')
  if (d.length !== 8) return null
  const day = parseInt(d.slice(0, 2)), mo = parseInt(d.slice(2, 4)) - 1, yr = parseInt(d.slice(4))
  const dt = new Date(yr, mo, day)
  return dt.getDate() === day && dt.getMonth() === mo && dt.getFullYear() === yr ? dt : null
}

const ease = [0.22, 1, 0.36, 1] as const

const calVariants = {
  hidden: (p: 'below' | 'above') => ({
    opacity: 0, y: p === 'below' ? -6 : 6, scale: 0.97, filter: 'blur(4px)',
  }),
  visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
}

const CAL_HEIGHT: Record<DatePickerVariant, number> = { date: 400, range: 490, text: 400 }

function XIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M1 1L9 9M9 1L1 9" />
    </svg>
  )
}

export function DatePicker({
  variant = 'date', label, placeholder, value, onChange, from, to, onRangeChange, onOpenChange, className,
}: DatePickerProps) {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const inputRef = useRef<HTMLDivElement>(null)
  const [open,    setOpen]    = useState(false)
  const [rawText, setRawText] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (variant !== 'text') return
    if (value) {
      const d = String(value.getDate()).padStart(2, '0')
      const m = String(value.getMonth() + 1).padStart(2, '0')
      setRawText(`${d}/${m}/${value.getFullYear()}`)
    } else {
      setRawText('')
    }
  }, [value, variant])

  function handleTextChange(e: ChangeEvent<HTMLInputElement>) {
    const deleting = e.target.value.length < rawText.length
    const masked = maskDate(e.target.value, deleting)
    setRawText(masked)
    const parsed = parseDate(masked)
    if (parsed) onChange?.(parsed)
    else if (!masked) onChange?.(null)
  }

  // Fire only when `open` actually changes — not on every render (the callback
  // identity churns), which would let sibling pickers clobber each other's state.
  const onOpenChangeRef = useRef(onOpenChange)
  onOpenChangeRef.current = onOpenChange
  useEffect(() => { onOpenChangeRef.current?.(open) }, [open])

  function handleCalendarPick(date: Date) {
    onChange?.(date)
    setOpen(false)
  }

  function clear() {
    onChange?.(null)
    onRangeChange?.(null, null)
    setRawText('')
  }

  const active = open || focused
  // Icon mirrors the Input component: stroke thickens and colour warms on focus/open.
  const calIcon = (
    <HugeiconsIcon icon={Calendar03Icon} size={18} strokeWidth={active ? 2 : 1.5} color="currentColor" />
  )
  const borderColor = active
    ? (dark ? '#d4d4d8' : '#3f3f46')
    : (dark ? '#27272a' : '#e4e4e7')

  const displayValue = variant === 'date'  ? fmtDate(value ?? null)
    : variant === 'range' ? fmtRange(from ?? null, to ?? null)
    : ''

  const hasValue  = variant === 'text' ? !!rawText : !!displayValue
  const defaultPH = variant === 'date'  ? 'Pick a date'
    : variant === 'range' ? 'Pick a date range'
    : 'DD / MM / YYYY'

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <span className="text-[13px] tracking-[-0.01em] font-medium text-zinc-400 dark:text-zinc-500 leading-none pl-[2px]">
          {label}
        </span>
      )}

      <div ref={inputRef} className="relative w-full h-11">
        <Surface radius={18} className="relative h-11 w-full bg-white dark:bg-zinc-900">

          {/* Calendar icon */}
          {variant === 'text' ? (
            <button
              onClick={() => setOpen(o => !o)}
              aria-label="Open calendar"
              className={cn(
                'absolute left-0 top-0 h-full w-[42px] flex items-center justify-center cursor-pointer',
                '[&_svg]:transition-[stroke-width,color] [&_svg]:duration-200',
                active
                  ? 'text-zinc-600 dark:text-zinc-300'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300',
              )}
            >
              {calIcon}
            </button>
          ) : (
            <div className={cn(
              'absolute left-[13px] top-1/2 -translate-y-1/2 pointer-events-none',
              '[&_svg]:transition-[stroke-width,color] [&_svg]:duration-200',
              active ? 'text-zinc-600 dark:text-zinc-300' : 'text-zinc-400 dark:text-zinc-500',
            )}>
              {calIcon}
            </div>
          )}

          {/* Trigger / input */}
          {variant === 'text' ? (
            <input
              type="text"
              value={rawText}
              placeholder={placeholder ?? defaultPH}
              onChange={handleTextChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={cn(
                'absolute inset-0 w-full h-full bg-transparent outline-none tabular-nums',
                'text-[15px] tracking-[-0.03em] text-zinc-900 dark:text-zinc-100',
                'placeholder:text-zinc-400 dark:placeholder:text-zinc-500',
              )}
              style={{ paddingLeft: 42, paddingRight: rawText ? 40 : 14 }}
            />
          ) : (
            <div
              role="button" tabIndex={0}
              onClick={() => setOpen(o => !o)}
              onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
              className="absolute inset-0 flex items-center cursor-pointer active:scale-[0.99] transition-transform duration-75"
              style={{ paddingLeft: 42, paddingRight: hasValue ? 40 : 14 }}
            >
              <span className={cn(
                'text-[15px] tracking-[-0.03em] truncate flex-1 tabular-nums',
                hasValue ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500',
              )}>
                {displayValue || (placeholder ?? defaultPH)}
              </span>
            </div>
          )}

          {/* Clear */}
          {hasValue && (
            <button
              onClick={e => { e.stopPropagation(); clear() }}
              aria-label="Clear"
              className={cn(
                'absolute right-[6px] top-1/2 -translate-y-1/2',
                'w-[32px] h-[32px] flex items-center justify-center cursor-pointer',
                'text-zinc-400 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400',
                'transition-colors duration-150',
              )}
            >
              <XIcon />
            </button>
          )}
        </Surface>

        {/* Border overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 18, borderWidth: '1px', borderStyle: 'solid', borderColor,
            transition: 'border-color 200ms ease-in-out',
          }}
        />

        {/* Calendar — absolute below the input, clipped by the parent overflow container */}
        <AnimatePresence initial={false}>
          {open && (
            <>
              <div className="fixed inset-0 z-[49]" onClick={() => setOpen(false)} />
              <motion.div
                className="absolute left-0 top-[calc(100%+8px)] z-50"
                style={{ transformOrigin: 'top center', willChange: 'transform, opacity, filter' }}
                custom="below"
                variants={calVariants}
                initial="hidden" animate="visible" exit="hidden"
                transition={{ duration: 0.22, ease }}
              >
                {variant === 'range' ? (
                  <CalendarRange from={from} to={to} onRangeChange={onRangeChange} />
                ) : (
                  <Calendar selected={value} onSelect={handleCalendarPick} />
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
