'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import rough from 'roughjs'
import { cn } from '@/lib/utils/cn'

export interface CircleAnnotationProps {
  children      : React.ReactNode
  /** Stroke color — also applied to the text when set. Default currentColor. */
  color?        : string
  /** Stroke width in px. Scales from font size when omitted. */
  thickness?    : number
  /** Sketchiness (roughjs roughness). Default 1.6. */
  roughness?    : number
  /** Gap between the text and the loop, px. Scales from font size when omitted. */
  padding?      : number
  /** Draw-on duration in seconds. Default 1.25. */
  duration?     : number
  /** Pause before the draw begins, in seconds. Default 0.25. */
  delay?        : number
  /** Stagger between loops when doubleStroke is on, in seconds. Default 0.2. */
  stagger?      : number
  /** Draw a second loop for the classic double-circled look. Default true. */
  doubleStroke? : boolean
  /** Replay the draw each time the element scrolls into view. Default false. */
  replayInView? : boolean
  className?    : string
}

interface Size {
  w       : number
  h       : number
  fontSize: number
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

/**
 * A hand-drawn circle scribbled around the text, drawn on when scrolled into
 * view. Uses rough.js for an authentic sketchy ellipse, then reveals each
 * stroke from zero length with a CSS dashoffset transition.
 */
export function CircleAnnotation({
  children,
  color = 'currentColor',
  thickness,
  roughness = 1.6,
  padding,
  duration = 1.25,
  delay = 0.25,
  stagger = 0.2,
  doubleStroke = true,
  replayInView = false,
  className,
}: CircleAnnotationProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: !replayInView, amount: 0.7 })
  const [size, setSize] = useState<Size>({ w: 0, h: 0, fontSize: 16 })
  const [pathLens, setPathLens] = useState<number[]>([])
  const [dashOffsets, setDashOffsets] = useState<number[]>([])
  const [transitioning, setTransitioning] = useState(false)

  const syncMetrics = () => {
    const el = ref.current
    if (!el) return
    const cs = getComputedStyle(el)
    setSize({
      w: el.offsetWidth,
      h: el.offsetHeight,
      fontSize: parseFloat(cs.fontSize) || 16,
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

  const pad = padding ?? Math.max(size.fontSize * 0.55, 14)
  const stroke = thickness ?? Math.max(size.fontSize * 0.1, 2)
  const inset = stroke + Math.max(size.fontSize * 0.12, 3)
  const syncColor = color !== 'currentColor'
  const boxW = size.w + pad * 2
  const boxH = size.h + pad * 2

  const paths = useMemo(() => {
    if (boxW <= 0 || boxH <= 0) return [] as string[]
    const gen = rough.generator()
    const drawable = gen.ellipse(
      boxW / 2,
      boxH / 2,
      Math.max(boxW - inset * 2, size.w),
      Math.max(boxH - inset * 2, size.h),
      {
        roughness,
        strokeWidth: stroke,
        seed: 42,
        disableMultiStroke: !doubleStroke,
        bowing: 1.4,
      },
    )
    return gen.toPaths(drawable).map(p => p.d)
  }, [boxW, boxH, size.w, size.h, roughness, stroke, inset, doubleStroke])

  useLayoutEffect(() => {
    const lens = paths.map(d => measurePath(d))
    setPathLens(lens)
    setDashOffsets(lens)
    setTransitioning(false)
  }, [paths])

  useEffect(() => {
    if (!pathLens.length) return

    if (reduce) {
      setDashOffsets(pathLens.map(() => 0))
      setTransitioning(false)
      return
    }

    if (!inView) {
      setDashOffsets(pathLens)
      setTransitioning(false)
      return
    }

    setDashOffsets(pathLens)
    setTransitioning(false)

    let timer: ReturnType<typeof setTimeout>
    const frame = requestAnimationFrame(() => {
      timer = setTimeout(() => {
        setTransitioning(true)
        setDashOffsets(pathLens.map(() => 0))
      }, delay * 1000)
    })

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [pathLens, inView, reduce, delay, paths])

  return (
    <span
      ref={ref}
      className={cn('relative inline-block', className)}
      style={syncColor ? { color } : undefined}
    >
      {children}
      {paths.length > 0 && pathLens.length === paths.length && (
        <svg
          className="absolute pointer-events-none overflow-visible"
          width={boxW}
          height={boxH}
          style={{ insetInlineStart: -pad, insetBlockStart: -pad }}
          aria-hidden
        >
          {paths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={pathLens[i]}
              strokeDashoffset={dashOffsets[i] ?? pathLens[i]}
              style={{
                transition: transitioning && !reduce
                  ? `stroke-dashoffset ${duration}s ${EASE} ${i * stagger}s`
                  : 'none',
              }}
            />
          ))}
        </svg>
      )}
    </span>
  )
}
