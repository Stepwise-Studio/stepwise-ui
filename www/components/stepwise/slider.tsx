'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useReducedMotion } from 'motion/react'
import { Surface } from '@/components/stepwise/primitives/surface'
import { cn } from '@/lib/utils/cn'

export type SliderVariant = 'plain' | 'dots' | 'range'

export interface SliderProps {
  /** "plain" (fill + handle), "dots" (adds tick marks), "range" (two handles). */
  variant?     : SliderVariant
  /** Capsule track with a nested round knob, orthogonal to `variant`.
   *  Label and value sit above the track. */
  classical?   : boolean
  min?         : number
  max?         : number
  step?        : number
  /** Single number, or a [start, end] tuple for the range variant. */
  value?       : number | [number, number]
  defaultValue?: number | [number, number]
  /** Fires with a number (plain/dots) or a [start, end] tuple (range). */
  onChange?    : (value: number | [number, number]) => void
  /** Label shown inside, on the left. */
  label?       : string
  /** Show the current value on the right. Default true. */
  showValue?   : boolean
  /** Format the displayed value. */
  formatValue? : (value: number) => string
  /** Number of tick marks for the "dots" variant. Default 5. */
  dotCount?    : number
  disabled?    : boolean
  className?   : string
  /** Classical track only. Default horizontal. */
  orientation?: 'horizontal' | 'vertical'
}

const clampToStep = (v: number, min: number, max: number, step: number) => {
  const snapped = Math.round((v - min) / step) * step + min
  return Math.min(max, Math.max(min, Number(snapped.toFixed(6))))
}

// Row = 44px tall, radius 18 (matches Input). CAP is how far the fill's rounded
// cap extends past the handle so the line sits inside the fill when shown.
const ROW_H  = 44
const INSET  = 0
const FILL_R = 14
const CAP    = 9

// Classical layout - one geometry, used everywhere:
//   track 24px pill, knob 16px, 4px gap on every side (top/bottom/left/right).
//   Fill is also a pill so it wraps the knob; a rectangular fill looks like a
//   square box and a dark ring. Do not use Surface here.
const CLASSICAL_TRACK_H = 24
const CLASSICAL_GAP = 4
const CLASSICAL_KNOB = CLASSICAL_TRACK_H - CLASSICAL_GAP * 2
const CLASSICAL_TRAVEL = `100% - ${CLASSICAL_TRACK_H}px`
const CLASSICAL_PAD = CLASSICAL_TRACK_H / 2

