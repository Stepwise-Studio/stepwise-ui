'use client'

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import { useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/cn'

const SOFT = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const SYMBOLS = '!<>-_\\/[]{}=+*^?#@$%&'
const DEFAULT_CHARSET = SOFT + SYMBOLS

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/** Measure each character's rendered width in context (kerning included). */
function measureCharWidths(el: HTMLElement): number[] {
  const textNode = el.firstChild
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return []
  const text = textNode.textContent ?? ''
  const widths: number[] = []
  for (let i = 0; i < text.length; i++) {
    const range = document.createRange()
    range.setStart(textNode, i)
    range.setEnd(textNode, i + 1)
    widths.push(range.getBoundingClientRect().width)
  }
  return widths
}

export interface ScrambleTextProps {
  /** Final resolved text. */
  children   : string
  /** Glyph pool the scramble cycles through before locking each character. */
  charset?   : string
  /** Baseline frame budget per character. Default 72. Higher = longer resolve. */
  speed?     : number
  /**
   * How chaotic the scramble feels — 0 is a subtle letter decode, 1 is a full
   * symbol storm. Default 0.45.
   */
  intensity? : number
  /** Replay whenever the element scrolls back into view. Default false (once). */
  replayInView?: boolean
  className? : string
}

/**
 * Text scramble reveal — every character scrambles together, then letters lock
 * left-to-right one at a time while the rest keep churning until the last one
 * settles. Each character is painted into a pre-measured slot so glyph width
 * changes never shove their neighbours. Reduced motion renders immediately.
 */
export function ScrambleText({
  children,
  charset,
  speed = 72,
  intensity: intensityProp,
  replayInView = false,
  className,
}: ScrambleTextProps) {
  const intensity = clamp01(intensityProp ?? 0.45)
  const pool = charset ?? DEFAULT_CHARSET
  const reduce = useReducedMotion()

  const [display, setDisplay] = useState(reduce ? children : '')
  const [liveText, setLiveText] = useState(reduce ? children : '')
  const [slotWidths, setSlotWidths] = useState<number[]>([])
  const rootRef = useRef<HTMLSpanElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number | null>(null)
  const lastGlyphs = useRef<string[]>([])
  const slotsRef = useRef<number[]>([])

  const refreshSlots = useCallback(() => {
    const el = measureRef.current
    if (!el) return slotsRef.current
    const widths = measureCharWidths(el)
    if (widths.length) {
      slotsRef.current = widths
      setSlotWidths(widths)
    }
    return widths
  }, [])

  useLayoutEffect(() => {
    refreshSlots()
  }, [children, className, refreshSlots])

  const run = useCallback(() => {
    if (reduce) {
      setDisplay(children)
      setLiveText(children)
      return
    }

    refreshSlots()
    setLiveText('')
    const chars = children.split('')
    lastGlyphs.current = chars.map(() => '')

    // Phase 1 — everyone scrambles together. Phase 2 — letters lock one-by-one
    // left-to-right; unlocked characters keep churning until their turn.
    const leadFrames = Math.round(speed * lerp(0.42, 0.28, intensity))
    const gapFrames = speed * lerp(0.3, 0.17, intensity)
    let letterIndex = 0
    const lockAt = chars.map(ch => {
      if (ch === ' ') return 0
      const lock = Math.round(leadFrames + letterIndex * gapFrames + Math.random() * gapFrames * 0.1)
      letterIndex++
      return lock
    })

    const changeEvery = Math.max(1, Math.round(lerp(5, 1, intensity)))
    const totalFrames = Math.max(...lockAt, 0)
    let frame = 0

    const tick = () => {
      let done = 0
      const out = chars.map((ch, i) => {
        if (ch === ' ') { done++; return ' ' }

        if (frame >= lockAt[i]) {
          done++
          lastGlyphs.current[i] = ch
          return ch
        }

        const shouldReroll = frame % changeEvery === 0
        if (!shouldReroll && lastGlyphs.current[i]) {
          return lastGlyphs.current[i]
        }

        const glyph = Math.random() > intensity
          ? SOFT[Math.floor(Math.random() * SOFT.length)]
          : pool[Math.floor(Math.random() * pool.length)]

        lastGlyphs.current[i] = glyph
        return glyph
      })

      setDisplay(out.join(''))
      frame++

      if (frame > totalFrames) {
        setDisplay(children)
        setLiveText(children)
      } else if (done < chars.length) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setLiveText(children)
      }
    }

    cancelAnimationFrame(rafRef.current ?? 0)
    tick()
  }, [children, pool, speed, intensity, reduce, refreshSlots])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            run()
            if (!replayInView) io.disconnect()
          }
        })
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(rafRef.current ?? 0) }
  }, [run, replayInView])

  const chars = children.split('')
  const glyphs = display.length > 0
    ? display.split('')
    : chars.map(() => '\u00a0')

  return (
    <span ref={rootRef} className={cn('relative inline-block align-baseline', className)}>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{liveText}</span>

      {/* Inherits font metrics from the root (user className) — only structural
          classes here so measurement matches what the user actually styled. */}
      <span
        ref={measureRef}
        className="pointer-events-none invisible absolute whitespace-pre"
        aria-hidden
      >
        {children}
      </span>

      <span className="inline-flex whitespace-pre" aria-hidden>
        {glyphs.map((glyph, i) => (
          <span
            key={i}
            className="inline-block text-center"
            style={slotWidths[i] != null ? { width: slotWidths[i] } : undefined}
          >
            {glyph || '\u00a0'}
          </span>
        ))}
      </span>
    </span>
  )
}
