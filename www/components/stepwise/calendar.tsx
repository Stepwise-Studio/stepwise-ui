'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Surface } from '@/components/stepwise/primitives/surface'
import { cn } from '@/lib/utils/cn'

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

interface CalDay { date: Date; day: number; isCurrentMonth: boolean }

function getCalendarDays(year: number, month: number): CalDay[] {
  const startDow    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev  = new Date(year, month, 0).getDate()
  const days: CalDay[] = []
  for (let i = startDow - 1; i >= 0; i--)
    days.push({ date: new Date(year, month - 1, daysInPrev - i), day: daysInPrev - i, isCurrentMonth: false })
  for (let d = 1; d <= daysInMonth; d++)
    days.push({ date: new Date(year, month, d), day: d, isCurrentMonth: true })
  const tail = 7 - (days.length % 7)
  if (tail < 7)
    for (let d = 1; d <= tail; d++)
      days.push({ date: new Date(year, month + 1, d), day: d, isCurrentMonth: false })
  return days
}

function sameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/* ── Icons ─────────────────────────────────────────────────────────────────── */
function ChevLeft()  { return <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 1L1 6L6 11"/></svg> }
function ChevRight() { return <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L6 6L1 11"/></svg> }

function ChevDown({ open }: { open: boolean }) {
  return (
    <motion.svg width="9" height="5" viewBox="0 0 9 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22, ease: [0.22,1,0.36,1] }}
    ><path d="M1 1L4.5 4L8 1"/></motion.svg>
  )
}

/* ── Motion variants ────────────────────────────────────────────────────────── */
const slideVariants = {
  enter: (dir: number) => ({ x: dir * 28, opacity: 0, filter: 'blur(4px)' }),
  center: { x: 0, opacity: 1, filter: 'blur(0px)' },
  exit:  (dir: number) => ({ x: -dir * 28, opacity: 0, filter: 'blur(4px)' }),
}

// Text slides in the direction of navigation — next month slides up, prev slides down.
// Gentle distance + light blur keeps the swap buttery rather than snappy.
const textVariants = {
  enter: (dir: number) => ({ y: dir * 8, opacity: 0, filter: 'blur(2px)' }),
  center: { y: 0, opacity: 1, filter: 'blur(0px)' },
  exit:  (dir: number) => ({ y: -dir * 8, opacity: 0, filter: 'blur(2px)' }),
}
const TEXT_SWAP = { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const }

const panelVariants = {
  hidden:  { opacity: 0, scale: 0.97, filter: 'blur(3px)' },
  visible: { opacity: 1, scale: 1,    filter: 'blur(0px)' },
}

const ease = [0.22, 1, 0.36, 1] as const

/* ── Nav button ─────────────────────────────────────────────────────────────── */
function NavBtn({ delta, onClick }: { delta: -1 | 1; onClick: () => void }) {
  return (
    <motion.button onClick={onClick}
      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.86 }}
      transition={{ type: 'spring', stiffness: 700, damping: 38 }}
      aria-label={delta === -1 ? 'Previous' : 'Next'}
      className="cursor-pointer p-[6px] -m-[6px]"
    >
      <Surface radius={100} lisse={{ middleBorder: { width: 1, opacity: 0.625, color: 'var(--ui-border)' } }}
        className={cn(
          'size-[30px] flex items-center justify-center',
          'text-zinc-400 dark:text-zinc-500',
          'hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200',
          'transition-[background-color,color] duration-[120ms]',
        )}
      >{delta === -1 ? <ChevLeft /> : <ChevRight />}</Surface>
    </motion.button>
  )
}

/* ── Shared header ──────────────────────────────────────────────────────────── */
interface CalHeaderProps {
  viewYear: number; viewMonth: number; direction: number
  pickerOpen: boolean
  onToggle: () => void
  onNavigate: (d: number) => void
}

