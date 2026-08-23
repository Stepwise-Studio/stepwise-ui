'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/cn'

export type LogoRevealPreset = 'white' | 'black' | 'blueprint'

export interface LogoRevealProps {
  /** Your logo's SVG path `d` (or several, for multi-part marks). */
  path         : string | string[]
  /** The source SVG's viewBox. Default "0 0 512 512". */
  viewBox?     : string
  /** Logo size in px. Default 180. */
  size?        : number
  /** Visual style. Default "white" — paper with grain. */
  preset?      : LogoRevealPreset
  /** Override the preset's background. */
  bgColor?     : string
  /** Override the preset's stroke (trace) colour. */
  strokeColor? : string
  /** Override the final fill colour. Defaults to strokeColor. */
  fillColor?   : string
  /** Trace stroke width, in viewBox units. Default 3. */
  strokeWidth? : number
  /** Draw the construction guides. Default true — they are the whole point. */
  showGuides?  : boolean
  /** Grain / noise texture over the ground. Default true. */
  texture?     : boolean
  /** How long the finished logo holds before the overlay fades, in ms. Default 700. */
  hold?        : number
  /** Timing multiplier — higher is faster. Default 1. */
  speed?       : number
  /** Play only once per session, keyed by this string. */
  once?        : boolean
  onceKey?     : string
  /** Fires after the overlay has fully faded away. */
  onFinish?    : () => void
  className?   : string
}

// ── presets ──────────────────────────────────────────────────────────────────

const PRESETS: Record<LogoRevealPreset, {
  bg: string; ink: string; guide: string; grid: boolean
}> = {
  white:     { bg: '#f7f6f3', ink: '#18181b', guide: 'rgba(24,24,27,0.38)',      grid: false },
  black:     { bg: '#0a0a0c', ink: '#fafafa', guide: 'rgba(250,250,250,0.32)',   grid: false },
  blueprint: { bg: '#0d2b6b', ink: '#eef4ff', guide: 'rgba(238,244,255,0.42)',   grid: true  },
}

