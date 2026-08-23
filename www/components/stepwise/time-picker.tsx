'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion, animate } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Clock01Icon } from '@hugeicons/core-free-icons'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Segment } from '@/components/stepwise/segment'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils/cn'

export interface TimePickerProps {
  /** "HH:mm" in 24h — display format is presentational only. */
  value?     : string
  onChange?  : (value: string) => void
  label?     : string
  placeholder?: string
  /** 12-hour display with AM/PM. Default true. */
  use12Hour? : boolean
  /** Minute increment. Default 5. */
  step?      : number
  disabled?  : boolean
  className? : string
  /** Fires when the panel opens or closes — lets a parent reserve space. */
  onOpenChange?: (open: boolean) => void
}

const FONT = 'var(--font-inter-display)'
const EASE = [0.22, 1, 0.36, 1] as const
const ITEM_H = 36
const VISIBLE = 3
const WINDOW_H = ITEM_H * VISIBLE
/** Degrees of cylinder bend per row away from centre. */
const DEG_PER_ROW = 18
const pad = (n: number) => String(n).padStart(2, '0')

function parse(v: string | undefined) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(v ?? '')
  const h = m ? Math.min(23, +m[1]) : 9
  const min = m ? Math.min(59, +m[2]) : 0
  return { h, m: min }
}

function nearest(n: number, items: number[]) {
  return items.reduce((best, x) => (Math.abs(x - n) < Math.abs(best - n) ? x : best), items[0] ?? n)
}

function XIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M1 1L9 9M9 1L1 9" />
    </svg>
  )
}

type Unit = 'hour' | 'minute'

