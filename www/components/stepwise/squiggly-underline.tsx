'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/cn'

export interface SquigglyUnderlineProps {
  children     : React.ReactNode
  /** Stroke color — also applied to the text so emphasis never relies on the underline alone. Default currentColor. */
  color?       : string
  /** Wave height in px. Scales from font size when omitted. */
  amplitude?   : number
  /** Wave length in px. Scales from font size when omitted. */
  wavelength?  : number
  /** Stroke width in px. Scales from font size when omitted. */
  thickness?   : number
  /** Draw-on duration in seconds at ~100px width. Scales with text length. Default 1.1. */
  duration?    : number
  /** Pause before the draw begins, in seconds. Default 0.2. */
  delay?       : number
  /** Replay the draw each time the element scrolls into view. Default false. */
  replayInView?: boolean
  className?   : string
}

interface Metrics {
  width       : number
  fontSize    : number
  halfLeading : number
  rtl         : boolean
}

// Build a smooth sine path in real pixel space (no viewBox stretching, so the
// stroke width never distorts) using cubic segments per half-wave.
//
// The half-wave length almost never divides the text width evenly, so a
// naive walk-and-clamp leaves a squished, asymmetric final segment wherever
// it happens to hit the edge — the underline looks like it was just cut off
// mid-wave rather than ending cleanly. Instead, pick the nearest whole number
// of half-waves for this width and spread them evenly across it: the
// wavelength stretches or compresses by a few percent (imperceptible) but
// every path always ends exactly on the baseline, in a full crest or trough.
function wavePath(width: number, amp: number, len: number, midY: number) {
  if (width <= 0) return ''
  const half = len / 2
  const count = Math.max(1, Math.round(width / half))
  const step = width / count
  let d = `M 0 ${midY}`
  let dir = -1 // first crest up
  for (let i = 0; i < count; i++) {
    const x = i * step
    const nx = (i + 1) * step
    const cx = x + step / 2
    d += ` Q ${cx} ${midY + dir * amp} ${nx} ${midY}`
    dir *= -1
  }
  return d
}

let probeSvg: SVGSVGElement | null = null
let probePath: SVGPathElement | null = null

function measurePath(d: string) {
  if (!d || typeof document === 'undefined') return 0
  if (!probeSvg) {
    probeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    probePath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    probeSvg.appendChild(probePath)
    probeSvg.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none'
    document.body.appendChild(probeSvg)
  }
  probePath!.setAttribute('d', d)
  return probePath!.getTotalLength()
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function waveMetrics(fontSize: number, amplitude?: number, wavelength?: number, thickness?: number) {
  return {
    amplitude : amplitude ?? fontSize * 0.12,
    wavelength: wavelength ?? fontSize * 0.55,
    thickness : thickness ?? Math.max(fontSize * 0.08, 1.5),
  }
}

/**
 * Squiggly (wavy) underline that draws itself on when scrolled into view. The
 * wave is generated in pixel space from the measured text width, so the stroke
 * stays crisp and scales with the inherited font size.
 */
export function SquigglyUnderline({
  children,
  color = 'currentColor',
  amplitude,
  wavelength,
  thickness,
  duration = 1.1,
  delay = 0.2,
  replayInView = false,
  className,
}: SquigglyUnderlineProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: !replayInView, amount: 0.6 })
  const [metrics, setMetrics] = useState<Metrics>({ width: 0, fontSize: 16, halfLeading: 0, rtl: false })
  const [pathLen, setPathLen] = useState(0)
  const [dashOffset, setDashOffset] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const syncMetrics = () => {
    const el = ref.current
    if (!el) return
    const cs = getComputedStyle(el)
    const fontSize = parseFloat(cs.fontSize) || 16
    // `top: 100%` anchors to the line box, not the glyph baseline — a roomy
    // line-height (e.g. leading-relaxed) leaves several px of invisible
    // leading below the descender before that edge. Half of the leading sits
    // below the text, so subtracting it pulls the wave up to the glyphs.
    const lineHeight = parseFloat(cs.lineHeight)
    const halfLeading = Number.isFinite(lineHeight) ? Math.max(0, (lineHeight - fontSize) / 2) : 0
    setMetrics({
      width: el.offsetWidth,
      fontSize,
      halfLeading,
      rtl: cs.direction === 'rtl',
    })
  }

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(syncMetrics)
    ro.observe(el)
    syncMetrics()
    return () => ro.disconnect()
  }, [])

  const { width, fontSize, halfLeading, rtl } = metrics
  const wave = waveMetrics(fontSize, amplitude, wavelength, thickness)
  const svgH = wave.amplitude * 2 + wave.thickness * 2
  const midY = svgH / 2
  const d = wavePath(width, wave.amplitude, wave.wavelength, midY)
  const drawDuration = reduce ? 0 : Math.min(Math.max(duration * (width / 100), 0.9), 2.6)
  const syncColor = color !== 'currentColor'

  // Measure path + lock hidden before any paint of the stroke.
  useLayoutEffect(() => {
    const len = d ? measurePath(d) : 0
    setPathLen(len)
    setDashOffset(len)
    setTransitioning(false)
  }, [d])

  // After in-view + delay, transition dashoffset len → 0 (true zero-length start).
  useEffect(() => {
    if (!pathLen) return

    if (reduce) {
      setDashOffset(0)
      setTransitioning(false)
      return
    }

    if (!inView) {
      setDashOffset(pathLen)
      setTransitioning(false)
      return
    }

    setDashOffset(pathLen)
    setTransitioning(false)

    let timer: ReturnType<typeof setTimeout>
    const frame = requestAnimationFrame(() => {
      timer = setTimeout(() => {
        setTransitioning(true)
        setDashOffset(0)
      }, delay * 1000)
    })

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [pathLen, inView, reduce, delay, d])

  return (
    <span
      ref={ref}
      className={cn('relative inline-block', className)}
      style={syncColor ? { color } : undefined}
    >
      {children}
      <svg
        className="absolute inset-inline-start-0 top-full w-full overflow-visible pointer-events-none"
        height={svgH}
        style={{
          marginTop: -halfLeading,
          transform: rtl ? 'scaleX(-1)' : undefined,
        }}
        aria-hidden
      >
        {pathLen > 0 && (
          <path
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={wave.thickness}
            strokeLinecap="round"
            strokeDasharray={pathLen}
            strokeDashoffset={dashOffset}
            style={{
              transition: transitioning && !reduce
                ? `stroke-dashoffset ${drawDuration}s ${EASE}`
                : 'none',
            }}
          />
        )}
      </svg>
    </span>
  )
}