export function Slider({
  variant = 'plain',
  classical = false,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  label,
  showValue = true,
  formatValue,
  dotCount = 5,
  disabled,
  className,
  orientation = 'horizontal',
}: SliderProps) {
  const reduceMotion = useReducedMotion()
  const isRange = variant === 'range'

  const toThumbs = useCallback((v: number | [number, number] | undefined): number[] => {
    if (v === undefined) return isRange ? [min, max] : [min]
    return Array.isArray(v) ? [v[0], v[1]] : [v]
  }, [isRange, min, max])

  const controlled = value !== undefined
  const [internal, setInternal] = useState<number[]>(() => toThumbs(controlled ? value : defaultValue))
  const thumbs = controlled ? toThumbs(value) : internal
  useEffect(() => { if (controlled) setInternal(toThumbs(value)) }, [controlled, value, toThumbs])

  const trackRef = useRef<HTMLDivElement>(null)
  const activeIdx = useRef(0)
  const [dragging, setDragging] = useState(false)

  const pct = (v: number) => ((v - min) / (max - min)) * 100

  const commit = useCallback((next: number[]) => {
    if (!controlled) setInternal(next)
    onChange?.(isRange ? [next[0], next[1]] : next[0])
  }, [controlled, onChange, isRange])

  const vertical = classical && orientation === 'vertical'

  const valueFromPointer = useCallback((clientX: number, clientY: number, trackPad = 0) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return min
    const pad = trackPad > 0 ? trackPad : 0
    if (vertical) {
      const usable = rect.height - 2 * pad
      const ratio = usable <= 0
        ? 0
        : Math.min(1, Math.max(0, 1 - (clientY - rect.top - pad) / usable))
      return clampToStep(min + ratio * (max - min), min, max, step)
    }
    const usable = rect.width - 2 * pad
    const ratio = usable <= 0
      ? 0
      : Math.min(1, Math.max(0, (clientX - rect.left - pad) / usable))
    return clampToStep(min + ratio * (max - min), min, max, step)
  }, [min, max, step, vertical])

  const moveThumb = useCallback((idx: number, v: number, base: number[]) => {
    const next = [...base]
    next[idx] = v
    if (isRange) {
      if (idx === 0) next[0] = Math.min(next[0], next[1])
      else           next[1] = Math.max(next[1], next[0])
    }
    return next
  }, [isRange])

  const classicalTrackPad = classical ? CLASSICAL_PAD : 0

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return
    const v = valueFromPointer(e.clientX, e.clientY, classicalTrackPad)
    const idx = isRange ? (Math.abs(thumbs[0] - v) <= Math.abs(thumbs[1] - v) ? 0 : 1) : 0
    activeIdx.current = idx
    setDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    commit(moveThumb(idx, v, thumbs))
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || disabled) return
    commit(moveThumb(activeIdx.current, valueFromPointer(e.clientX, e.clientY, classicalTrackPad), thumbs))
  }
  const endDrag = () => setDragging(false)

  const onThumbKey = (idx: number) => (e: React.KeyboardEvent) => {
    if (disabled) return
    let v = thumbs[idx]
    switch (e.key) {
      case 'ArrowLeft': case 'ArrowDown':  v -= step; break
      case 'ArrowRight': case 'ArrowUp':   v += step; break
      case 'Home':      v = min; break
      case 'End':       v = max; break
      case 'PageDown':  v -= step * 10; break
      case 'PageUp':    v += step * 10; break
      default: return
    }
    e.preventDefault()
    commit(moveThumb(idx, clampToStep(v, min, max, step), thumbs))
  }

  const fmt = (v: number) => (formatValue ? formatValue(v) : String(v))
  const valueText = isRange ? `${fmt(thumbs[0])} – ${fmt(thumbs[1])}` : fmt(thumbs[0])

  const fillLeft  = isRange ? pct(thumbs[0]) : 0
  const fillRight = isRange ? pct(thumbs[1]) : pct(thumbs[0])
  /** At min (plain/dots) or when handles coincide (range), show only the handle - no fill cap. */
  const showFill  = isRange ? thumbs[1] > thumbs[0] : thumbs[0] > min

  const n = Math.max(2, dotCount)
  const dots = variant === 'dots' ? Array.from({ length: n }, (_, i) => (i / (n - 1)) * 100) : []

  const hExpr = (v: number) => `clamp(${INSET + CAP}px, ${pct(v)}%, calc(100% - ${INSET + CAP}px))`

  const motionTransition = dragging || reduceMotion
    ? 'none'
    : 'left 260ms cubic-bezier(0.22,1,0.36,1), width 260ms cubic-bezier(0.22,1,0.36,1)'
  const thumbTransition = dragging || reduceMotion
    ? 'width 120ms ease, height 120ms ease, background-color 120ms ease'
    : 'left 260ms cubic-bezier(0.22,1,0.36,1), width 160ms ease, height 160ms ease, background-color 160ms ease'

  const thumbName = (idx: number) => {
    if (label) return `${label}${isRange ? ` ${idx === 0 ? 'start' : 'end'}` : ''}`
    return isRange ? `Range ${idx === 0 ? 'start' : 'end'}` : 'Slider'
  }

  if (classical) {
    const knobLeft = (v: number) =>
      `calc(${CLASSICAL_GAP}px + (${CLASSICAL_TRAVEL}) * ${pct(v) / 100})`
    const fillEnd = (v: number) =>
      `calc(${knobLeft(v)} + ${CLASSICAL_KNOB + CLASSICAL_GAP}px)`
    const fillStart = (v: number) =>
      `calc(${knobLeft(v)} - ${CLASSICAL_GAP}px)`
    const knobTop = (v: number) =>
      `calc(${CLASSICAL_GAP}px + (${CLASSICAL_TRAVEL}) * ${1 - pct(v) / 100})`
    const fillBottomH = (v: number) =>
      `calc(${CLASSICAL_GAP + CLASSICAL_KNOB}px + (${CLASSICAL_TRAVEL}) * ${pct(v) / 100})`
    const dotLeft = (d: number) =>
      `calc(${CLASSICAL_PAD}px + (${CLASSICAL_TRAVEL}) * ${d / 100})`
    const axisTransition = dragging || reduceMotion
      ? 'none'
      : vertical
        ? 'top 260ms cubic-bezier(0.22,1,0.36,1)'
        : 'left 260ms cubic-bezier(0.22,1,0.36,1)'

    return (
      <div className={cn(vertical ? '' : 'w-full', disabled && 'opacity-50', className)}>
        {!vertical && (label || showValue) && (
          <div className="mb-1.5 flex items-center justify-between gap-2">
            {label && (
              <span className="min-w-0 truncate text-[13px]/[1.2] font-medium tracking-[-0.01em] text-zinc-500 dark:text-zinc-400">
                {label}
              </span>
            )}
            {showValue && (
              <span className="shrink-0 whitespace-nowrap text-[13px]/[1.2] font-semibold tabular-nums tracking-[-0.02em] text-zinc-700 dark:text-zinc-200">
                {valueText}
              </span>
            )}
          </div>
        )}

        <div
          ref={trackRef}
          className={cn(
            'relative',
            vertical ? 'h-full' : 'w-full',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
          style={vertical ? { width: CLASSICAL_TRACK_H } : { height: CLASSICAL_TRACK_H }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full bg-[#f4f4f5] dark:bg-[#27272a]"
            aria-hidden
          >
            {showFill && (
              <div
                className="absolute rounded-full bg-zinc-800 dark:bg-zinc-200 motion-reduce:transition-none"
                style={vertical
                  ? {
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: isRange
                        ? `calc(${fillEnd(thumbs[1])} - ${fillStart(thumbs[0])})`
                        : fillBottomH(thumbs[0]),
                      transition: motionTransition,
                    }
                  : {
                      top: 0,
                      height: '100%',
                      left: isRange ? fillStart(thumbs[0]) : 0,
                      width: isRange
                        ? `calc(${fillEnd(thumbs[1])} - ${fillStart(thumbs[0])})`
                        : fillEnd(thumbs[0]),
                      transition: motionTransition,
                    }}
              />
            )}

            {variant === 'dots' && !vertical && dots.map((d, i) => {
              const onFill = isRange
                ? d >= pct(thumbs[0]) && d <= pct(thumbs[1])
                : d <= pct(thumbs[0])
              return (
                <span
                  key={i}
                  className={cn(
                    'absolute top-1/2 rounded-full',
                    onFill ? 'bg-white/55 dark:bg-zinc-400' : 'bg-zinc-400/80 dark:bg-zinc-600',
                  )}
                  style={{
                    left: dotLeft(d),
                    width: 3,
                    height: 3,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )
            })}
          </div>

          {thumbs.map((t, idx) => {
            const active = dragging && activeIdx.current === idx
            const atMin = t === min
            return (
              <div
                key={idx}
                role="slider"
                tabIndex={disabled ? -1 : 0}
                aria-orientation={vertical ? 'vertical' : 'horizontal'}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={t}
                aria-valuetext={fmt(t)}
                aria-label={thumbName(idx)}
                aria-disabled={disabled}
                onKeyDown={onThumbKey(idx)}
                className={cn(
                  'absolute z-10 rounded-full outline-none shadow-[0_1px_2px_rgba(0,0,0,0.12)]',
                  atMin ? 'bg-zinc-400/50 dark:bg-zinc-600' : 'bg-zinc-50 dark:bg-zinc-700',
                  'focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 dark:focus-visible:ring-sky-400',
                  disabled ? 'cursor-not-allowed' : active ? 'cursor-grabbing' : 'cursor-grab',
                )}
                style={vertical
                  ? {
                      left: CLASSICAL_GAP,
                      top: knobTop(t),
                      width: CLASSICAL_KNOB,
                      height: CLASSICAL_KNOB,
                      transition: axisTransition,
                    }
                  : {
                      top: CLASSICAL_GAP,
                      left: knobLeft(t),
                      width: CLASSICAL_KNOB,
                      height: CLASSICAL_KNOB,
                      transition: axisTransition,
                    }}
              />
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative w-full', disabled && 'opacity-50', className)} style={{ height: ROW_H }}>
      <Surface
        radius={18}
        className={cn('relative w-full bg-zinc-100 dark:bg-zinc-900', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}
        style={{ height: ROW_H }}
      >
        <div
          ref={trackRef}
          className="absolute inset-0"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {showFill && (
            <div
              className="absolute bg-white dark:bg-zinc-700/80 pointer-events-none motion-reduce:transition-none"
              style={{
                top: INSET, bottom: INSET,
                left: isRange ? `calc(${hExpr(thumbs[0])} - ${CAP}px)` : `${INSET}px`,
                width: isRange
                  ? `calc(${hExpr(thumbs[1])} - ${hExpr(thumbs[0])} + ${2 * CAP}px)`
                  : `calc(${hExpr(thumbs[0])} + ${CAP - INSET}px)`,
                borderRadius: FILL_R,
                boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.04), 0 1px 1.5px rgba(0,0,0,0.05)',
                transition: motionTransition,
              }}
            />
          )}

          {dots.map((d, i) => {
            const filled = isRange ? (d >= fillLeft && d <= fillRight) : d <= fillRight
            return (
              <span
                key={i}
                className="absolute top-1/2 rounded-full bg-zinc-300 dark:bg-zinc-600 pointer-events-none motion-reduce:transition-none"
                style={{
                  left: `${d}%`, width: 3, height: 3,
                  transform: 'translate(-50%, -50%)',
                  opacity: filled ? 0 : 1,
                  transition: reduceMotion ? 'none' : 'opacity 200ms ease',
                }}
              />
            )
          })}

          {thumbs.map((t, idx) => {
            const active = dragging && activeIdx.current === idx
            return (
              <div
                key={idx}
                role="slider"
                tabIndex={disabled ? -1 : 0}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={t}
                aria-valuetext={fmt(t)}
                aria-label={thumbName(idx)}
                aria-disabled={disabled}
                onKeyDown={onThumbKey(idx)}
                className={cn(
                  'after:content-[""] after:absolute after:left-1/2 after:top-1/2 after:[translate:-50%_-50%] after:w-6 after:h-11 absolute top-1/2 outline-none rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.18)]',
                  'focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 dark:focus-visible:ring-sky-400',
                  active
                    ? 'w-1 h-6 bg-zinc-700 dark:bg-zinc-100'
                    : 'w-[3px] h-5 bg-zinc-400 dark:bg-zinc-400',
                  disabled ? 'cursor-not-allowed' : active ? 'cursor-grabbing' : 'cursor-grab',
                )}
                style={{
                  left: hExpr(t),
                  transform: 'translate(-50%, -50%)',
                  transition: thumbTransition,
                }}
              />
            )
          })}
        </div>

        <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-between gap-2 px-3.5">
          {label ? (
            <span className="min-w-0 truncate text-[13px]/[1.2] font-medium tracking-[-0.01em] text-zinc-500 dark:text-zinc-400">
              {label}
            </span>
          ) : <span />}
          {showValue && (
            <span className="shrink-0 whitespace-nowrap text-[13px]/[1.2] font-semibold tabular-nums tracking-[-0.02em] text-zinc-700 dark:text-zinc-200">
              {valueText}
            </span>
          )}
        </div>
      </Surface>

      <div
        aria-hidden
        className={cn(
          'absolute inset-0 pointer-events-none rounded-[18px] border border-solid',
          'transition-[border-color] duration-250 motion-reduce:transition-none',
          disabled || !dragging
            ? 'border-[var(--ui-border,rgb(138_138_141_/_0.23))]'
            : 'border-zinc-300 dark:border-zinc-600',
        )}
      />
    </div>
  )
}