// grain: tiny SVG turbulence tile, inlined — no asset, no dependency
const NOISE =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`

// ── timings (seconds, scaled by speed) ───────────────────────────────────────

const GUIDES = 0.9   // hairlines draw
const TRACE  = 1.5   // logo outline draws (starts while guides finish)
const TRACE_AT = 0.45
const FILL   = 0.45  // bold fill lands
const FADE   = 600   // overlay fade-out ms

const EASE = [0.22, 1, 0.36, 1] as const

type Box = { x: number; y: number; w: number; h: number }

/**
 * A full-screen opening sequence in the spirit of a drafting table: hairline
 * construction guides — anchored to the logo's real geometry and overshooting
 * its edges — draw themselves first, the mark is traced over them, then the
 * bold fill lands as the scaffolding fades away. Grain on the ground, and an
 * engineering-blueprint preset with a fine grid.
 */
export function LogoReveal({
  path,
  viewBox     = '0 0 512 512',
  size        = 180,
  preset      = 'white',
  bgColor,
  strokeColor,
  fillColor,
  strokeWidth = 3,
  showGuides  = true,
  texture     = true,
  hold        = 700,
  speed       = 1,
  once        = false,
  onceKey     = 'stepwise-logo-reveal',
  onFinish,
  className,
}: LogoRevealProps) {
  const reduce = useReducedMotion()
  const paths  = useMemo(() => (Array.isArray(path) ? path : [path]), [path])
  const p      = PRESETS[preset]
  const bg     = bgColor ?? p.bg
  const ink    = strokeColor ?? p.ink
  const fill   = fillColor ?? ink
  const guide  = p.guide
  const s      = (t: number) => t / speed

  const [minX, minY, vbW, vbH] = viewBox.split(/\s+/).map(Number)

  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)
  const [box, setBox] = useState<Box | null>(null)
  const measureRefs = useRef<(SVGPathElement | null)[]>([])

  // SSR guard + once-per-session flag
  useEffect(() => {
    if (once && typeof sessionStorage !== 'undefined' && sessionStorage.getItem(onceKey)) {
      setVisible(false)
      onFinish?.()
      return
    }
    setMounted(true)
  }, [once, onceKey, onFinish])

  // Measure the union bbox of the actual paths — the guides hang off the
  // logo's real geometry, not the viewBox, which is what sells the effect.
  useLayoutEffect(() => {
    if (!mounted) return
    const boxes = measureRefs.current.filter(Boolean).map(el => el!.getBBox())
    if (!boxes.length) return
    const x1 = Math.min(...boxes.map(b => b.x))
    const y1 = Math.min(...boxes.map(b => b.y))
    const x2 = Math.max(...boxes.map(b => b.x + b.width))
    const y2 = Math.max(...boxes.map(b => b.y + b.height))
    setBox({ x: x1, y: y1, w: x2 - x1, h: y2 - y1 })
  }, [mounted, paths])

  // Timer-guaranteed dismissal — a site loader must never get stuck.
  useLayoutEffect(() => {
    if (!mounted || !visible) return
    const lead   = showGuides && !reduce ? TRACE_AT : 0
    const drawMs = reduce ? 0 : (s(lead) + s(TRACE) + s(FILL)) * 1000
    const outAt  = drawMs + hold
    const t1 = setTimeout(() => setExiting(true), outAt)
    const t2 = setTimeout(() => {
      if (once && typeof sessionStorage !== 'undefined') sessionStorage.setItem(onceKey, '1')
      setVisible(false)
      onFinish?.()
    }, outAt + FADE)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [mounted, visible, reduce, hold, speed, showGuides]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted || !visible) return null

  const lead = showGuides && !reduce ? TRACE_AT : 0

  // ── construction guides derived from the measured box ──
  // Horizontals at cap + base, verticals at left + right stems, one diagonal,
  // an inscribed circle on the right, registration ticks at the corners —
  // every line overshoots the logo so it reads as a drafting sheet.
  const over = box ? Math.max(box.w, box.h) * 0.55 : 0
  const guides = box ? {
    lines: [
      { x1: box.x - over, y1: box.y,          x2: box.x + box.w + over, y2: box.y },
      { x1: box.x - over, y1: box.y + box.h,  x2: box.x + box.w + over, y2: box.y + box.h },
      { x1: box.x,          y1: box.y - over, x2: box.x,          y2: box.y + box.h + over },
      { x1: box.x + box.w,  y1: box.y - over, x2: box.x + box.w,  y2: box.y + box.h + over },
      // diagonal through the top-left — the drafting-table flourish
      { x1: box.x - over * 0.5, y1: box.y + box.h * 0.55 + over * 0.5, x2: box.x + box.w * 0.55 + over * 0.5, y2: box.y - over * 0.5 },
    ],
    circle: { cx: box.x + box.w * 0.72, cy: box.y + box.h / 2, r: box.h * 0.62 },
    ticks: [
      [box.x, box.y], [box.x + box.w, box.y],
      [box.x, box.y + box.h], [box.x + box.w, box.y + box.h],
    ] as [number, number][],
  } : null

  const guideLine = (g: { x1: number; y1: number; x2: number; y2: number }, i: number) => (
    <motion.line
      key={i}
      {...g}
      stroke={guide}
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: exiting ? 0 : [0, 1, 1, 0.9] }}
      transition={{
        pathLength: { duration: s(GUIDES), delay: s(i * 0.09), ease: EASE },
        opacity: exiting
          ? { duration: 0.3 }
          : { duration: s(lead + TRACE + FILL), delay: s(i * 0.09), times: [0, 0.1, 0.62, 1], ease: 'easeInOut' },
      }}
    />
  )

  return createPortal(
    <motion.div
      className={cn('fixed inset-0 z-[9999] grid place-items-center', className)}
      style={{ background: bg }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: FADE / 1000, ease: EASE }}
    >
      {/* blueprint grid — fine lines with a heavier major line */}
      {p.grid && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(238,244,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(238,244,255,0.05) 1px, transparent 1px),
              linear-gradient(rgba(238,244,255,0.09) 1px, transparent 1px),
              linear-gradient(90deg, rgba(238,244,255,0.09) 1px, transparent 1px)`,
            backgroundSize: '24px 24px, 24px 24px, 120px 120px, 120px 120px',
          }}
        />
      )}

      {/* grain */}
      {texture && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundImage: NOISE, opacity: preset === 'black' ? 0.09 : 0.14, mixBlendMode: preset === 'white' ? 'multiply' : 'overlay' }}
        />
      )}

      <motion.svg
        viewBox={viewBox}
        width={size}
        height={size}
        aria-label="Logo"
        className="relative overflow-visible"
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {/* invisible copies, measured for the guide geometry */}
        <g style={{ visibility: 'hidden' }} aria-hidden>
          {paths.map((d, i) => (
            <path key={i} d={d} ref={el => { measureRefs.current[i] = el }} />
          ))}
        </g>

        {/* ── construction sheet ── */}
        {showGuides && !reduce && guides && (
          <g>
            {guides.lines.map(guideLine)}
            {/* inscribed circle */}
            <motion.circle
              cx={guides.circle.cx} cy={guides.circle.cy} r={guides.circle.r}
              fill="none" stroke={guide} strokeWidth={1} vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: exiting ? 0 : [0, 1, 1, 0.9] }}
              transition={{
                pathLength: { duration: s(GUIDES * 1.1), delay: s(0.2), ease: EASE },
                opacity: exiting ? { duration: 0.3 } : { duration: s(lead + TRACE + FILL), delay: s(0.2), times: [0, 0.12, 0.62, 1], ease: 'easeInOut' },
              }}
            />
            {/* registration ticks at the corners */}
            {guides.ticks.map(([cx, cy], i) => (
              <motion.g
                key={`t${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: exiting ? 0 : [0, 1, 1, 0.9] }}
                transition={exiting ? { duration: 0.3 } : { duration: s(lead + TRACE + FILL), delay: s(0.5 + i * 0.07), times: [0, 0.2, 0.62, 1] }}
              >
                <line x1={cx - vbW * 0.02} y1={cy} x2={cx + vbW * 0.02} y2={cy} stroke={guide} strokeWidth={1} vectorEffect="non-scaling-stroke" />
                <line x1={cx} y1={cy - vbW * 0.02} x2={cx} y2={cy + vbW * 0.02} stroke={guide} strokeWidth={1} vectorEffect="non-scaling-stroke" />
              </motion.g>
            ))}
          </g>
        )}

        {/* ── the mark: hairline trace, then the bold fill lands ── */}
        {paths.map((d, i) => (
          <g key={i}>
            {!reduce && (
              <motion.path
                d={d}
                fill="none"
                stroke={ink}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.9, 0.9, 0] }}
                transition={{
                  pathLength: { duration: s(TRACE), delay: s(lead + i * 0.12), ease: EASE },
                  opacity: {
                    duration: s(TRACE + FILL),
                    delay: s(lead + i * 0.12),
                    times: [0, 0.06, 0.75, 1],
                    ease: 'easeInOut',
                  },
                }}
              />
            )}
            <motion.path
              d={d}
              fill={fill}
              initial={{ opacity: reduce ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: s(FILL), delay: reduce ? 0 : s(lead + TRACE + i * 0.12 - 0.1), ease: 'easeInOut' }}
            />
          </g>
        ))}
      </motion.svg>
    </motion.div>,
    document.body,
  )
}