function Drum({
  items, value, onPick, format, label, reduce,
}: {
  items: number[]
  value: number
  onPick: (n: number) => void
  format?: (n: number) => string
  label: string
  reduce: boolean | null
}) {
  const current = items.includes(value) ? value : nearest(value, items)
  const idx = Math.max(0, items.indexOf(current))
  const [pos, setPos] = useState(idx)
  const posRef = useRef(idx)
  const drag = useRef<{ y: number; origin: number; moved: boolean } | null>(null)
  const animRef = useRef<{ stop: () => void } | null>(null)
  const goalRef = useRef(idx)
  const wheelPending = useRef(0)
  const wheelRaf = useRef(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const rollToRef = useRef<(raw: number) => void>(() => {})
  const onPickRef = useRef(onPick)
  const valueRef = useRef(value)
  const itemsRef = useRef(items)
  onPickRef.current = onPick
  valueRef.current = value
  itemsRef.current = items

  const clampPos = (n: number) => Math.max(0, Math.min(itemsRef.current.length - 1, n))

  const commit = (raw: number) => {
    const next = clampPos(Math.round(raw))
    posRef.current = next
    setPos(next)
    const picked = itemsRef.current[next]
    if (picked !== undefined && picked !== valueRef.current) onPickRef.current(picked)
  }

  const rollTo = (raw: number) => {
    const to = clampPos(Math.round(raw))
    goalRef.current = to
    animRef.current?.stop()
    if (reduce || Math.abs(posRef.current - to) < 0.02) {
      commit(to)
      return
    }
    animRef.current = animate(posRef.current, to, {
      type: 'spring',
      stiffness: 380,
      damping: 34,
      bounce: 0,
      onUpdate: v => {
        posRef.current = v
        setPos(v)
      },
      onComplete: () => commit(to),
    })
  }

  useEffect(() => {
    if (drag.current) return
    if (Math.abs(posRef.current - idx) < 0.04) {
      goalRef.current = idx
      return
    }
    rollTo(idx)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  rollToRef.current = rollTo

  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    const wheelUnits = (e: WheelEvent) => {
      if (e.deltaMode === 1) return e.deltaY
      if (e.deltaMode === 2) return e.deltaY * VISIBLE
      return e.deltaY / 80
    }

    const pump = () => {
      const pending = wheelPending.current
      const max = 0.2
      const chunk = Math.abs(pending) <= max ? pending : Math.sign(pending) * max
      wheelPending.current -= chunk
      const next = clampPos(posRef.current + chunk)
      posRef.current = next
      setPos(next)
      if (Math.abs(wheelPending.current) > 0.001) {
        wheelRaf.current = requestAnimationFrame(pump)
      } else {
        wheelPending.current = 0
        wheelRaf.current = 0
        rollToRef.current(posRef.current)
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!e.deltaY) return
      animRef.current?.stop()
      wheelPending.current += wheelUnits(e)
      if (!wheelRaf.current) wheelRaf.current = requestAnimationFrame(pump)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      if (wheelRaf.current) cancelAnimationFrame(wheelRaf.current)
    }
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    animRef.current?.stop()
    wheelPending.current = 0
    if (wheelRaf.current) {
      cancelAnimationFrame(wheelRaf.current)
      wheelRaf.current = 0
    }
    drag.current = { y: e.clientY, origin: posRef.current, moved: false }
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const dy = e.clientY - drag.current.y
    if (Math.abs(dy) > 3) drag.current.moved = true
    const next = clampPos(drag.current.origin - dy / ITEM_H)
    posRef.current = next
    setPos(next)
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current) return
    const moved = drag.current.moved
    const y = e.clientY
    drag.current = null
    if (moved) {
      rollTo(posRef.current)
      return
    }
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    const delta = (y - (rect.top + rect.height / 2)) / ITEM_H
    rollTo(posRef.current + delta)
  }

  const radius = ITEM_H / Math.sin((DEG_PER_ROW * Math.PI) / 180)

  return (
    <div
      ref={stageRef}
      role="listbox"
      aria-label={label}
      aria-activedescendant={`${label}-${items[Math.round(clampPos(pos))]}`}
      // min-w/max-w + flex-1 basis-0 instead of a fixed shrink-0 width — the
      // cylinder math only depends on ITEM_H (vertical), never on the
      // drum's own width, so it's safe to let this column compress in a
      // narrow trigger instead of forcing the row wider than its panel.
      className="relative min-w-[3.25rem] max-w-[4.75rem] flex-1 basis-0 cursor-ns-resize touch-none overflow-hidden select-none"
      style={{
        height: WINDOW_H,
        perspective: reduce ? undefined : 320,
        maskImage: 'linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {items.map((n, i) => {
        const d = i - pos
        const abs = Math.abs(d)
        if (abs > 3.2) return null
        const on = Math.round(pos) === i
        const rad = (d * DEG_PER_ROW * Math.PI) / 180
        const y = Math.sin(rad) * radius
        const z = (Math.cos(rad) - 1) * radius
        return (
          <div
            key={n}
            id={`${label}-${n}`}
            role="option"
            aria-selected={on}
            className={cn(
              'pointer-events-none absolute inset-x-0 z-[2] flex items-center justify-center tabular-nums',
              on ? 'font-semibold text-sky-500' : 'font-normal text-zinc-400 dark:text-zinc-500',
            )}
            style={{
              top: '50%',
              height: ITEM_H,
              marginTop: -ITEM_H / 2,
              fontSize: on ? 20 : 14,
              letterSpacing: '-0.03em',
              opacity: Math.max(0.06, 1 - abs * 0.32),
              transform: reduce
                ? `translateY(${d * ITEM_H}px)`
                : `translateY(${y}px) rotateX(${-d * DEG_PER_ROW}deg) translateZ(${z}px)`,
              transformOrigin: 'center center',
              backfaceVisibility: 'hidden',
            }}
          >
            {format ? format(n) : pad(n)}
          </div>
        )
      })}
    </div>
  )
}