function CalHeader({ viewYear, viewMonth, direction, pickerOpen, onToggle, onNavigate }: CalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-1 w-full">
      {/* One pill = one dropdown. The whole thing highlights on hover so it never reads
          as "only the month is changeable". */}
      <button onClick={onToggle} className="group cursor-pointer" aria-expanded={pickerOpen} aria-label="Open month and year picker">
        <Surface radius={100} lisse={{ middleBorder: { width: 1, opacity: 0.625, color: 'var(--ui-border)' } }}
          className="flex items-stretch overflow-hidden"
        >
          {/* Year section — active-looking (not faded), keyed on the year so it only
              animates when the year actually changes */}
          <div className="flex items-center px-3 py-[7px] self-stretch overflow-hidden bg-zinc-200/70 dark:bg-zinc-800/80 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700/80 transition-colors duration-150">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.span key={viewYear} custom={direction} variants={textVariants} initial="enter" animate="center" exit="exit"
                transition={TEXT_SWAP}
                className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-300 tracking-[-0.03em] tabular-nums leading-none"
              >{viewYear}</motion.span>
            </AnimatePresence>
          </div>
          {/* Month section — keyed on the month alone so a year change no longer re-animates it */}
          <div className="flex items-center gap-[5px] px-3 py-[7px] overflow-hidden group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/50 transition-colors duration-150">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.span key={viewMonth} custom={direction} variants={textVariants} initial="enter" animate="center" exit="exit"
                transition={TEXT_SWAP}
                className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100 tracking-[-0.02em] leading-none whitespace-nowrap"
              >{MONTHS[viewMonth]}</motion.span>
            </AnimatePresence>
            <span className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-150 flex items-center">
              <ChevDown open={pickerOpen} />
            </span>
          </div>
        </Surface>
      </button>

      <AnimatePresence initial={false}>
        {!pickerOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15, ease }}
            className="flex items-center gap-1.5"
          >
            <NavBtn delta={-1} onClick={() => onNavigate(-1)} />
            <NavBtn delta={1}  onClick={() => onNavigate(1)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Year scroller ──────────────────────────────────────────────────────────── */
const ALL_YEARS = Array.from({ length: 130 }, (_, i) => 1925 + i)

function YearScroller({ viewYear, onPick }: { viewYear: number; onPick: (y: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const active = el.querySelector('[data-active]') as HTMLElement | null
    if (active) el.scrollTop = active.offsetTop - el.clientHeight / 2 + active.clientHeight / 2
  }, [viewYear])

  return (
    <div ref={ref}
      className="h-[168px] overflow-y-auto overscroll-contain"
      style={{ scrollbarWidth: 'none' }}
    >
      <style>{`div::-webkit-scrollbar{display:none}`}</style>
      {/* spacer so first year can scroll to center */}
      <div className="h-[68px]" />
      {ALL_YEARS.map(y => {
        const active = y === viewYear
        return (
          <div key={y}
            data-active={active ? '' : undefined}
            onClick={() => onPick(y)}
            className={cn(
              'flex items-center justify-center h-8 cursor-pointer select-none',
              'transition-colors duration-[120ms] rounded-[6px]',
              active
                ? 'text-[14px] font-semibold text-zinc-900 dark:text-zinc-100'
                : 'text-[13px] font-medium text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300',
            )}
          >{y}</div>
        )
      })}
      <div className="h-[68px]" />
    </div>
  )
}

/* ── Month/Year picker panel ────────────────────────────────────────────────── */
interface PickerPanelProps {
  viewYear: number; viewMonth: number; direction: number
  onPick: (y: number, m: number) => void
  onYearSet: (y: number) => void
}

function MonthYearPanel({ viewYear, viewMonth, onPick, onYearSet }: PickerPanelProps) {
  return (
    <div className="w-full">
      <Surface radius={18} lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border-subtle)' } }}
        className="w-full bg-zinc-50 dark:bg-zinc-900/80 overflow-hidden"
      >
        <div className="flex">
          {/* Year scroller — left column */}
          <div className="w-[76px] shrink-0 border-r border-zinc-200/80 dark:border-zinc-800/80 px-1 py-1 relative">
            {/* Fade masks top/bottom */}
            <div className="pointer-events-none absolute top-0 inset-x-0 h-12 z-10 bg-gradient-to-b from-zinc-50 dark:from-zinc-900 to-transparent" />
            <div className="pointer-events-none absolute bottom-0 inset-x-0 h-12 z-10 bg-gradient-to-t from-zinc-50 dark:from-zinc-900 to-transparent" />
            <YearScroller viewYear={viewYear} onPick={onYearSet} />
          </div>

          {/* Month grid — right column */}
          <div className="flex-1 p-3">
            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS_SHORT.map((m, i) => {
                const active = i === viewMonth
                return (
                  <motion.button key={m} onClick={() => onPick(viewYear, i)}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 700, damping: 36 }}
                    className="relative cursor-pointer"
                  >
                    {active && (
                      <motion.div layoutId="mypick"
                        className="absolute inset-0 rounded-full bg-zinc-900 dark:bg-zinc-100"
                        transition={{ type: 'spring', stiffness: 440, damping: 44 }}
                      />
                    )}
                    <div className={cn(
                      'relative z-10 flex items-center justify-center h-9 rounded-full text-[13px] font-medium',
                      'transition-colors duration-[120ms]',
                      active
                        ? 'text-white dark:text-zinc-900'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800',
                    )}>{m}</div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </Surface>
    </div>
  )
}

/* ── Day grid ───────────────────────────────────────────────────────────────── */
interface DayGridProps {
  days: CalDay[]; gridKey: string; direction: number
  selected?: Date | null
  rangeFrom?: Date | null; rangeTo?: Date | null; hoverDate?: Date | null
  onSelect: (d: Date) => void
  onHover?: (d: Date | null) => void
}

function DayGrid({ days, gridKey, direction, selected, rangeFrom, rangeTo, hoverDate, onSelect, onHover }: DayGridProps) {
  const isRangeMode = rangeFrom !== undefined
  const effectiveTo = rangeTo ?? (rangeFrom && !rangeTo && hoverDate && hoverDate > rangeFrom ? hoverDate : null)

  return (
    <div className="w-full">
      <Surface radius={20} lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border-subtle)' } }}
        className="w-full px-2 pt-2 pb-3 bg-zinc-50 dark:bg-zinc-900/80"
      >
        {/* Day headers */}
        <div className="grid grid-cols-7">
          {DAYS_SHORT.map(d => (
            <div key={d} className="flex items-center justify-center h-9">
              <span className="text-[12px] font-semibold text-zinc-400 dark:text-zinc-600 tracking-[0.02em] select-none">{d}</span>
            </div>
          ))}
        </div>

        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div key={gridKey} custom={direction} variants={slideVariants}
              initial="enter" animate="center" exit="exit" transition={{ duration: 0.22, ease }}
              className="grid grid-cols-7 gap-y-0.5"
            >
              {days.map((d, i) => {
                const isFrom     = sameDay(rangeFrom ?? null, d.date)
                const isTo       = sameDay(rangeTo ?? null, d.date)
                const isHoverTo  = !rangeTo && sameDay(hoverDate ?? null, d.date)
                const isSel      = sameDay(selected ?? null, d.date) || isFrom || isTo
                const tod        = sameDay(new Date(), d.date)

                // Inclusive band: fills every cell from the start date THROUGH the end
                // date (or the hovered end mid-selection). Only the true outer ends get a
                // rounded cap matching the selection circle; interior cells stay square so
                // they tile seamlessly — including across row wraps.
                const rangeLo     = rangeFrom ?? null
                const rangeHi     = effectiveTo
                const inRange     = isRangeMode && !!rangeLo && !!rangeHi &&
                  d.date.getTime() >= rangeLo.getTime() && d.date.getTime() <= rangeHi.getTime()
                const isBandStart = inRange && sameDay(rangeLo, d.date)
                const isBandEnd   = inRange && sameDay(rangeHi, d.date)
                const showBand    = d.isCurrentMonth && inRange && !sameDay(rangeLo, rangeHi)

                return (
                  <button key={i}
                    onClick={() => d.isCurrentMonth && onSelect(d.date)}
                    onMouseEnter={() => d.isCurrentMonth && onHover?.(d.date)}
                    onMouseLeave={() => onHover?.(null)}
                    disabled={!d.isCurrentMonth}
                    className={cn(
                      'relative flex items-center justify-center aspect-square cursor-pointer select-none',
                      !d.isCurrentMonth && 'pointer-events-none',
                    )}
                  >
                    {/* Range band — sits behind the circle */}
                    {showBand && (
                      <div className={cn(
                        'absolute inset-y-[2px] z-0 bg-zinc-200/70 dark:bg-zinc-700/40',
                        isBandStart && !isBandEnd && 'left-[2px] right-0 rounded-l-full',
                        !isBandStart && isBandEnd && 'left-0 right-[2px] rounded-r-full',
                        !isBandStart && !isBandEnd && 'inset-x-0',
                      )} />
                    )}

                    {/* Selection / range-endpoint circle */}
                    {isSel && (
                      <motion.div
                        layoutId={isFrom ? `rf-${gridKey}` : isTo ? `rt-${gridKey}` : `rs-${gridKey}`}
                        className="absolute inset-[2px] rounded-full bg-zinc-900 dark:bg-zinc-100 z-10"
                        transition={{ type: 'spring', stiffness: 440, damping: 44 }}
                      />
                    )}

                    {/* Hover-to ghost circle (not yet committed) */}
                    {isHoverTo && !isSel && (
                      <div className="absolute inset-[2px] rounded-full bg-zinc-400/50 dark:bg-zinc-500/50 z-10" />
                    )}

                    {/* Today dot */}
                    {tod && !isSel && (
                      <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 size-[3px] rounded-full bg-sky-500 z-20" />
                    )}

                    <span className={cn(
                      'relative z-20 text-[14px] tabular-nums leading-none select-none',
                      isSel       ? 'text-white dark:text-zinc-900 font-semibold'
                      : isHoverTo ? 'text-zinc-800 dark:text-zinc-100 font-semibold'
                      : d.isCurrentMonth ? 'text-zinc-800 dark:text-zinc-100 font-medium'
                      : 'text-zinc-300 dark:text-zinc-700',
                    )}>{d.day}</span>
                  </button>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </Surface>
    </div>
  )
}

/* ── Calendar (single date) ─────────────────────────────────────────────────── */
export interface CalendarProps {
  defaultSelected?: Date
  selected?: Date | null
  onSelect?: (date: Date) => void
  className?: string
}

export function Calendar({ defaultSelected, selected: ctrl, onSelect, className }: CalendarProps) {
  const today = new Date()
  const [internal, setInternal] = useState<Date | null>(defaultSelected ?? null)
  const selected = ctrl !== undefined ? ctrl : internal

  // Open on the selected date's own month, not always today's — otherwise a
  // `defaultSelected` far from the current month renders with nothing
  // visible and no indication the calendar even has a selection.
  const [viewYear,  setViewYear]  = useState((defaultSelected ?? today).getFullYear())
  const [viewMonth, setViewMonth] = useState((defaultSelected ?? today).getMonth())
  const [direction, setDirection] = useState(0)
  const [pickerOpen, setPickerOpen] = useState(false)

  const gridKey = `${viewYear}-${viewMonth}`
  const days = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth])

  function navigate(delta: number) {
    setDirection(delta)
    const n = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(n.getFullYear()); setViewMonth(n.getMonth())
  }

  function handleSelect(date: Date) {
    if (ctrl === undefined) setInternal(date)
    onSelect?.(date)
  }

  function handlePick(y: number, m: number) {
    const delta = (y * 12 + m) - (viewYear * 12 + viewMonth)
    setDirection(Math.sign(delta) || 1)
    setViewYear(y); setViewMonth(m); setPickerOpen(false)
  }

  return (
    <div className={cn(
      '[filter:drop-shadow(0_2px_50px_rgba(0,0,0,0.02))_drop-shadow(0_1px_4px_rgba(0,0,0,0.06))]',
      'dark:[filter:drop-shadow(0_2px_50px_rgba(0,0,0,0.28))_drop-shadow(0_1px_4px_rgba(0,0,0,0.18))]',
      'w-[350px] max-w-full',
    )}>
      <Surface radius={24} lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
        className={cn('flex flex-col gap-3 px-3 pt-4 pb-3.5 bg-zinc-100 dark:bg-zinc-950', className)}
      >
        <CalHeader viewYear={viewYear} viewMonth={viewMonth} direction={direction}
          pickerOpen={pickerOpen} onToggle={() => setPickerOpen(o => !o)} onNavigate={navigate}
        />

        <AnimatePresence mode="wait" initial={false}>
          {pickerOpen ? (
            <motion.div key="picker" variants={panelVariants} initial="hidden" animate="visible" exit="hidden"
              transition={{ duration: 0.18, ease }} className="w-full"
            >
              <MonthYearPanel viewYear={viewYear} viewMonth={viewMonth} direction={direction}
                onPick={handlePick}
                onYearSet={(y) => { setDirection(y > viewYear ? 1 : -1); setViewYear(y) }}
              />
            </motion.div>
          ) : (
            <motion.div key="grid" variants={panelVariants} initial="hidden" animate="visible" exit="hidden"
              transition={{ duration: 0.18, ease }} className="w-full"
            >
              <DayGrid days={days} gridKey={gridKey} direction={direction} selected={selected} onSelect={handleSelect} />
            </motion.div>
          )}
        </AnimatePresence>
      </Surface>
    </div>
  )
}

/* ── CalendarRange ──────────────────────────────────────────────────────────── */
export interface CalendarRangeProps {
  from?: Date | null
  to?: Date | null
  onRangeChange?: (from: Date | null, to: Date | null) => void
  className?: string
}

export function CalendarRange({ from: ctrlFrom, to: ctrlTo, onRangeChange, className }: CalendarRangeProps) {
  const today = new Date()
  const [intFrom, setIntFrom] = useState<Date | null>(null)
  const [intTo,   setIntTo]   = useState<Date | null>(null)
  const from = ctrlFrom !== undefined ? ctrlFrom : intFrom
  const to   = ctrlTo   !== undefined ? ctrlTo   : intTo

  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [direction, setDirection] = useState(0)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  const gridKey = `${viewYear}-${viewMonth}`
  const days = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth])

  function navigate(delta: number) {
    setDirection(delta)
    const n = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(n.getFullYear()); setViewMonth(n.getMonth())
  }

  function handleSelect(date: Date) {
    let newFrom = from, newTo = to
    if (!from || (from && to)) {
      newFrom = date; newTo = null
    } else if (sameDay(date, from)) {
      newFrom = null; newTo = null
    } else if (date < from) {
      newTo = from; newFrom = date
    } else {
      newTo = date
    }
    if (ctrlFrom === undefined) setIntFrom(newFrom ?? null)
    if (ctrlTo   === undefined) setIntTo(newTo ?? null)
    onRangeChange?.(newFrom ?? null, newTo ?? null)
  }

  function handlePick(y: number, m: number) {
    const delta = (y * 12 + m) - (viewYear * 12 + viewMonth)
    setDirection(Math.sign(delta) || 1)
    setViewYear(y); setViewMonth(m); setPickerOpen(false)
  }

  return (
    <div className={cn(
      '[filter:drop-shadow(0_2px_50px_rgba(0,0,0,0.02))_drop-shadow(0_1px_4px_rgba(0,0,0,0.06))]',
      'dark:[filter:drop-shadow(0_2px_50px_rgba(0,0,0,0.28))_drop-shadow(0_1px_4px_rgba(0,0,0,0.18))]',
      'w-[350px] max-w-full',
    )}>
      <Surface radius={24} lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
        className={cn('flex flex-col gap-3 px-3 pt-4 pb-3.5 bg-zinc-100 dark:bg-zinc-950', className)}
      >
        <CalHeader viewYear={viewYear} viewMonth={viewMonth} direction={direction}
          pickerOpen={pickerOpen} onToggle={() => setPickerOpen(o => !o)} onNavigate={navigate}
        />

        <AnimatePresence mode="wait" initial={false}>
          {pickerOpen ? (
            <motion.div key="picker" variants={panelVariants} initial="hidden" animate="visible" exit="hidden"
              transition={{ duration: 0.18, ease }} className="w-full"
            >
              <MonthYearPanel viewYear={viewYear} viewMonth={viewMonth} direction={direction}
                onPick={handlePick}
                onYearSet={(y) => { setDirection(y > viewYear ? 1 : -1); setViewYear(y) }}
              />
            </motion.div>
          ) : (
            <motion.div key="grid" variants={panelVariants} initial="hidden" animate="visible" exit="hidden"
              transition={{ duration: 0.18, ease }} className="w-full"
            >
              <DayGrid
                days={days} gridKey={gridKey} direction={direction}
                rangeFrom={from} rangeTo={to}
                hoverDate={from && !to ? hoverDate : null}
                onSelect={handleSelect}
                onHover={setHoverDate}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Range summary footer */}
        <AnimatePresence>
          {(from || to) && (
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15, ease }}
              className="flex items-center gap-2 px-1"
            >
              <div className="flex-1 flex flex-col items-center gap-0.5">
                <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 tracking-[0.02em]">From</span>
                <span className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100 tabular-nums">
                  {from ? from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                </span>
              </div>
              <span className="text-zinc-300 dark:text-zinc-700 text-[13px]">→</span>
              <div className="flex-1 flex flex-col items-center gap-0.5">
                <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 tracking-[0.02em]">To</span>
                <span className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100 tabular-nums">
                  {to ? to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Surface>
    </div>
  )
}
