'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/cn'

export type FrameHandles = 'square' | 'circle'
export type FrameLine    = 'solid' | 'dashed' | 'long'

export interface SelectionFrameProps {
  children   : React.ReactNode
  /** Corner handle shape. Default "square". */
  handles?   : FrameHandles
  /** Stroke style. Default "solid". "dashed" and "long" both march when animated. */
  line?      : FrameLine
  /** Override the [dash, gap] px pair a non-solid `line` resolves to. */
  dash?      : [number, number]
  /** Marching ants — only applies to "dashed" / "long" lines. Default false. */
  animated?  : boolean
  /** Accent color. Default Figma blue. */
  color?     : string
  /** Frame corner radius. Default 0. */
  radius?    : number
  /** Gap between the content and the frame. Default 4. */
  padding?   : number
  /** Render inline (for text spans) instead of block. Default true. */
  inline?    : boolean
  className? : string
}

const STROKE = 1.5

const LINE_DASH: Record<FrameLine, [number, number] | undefined> = {
  solid: undefined,
  dashed: [4, 4],
  long: [10, 6],
}

export function SelectionFrame({
  children,
  handles = 'square',
  line = 'solid',
  dash,
  animated = false,
  color = '#0d99ff',
  radius = 0,
  padding = 4,
  inline = true,
  className,
}: SelectionFrameProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const reduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setSize({ w: el.offsetWidth, h: el.offsetHeight }))
    ro.observe(el)
    setSize({ w: el.offsetWidth, h: el.offsetHeight })
    return () => ro.disconnect()
  }, [])

  // frame box sits `padding` outside the content, stroke centered on its edge
  const fw = size.w + padding * 2
  const fh = size.h + padding * 2
  const resolvedDash = dash ?? LINE_DASH[line]
  const period = resolvedDash ? resolvedDash[0] + resolvedDash[1] : 0

  // Marching ants only — a "draws itself on" reveal never made sense for a
  // solid stroke (there's no dash pattern to march), so animated + solid is
  // just a static frame with animated corner handles. Reduced motion turns
  // this off too — it's an infinite, indefinitely-repeating loop, exactly
  // the case the preference exists for.
  const marching = animated && !!resolvedDash && !reduceMotion
  const animateHandles = animated && !reduceMotion

  const corners: Array<[string, number, number]> = [
    ['tl', 0, 0], ['tr', fw, 0], ['bl', 0, fh], ['br', fw, fh],
  ]

  const handleSize = handles === 'circle' ? 8 : 7

  return (
    <span
      className={cn('relative', inline ? 'inline-block' : 'block', className)}
      style={{ lineHeight: inline ? undefined : 0 }}
    >
      <span ref={ref} className={cn(inline ? 'inline-block' : 'block')}>
        {children}
      </span>

      {fw > 0 && (
        <>
          {/* frame */}
          <svg
            className="absolute pointer-events-none overflow-visible"
            width={fw}
            height={fh}
            style={{ left: -padding, top: -padding }}
            aria-hidden
          >
            <motion.rect
              x={STROKE / 2}
              y={STROKE / 2}
              width={Math.max(0, fw - STROKE)}
              height={Math.max(0, fh - STROKE)}
              rx={radius}
              fill="none"
              stroke={color}
              strokeWidth={STROKE}
              strokeDasharray={resolvedDash ? `${resolvedDash[0]} ${resolvedDash[1]}` : undefined}
              {...(marching
                ? {
                    animate: { strokeDashoffset: [0, -period] },
                    transition: { duration: period * 0.075, repeat: Infinity, ease: 'linear' },
                  }
                : {})}
            />
          </svg>

          {/* corner handles — boxSizing: border-box is what actually keeps
              these centered on their corner point: without it, the border
              adds outside the declared width/height, so the -handleSize/2
              margin offset (sized for the border-less box) undershoots and
              the handle renders visibly off-center from the true corner. */}
          {corners.map(([key, cx, cy], i) => (
            <motion.span
              key={key}
              aria-hidden
              className="absolute pointer-events-none bg-white dark:bg-zinc-950"
              initial={animateHandles ? { scale: 0, opacity: 0 } : false}
              animate={animateHandles ? { scale: 1, opacity: 1 } : undefined}
              transition={{ type: 'spring', stiffness: 600, damping: 24, delay: animateHandles ? 0.28 + i * 0.05 : 0 }}
              style={{
                left: cx - padding,
                top: cy - padding,
                width: handleSize,
                height: handleSize,
                marginLeft: -handleSize / 2,
                marginTop: -handleSize / 2,
                boxSizing: 'border-box',
                border: `${STROKE}px solid ${color}`,
                borderRadius: handles === 'circle' ? '9999px' : 1,
                boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
              }}
            />
          ))}
        </>
      )}
    </span>
  )
}