function DigitSlot({
  value, min, max, active, onFocus, onCommit, label,
}: {
  value: number
  min: number
  max: number
  active: boolean
  onFocus: () => void
  onCommit: (n: number) => void
  label: string
}) {
  const [raw, setRaw] = useState(pad(value))
  useEffect(() => { setRaw(pad(value)) }, [value])

  const flush = (s: string) => {
    if (!s) { setRaw(pad(value)); return }
    const n = Math.min(max, Math.max(min, parseInt(s, 10)))
    setRaw(pad(n))
    onCommit(n)
  }

  return (
    <div className="relative flex flex-col items-center">
      <input
        aria-label={label}
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={2}
        value={raw}
        onFocus={e => {
          onFocus()
          e.currentTarget.select()
        }}
        onChange={e => {
          const d = e.target.value.replace(/\D/g, '').slice(0, 2)
          setRaw(d)
          if (d.length === 2) flush(d)
        }}
        onBlur={() => flush(raw)}
        autoComplete="off"
        spellCheck={false}
        placeholder="00"
        className={cn(
          'w-[2.6ch] bg-transparent pb-1 text-center text-[20px] font-semibold tabular-nums tracking-[-0.04em]',
          'caret-sky-500 outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600',
          active ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300',
        )}
      />
      <span
        aria-hidden
        className={cn(
          'h-[2px] w-full rounded-full transition-colors duration-150',
          active ? 'bg-sky-500' : 'bg-zinc-200 dark:bg-zinc-700',
        )}
      />
    </div>
  )
}

/**
 * Time field matching DatePicker chrome. Split readout, sliding AM/PM,
 * and 3D snap drums (wheel or drag — no scrollbar). Value is always 24h "HH:mm".
 */
