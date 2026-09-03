'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'

/** iOS blue plus the other system tints, for the handles + highlight. */
export type AppleAccent = 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'green' | 'graphite'

export const APPLE_ACCENTS: Record<AppleAccent, string> = {
  blue:     '#007aff',
  purple:   '#a550a7',
  pink:     '#f74f9e',
  red:      '#ff3b30',
  orange:   '#ff9500',
  green:    '#34c759',
  graphite: '#8e8e93',
}

export interface AppleSelectProps {
  /** The full text. */
  text          : string
  /** The highlighted range as [start, end] character offsets - fixed; visitors can't drag it. */
  selection?    : [number, number]
  /** Handle + highlight colour. Default iOS blue. */
  accent?       : string
  /** A little breathing room (px) added to each edge of the highlight so the
      vertical handle bars don't sit right on the glyphs. Default 3. */
  edgePadding?  : number
  className?    : string
}

type CharBox = { i: number; left: number; right: number; top: number; bottom: number }

function hexToRgba(hex: string, a: number): string {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  const n = parseInt(h, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

/**
 * An iOS-style text highlight: a fixed, non-draggable selection set through
 * `selection`. A translucent band sits under the range with a lollipop handle
 * at each end, like a settled selection on iPhone.
 */
export function AppleSelect({
  text,
  selection,
  accent = APPLE_ACCENTS.blue,
  edgePadding = 3,
  className,
}: AppleSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [geom, setGeom] = useState<CharBox[]>([])

  const [start, end] = selection ?? defaultWordRange(text)

  // Measure every character box relative to the container.
  const measure = useCallback(() => {
    const node = textRef.current?.firstChild
    const container = containerRef.current
    if (!node || !container) return
    const crect = container.getBoundingClientRect()
    const boxes: CharBox[] = []
    const range = document.createRange()
    for (let i = 0; i < text.length; i++) {
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      const r = range.getBoundingClientRect()
      boxes.push({
        i,
        left: r.left - crect.left,
        right: r.right - crect.left,
        top: r.top - crect.top,
        bottom: r.bottom - crect.top,
      })
    }
    setGeom(boxes)
  }, [text])

  useLayoutEffect(() => { measure() }, [measure])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    window.addEventListener('resize', measure)
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(measure)
    }
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [measure])

  // Derive the highlight rects from that geometry, padded slightly per edge.
  const pad = edgePadding
  const lines: { top: number; bottom: number; left: number; right: number }[] = []
  for (let i = start; i < end && i < geom.length; i++) {
    const b = geom[i]
    const last = lines[lines.length - 1]
    if (last && Math.abs(last.top - b.top) < 1) {
      last.right = Math.max(last.right, b.right)
      last.left = Math.min(last.left, b.left)
    } else {
      lines.push({ top: b.top, bottom: b.bottom, left: b.left, right: b.right })
    }
  }
  // breathing room only on the outer edges of the whole selection
  if (lines.length) {
    lines[0].left -= pad
    lines[lines.length - 1].right += pad
  }

  const startBox = geom[start]
  const endBox = geom[Math.min(end, geom.length) - 1]
  const highlight = hexToRgba(accent, 0.26)

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-[420px] select-none', className)}>
      {/* highlight rects */}
      {lines.map((ln, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-[3px]"
          style={{ left: ln.left, top: ln.top, width: ln.right - ln.left, height: ln.bottom - ln.top, background: highlight }}
        />
      ))}

      {/* the text */}
      <p className="relative z-10 text-[19px] leading-[1.9] tracking-[-0.01em] text-zinc-800 dark:text-zinc-100">
        <span ref={textRef}>{text}</span>
      </p>

      {/* start handle - dot above the line, bar pushed out by the edge padding */}
      {startBox && <Handle which="start" accent={accent} barX={startBox.left - pad} top={startBox.top} height={startBox.bottom - startBox.top} />}
      {/* end handle - dot below the line */}
      {endBox && <Handle which="end" accent={accent} barX={endBox.right + pad} top={endBox.top} height={endBox.bottom - endBox.top} />}
    </div>
  )
}

// Lollipop handle: a bar the height of the line with a dot on one end.
function Handle({ which, accent, barX, top, height }: { which: 'start' | 'end'; accent: string; barX: number; top: number; height: number }) {
  const isStart = which === 'start'
  const DOT = 11
  const dotCY = isStart ? top : top + height
  return (
    <>
      <div className="pointer-events-none absolute z-20 rounded-full" style={{ left: barX - 1, top, width: 2, height, background: accent }} />
      <div className="pointer-events-none absolute z-20 rounded-full" style={{ left: barX, top: dotCY, width: DOT, height: DOT, background: accent, transform: 'translate(-50%, -50%)' }} />
    </>
  )
}

// Pick a sensible default: the first whole word roughly mid-text.
function defaultWordRange(text: string): [number, number] {
  const mid = Math.floor(text.length / 2)
  let s = mid, e = mid
  while (s > 0 && /\S/.test(text[s - 1])) s--
  while (e < text.length && /\S/.test(text[e])) e++
  if (s === e) return [0, Math.min(text.length, 12)]
  return [s, e]
}