export function TimePicker({
  value,
  onChange,
  label,
  placeholder = 'Select time',
  use12Hour = true,
  step = 5,
  disabled,
  className,
  onOpenChange,
}: TimePickerProps) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const reduce = useReducedMotion()
  const uid = useId()
  const labelId = `${uid}-label`
  const rootRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [unit, setUnit] = useState<Unit>('hour')
  const [place, setPlace] = useState<'below' | 'above'>('below')

  const { h, m } = parse(value)
  const [time, setTime] = useState({ h, m })
  useEffect(() => { if (value !== undefined) setTime(parse(value)) }, [value])

  const isControlled = value !== undefined
  const [touched, setTouched] = useState(false)
  const hasValue = isControlled ? value !== '' : touched

  const minutes = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step)
  const hours = use12Hour
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : Array.from({ length: 24 }, (_, i) => i)

  const pm = time.h >= 12
  const display12 = time.h % 12 === 0 ? 12 : time.h % 12
  const hourValue = use12Hour ? display12 : time.h
  const minuteValue = minutes.includes(time.m) ? time.m : nearest(time.m, minutes)
  const display = use12Hour
    ? `${display12}:${pad(time.m)} ${pm ? 'PM' : 'AM'}`
    : `${pad(time.h)}:${pad(time.m)}`

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return
    const r = rootRef.current.getBoundingClientRect()
    const below = window.innerHeight - r.bottom
    const above = r.top
    setPlace(below < 240 && above > below ? 'above' : 'below')
  }, [open])

  const onOpenChangeRef = useRef(onOpenChange)
  onOpenChangeRef.current = onOpenChange
  useEffect(() => { onOpenChangeRef.current?.(open) }, [open])

  useEffect(() => {
    if (open) {
      setUnit('hour')
      requestAnimationFrame(() => dialogRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const commit = (next: { h: number; m: number }) => {
    setTime(next)
    setTouched(true)
    onChange?.(`${pad(next.h)}:${pad(next.m)}`)
  }

  const pickHour = (n: number) => {
    if (!use12Hour) return commit({ ...time, h: n })
    const base = n % 12
    commit({ ...time, h: pm ? base + 12 : base })
  }

  const setMeridiem = (toPm: boolean) => {
    const base = time.h % 12
    commit({ ...time, h: toPm ? base + 12 : base })
  }

  const stepUnit = (dir: 1 | -1) => {
    if (unit === 'hour') {
      const list = hours
      const idx = list.indexOf(hourValue)
      const next = list[(idx + dir + list.length) % list.length]
      pickHour(next)
    } else {
      const idx = minutes.indexOf(minuteValue)
      const next = minutes[(idx + dir + minutes.length) % minutes.length]
      commit({ ...time, m: next })
    }
  }

  const digitBuf = useRef('')
  const digitTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const typeDigit = (d: string) => {
    const next = (digitBuf.current + d).slice(-2)
    digitBuf.current = next
    clearTimeout(digitTimer.current)
    if (unit === 'hour') {
      const n = parseInt(next, 10)
      if (use12Hour) {
        if (next.length === 1 && n > 1) {
          pickHour(n)
          digitBuf.current = ''
          setUnit('minute')
        } else if (next.length === 2) {
          pickHour(Math.min(12, Math.max(1, n || 12)))
          digitBuf.current = ''
          setUnit('minute')
        }
      } else {
        if (next.length === 1 && n > 2) {
          pickHour(n)
          digitBuf.current = ''
          setUnit('minute')
        } else if (next.length === 2) {
          pickHour(Math.min(23, n))
          digitBuf.current = ''
          setUnit('minute')
        }
      }
    } else {
      const n = parseInt(next, 10)
      if (next.length === 2) {
        commit({ ...time, m: nearest(Math.min(59, n), minutes) })
        digitBuf.current = ''
      }
    }
    digitTimer.current = setTimeout(() => { digitBuf.current = '' }, 900)
  }

  const onPanelKey = (e: React.KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return
    switch (e.key) {
      case 'ArrowUp':   e.preventDefault(); stepUnit(-1); break
      case 'ArrowDown': e.preventDefault(); stepUnit(1); break
      case 'ArrowLeft': e.preventDefault(); setUnit('hour'); break
      case 'ArrowRight': e.preventDefault(); setUnit('minute'); break
      case 'Enter':     e.preventDefault(); setOpen(false); break
      default:
        if (/^\d$/.test(e.key)) { e.preventDefault(); typeDigit(e.key) }
    }
  }

  const clear = () => {
    setTouched(false)
    setTime(parse(undefined))
    onChange?.('')
  }

  const active = open || focused
  const borderColor = disabled
    ? (dark ? '#27272a' : '#e4e4e7')
    : active ? (dark ? '#d4d4d8' : '#3f3f46') : (dark ? '#27272a' : '#e4e4e7')

  const panelMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: place === 'below' ? -6 : 6, scale: 0.97, filter: 'blur(4px)' },
        animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
        exit:    { opacity: 0, y: place === 'below' ? -4 : 4, scale: 0.98, filter: 'blur(2px)' },
      }

  return (
    <div ref={rootRef} className={cn('relative flex w-full min-w-0 flex-col gap-1.5', className)}>
      {label && (
        <span
          id={labelId}
          className={cn(
            'pl-[2px] text-[13px] font-medium leading-none tracking-[-0.01em] transition-colors duration-150',
            active ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500',
          )}
        >
          {label}
        </span>
      )}

      <div className={cn('relative h-11 w-full', disabled && 'pointer-events-none opacity-50')}>
        <Surface radius={18} className="relative h-11 w-full bg-white dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-labelledby={label ? labelId : undefined}
            aria-label={label ? undefined : 'Time'}
            className={cn(
              'absolute inset-0 flex cursor-pointer items-center gap-2.5 px-[13px] text-left',
              'rounded-[18px] outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400',
            )}
            style={{ fontFamily: FONT, paddingRight: hasValue ? 40 : 13 }}
          >
            <HugeiconsIcon
              icon={Clock01Icon}
              size={17}
              strokeWidth={active ? 2 : 1.5}
              color="currentColor"
              className={cn(
                'shrink-0 transition-[color] duration-200',
                active ? 'text-zinc-600 dark:text-zinc-300' : 'text-zinc-400 dark:text-zinc-500',
              )}
            />
            <span className={cn(
              'min-w-0 flex-1 truncate text-[15px] tabular-nums tracking-[-0.03em]',
              hasValue ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500',
            )}>
              {hasValue ? display : placeholder}
            </span>
          </button>

          {hasValue && !disabled && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); clear() }}
              aria-label="Clear time"
              className={cn(
                'absolute right-[6px] top-1/2 z-10 flex h-[32px] w-[32px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full',
                'text-zinc-400 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400',
                'outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-sky-600 active:scale-[0.96] dark:focus-visible:ring-sky-400',
              )}
            >
              <XIcon />
            </button>
          )}
        </Surface>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ borderRadius: 18, borderWidth: 1, borderStyle: 'solid', borderColor, transition: 'border-color 250ms ease' }}
        />

        <AnimatePresence initial={false}>
          {open && (
            <>
              <div className="fixed inset-0 z-[49]" onClick={() => setOpen(false)} />
              <motion.div
                ref={dialogRef}
                role="dialog"
                aria-label="Choose time"
                tabIndex={-1}
                onKeyDown={onPanelKey}
                {...panelMotion}
                transition={{ duration: reduce ? 0.1 : 0.22, ease: EASE }}
                className={cn(
                  'absolute inset-x-0 z-50 outline-none',
                  place === 'below' ? 'top-[calc(100%+8px)]' : 'bottom-[calc(100%+8px)]',
                )}
                style={{
                  transformOrigin: place === 'below' ? 'top center' : 'bottom center',
                  fontFamily: FONT,
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-10"
                  style={{ borderRadius: 20, borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--ui-border)' }}
                />
                <Surface
                  radius={20}
                  className={cn(
                    'w-full bg-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] dark:bg-zinc-900',
                    use12Hour ? 'px-3 py-3.5' : 'px-3 py-5',
                  )}
                >
                  <div className={cn('flex flex-col items-center', use12Hour ? 'gap-3' : 'gap-4')}>
                    <div className="flex items-end justify-center gap-1.5">
                        <DigitSlot
                          label="Hours"
                          value={use12Hour ? display12 : time.h}
                          min={use12Hour ? 1 : 0}
                          max={use12Hour ? 12 : 23}
                          active={unit === 'hour'}
                          onFocus={() => setUnit('hour')}
                          onCommit={pickHour}
                        />
                        <span className="pb-[7px] text-[20px] font-semibold text-zinc-300 dark:text-zinc-600">:</span>
                        <DigitSlot
                          label="Minutes"
                          value={time.m}
                          min={0}
                          max={59}
                          active={unit === 'minute'}
                          onFocus={() => setUnit('minute')}
                          onCommit={n => commit({ ...time, m: nearest(n, minutes) })}
                        />
                    </div>

                    <div className="flex w-full min-w-0 items-stretch justify-center">
                      <Drum
                        items={hours}
                        value={hourValue}
                        onPick={n => { pickHour(n); setUnit('hour') }}
                        format={use12Hour ? String : pad}
                        label="Hours"
                        reduce={reduce}
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none z-[2] flex w-3 shrink-0 items-center justify-center text-[18px] font-medium text-zinc-300 dark:text-zinc-600"
                      >
                        :
                      </span>
                      <Drum
                        items={minutes}
                        value={minuteValue}
                        onPick={n => { commit({ ...time, m: n }); setUnit('minute') }}
                        label="Minutes"
                        reduce={reduce}
                      />
                    </div>

                      {use12Hour && (
                        <Segment
                          size="sm"
                          value={pm ? 'PM' : 'AM'}
                          onChange={v => setMeridiem(v === 'PM')}
                          options={[
                            { value: 'AM', label: 'AM' },
                            { value: 'PM', label: 'PM' },
                          ]}
                        />
                      )}
                  </div>
                </Surface>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
