'use client'

import {
  memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react'
import { useReducedMotion } from 'motion/react'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Toggle } from '@/components/stepwise/toggle'
import { cn } from '@/lib/utils/cn'

export interface InfiniteCanvasProps {
  /** The tiles to scatter — images, cards, any React nodes. Needs 3+ for a clean weave. */
  items            : React.ReactNode[]
  /** Tile width in px. Default 200. (grid mode) */
  cellWidth?       : number
  /** Tile height in px. Default 200. (grid mode) */
  cellHeight?      : number
  /** Gap between tiles in px. Default 16. */
  gap?             : number
  /** Offset alternate columns by half a row for an organic, brick-like weave. Default true. */
  stagger?         : boolean
  /** Start with the slow ambient drift running. Default true. */
  defaultAutoMotion?: boolean
  /** Drift velocity in px/frame while auto-motion is on. Default { x: -0.32, y: -0.18 }. */
  motionVector?    : { x: number; y: number }
  /** Show the built-in auto-motion toggle pill (bottom-right). Default true. */
  showToggle?      : boolean
  /** Centered overlay — pass a heading/CTA to get the "text in the middle" variant. */
  centerContent?   : React.ReactNode
  /** Canvas height. Default 520. */
  height?          : number | string
  className?       : string
  /** Extra classes on each tile's Surface. */
  tileClassName?   : string
  /** Drop the card chrome — nodes float directly on the canvas. Default false. */
  bare?            : boolean
  /**
   * Pack items into balanced columns (variable heights, tight gaps) instead of a
   * uniform grid, then tile that block infinitely. Great for showcasing components
   * of different sizes with no dead space. Default false.
   */
  masonry?         : boolean
  /** Column count for masonry mode. Default 6. */
  columns?         : number
  /** Column width in px for masonry mode. Default 210. */
  columnWidth?     : number
}

// ── deterministic RNG so the weave is stable across renders ──────────────────
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const evenize = (x: number) => (x % 2 ? x + 1 : x)

/**
 * Build a cols×rows chunk of item indices that tiles the plane like a torus:
 * no cell shares an item with the neighbour to its left, right, top or bottom —
 * INCLUDING across the wrap seams — so the infinite repeat never places the
 * same tile edge-to-edge with itself.
 */
function buildChunk(n: number, cols: number, rows: number, seed: number): Uint16Array {
  const rng = mulberry32(seed)
  for (let attempt = 0; attempt < 300; attempt++) {
    const g = new Int32Array(cols * rows).fill(-1)
    let ok = true
    for (let r = 0; r < rows && ok; r++) {
      for (let c = 0; c < cols; c++) {
        const banned = new Set<number>()
        banned.add(g[r * cols + ((c - 1 + cols) % cols)])           // left (wraps)
        banned.add(g[((r - 1 + rows) % rows) * cols + c])           // top (wraps)
        if (c === cols - 1) banned.add(g[r * cols])                 // right seam → col 0
        if (r === rows - 1) banned.add(g[c])                        // bottom seam → row 0
        const pool: number[] = []
        for (let k = 0; k < n; k++) if (!banned.has(k)) pool.push(k)
        if (!pool.length) { ok = false; break }
        g[r * cols + c] = pool[Math.floor(rng() * pool.length)]
      }
    }
    if (ok) return Uint16Array.from(g)
  }
  // fallback (only for tiny n): a diagonal weave — never adjacent horizontally
  const g = new Uint16Array(cols * rows)
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) g[r * cols + c] = (c + r * 2) % n
  return g
}

// ── one grid tile — memoised so a pan (wrapper transform only) never re-renders it ─
const Tile = memo(function Tile({
  left, top, w, h, radius, node, tileClassName, bare,
}: {
  left: number; top: number; w: number; h: number; radius: number
  node: React.ReactNode; tileClassName?: string; bare?: boolean
}) {
  return (
    <div
      className="absolute transition-transform duration-200 ease-out will-change-transform hover:z-10 hover:scale-[1.04]"
      style={{ left, top, width: w, height: h }}
    >
      {bare ? (
        <div className={cn('flex h-full w-full items-center justify-center', tileClassName)}>{node}</div>
      ) : (
        <Surface
          radius={radius}
          lisse={{ middleBorder: { width: 1, opacity: 1, color: 'rgba(122,122,135,0.22)' } }}
          className={cn(
            'flex h-full w-full items-center justify-center overflow-hidden bg-zinc-100 dark:bg-zinc-800',
            'shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(0,0,0,0.18)]',
            tileClassName,
          )}
        >
          {node}
        </Surface>
      )}
    </div>
  )
})

// ── one masonry block — balanced CSS columns pack items tight with only `gap` px ─
const MasonryBlock = memo(function MasonryBlock({
  items, columns, gap, contentW,
}: {
  items: React.ReactNode[]; columns: number; gap: number; contentW: number
}) {
  return (
    <div style={{ width: contentW, columnCount: columns, columnGap: gap, columnFill: 'balance' }}>
      {items.map((node, i) => (
        <div
          key={i}
          className="flex justify-center transition-transform duration-200 ease-out hover:scale-[1.04]"
          style={{ width: '100%', marginBottom: gap, breakInside: 'avoid', WebkitColumnBreakInside: 'avoid' } as React.CSSProperties}
        >
          {node}
        </div>
      ))}
    </div>
  )
})

type Range = { minC: number; maxC: number; minR: number; maxR: number }

export function InfiniteCanvas({
  items,
  cellWidth = 200,
  cellHeight = 200,
  gap = 16,
  stagger = true,
  defaultAutoMotion = true,
  motionVector = { x: -0.32, y: -0.18 },
  showToggle = true,
  centerContent,
  height = 520,
  className,
  tileClassName,
  bare = false,
  masonry = false,
  columns = 6,
  columnWidth = 210,
}: InfiniteCanvasProps) {
  const reduce = useReducedMotion()
  const n = Math.max(1, items.length)

  const strideX = cellWidth + gap
  const strideY = cellHeight + gap
  const radius = Math.round(Math.min(cellWidth, cellHeight) * 0.12)

  // masonry block geometry
  const contentW = columns * columnWidth + (columns - 1) * gap
  const blockW   = columns * (columnWidth + gap)          // + one gap between block copies
  const [blockH, setBlockH] = useState(700)
  const blockHRef = useRef(700)
  blockHRef.current = blockH

  // chunk sized to a few multiples of n so items scatter without visible tiling (grid mode)
  const { cols, rows, chunk } = useMemo(() => {
    const cc = Math.min(12, Math.max(6, evenize(Math.round(Math.sqrt(n) * 2) + 4)))
    return { cols: cc, rows: cc, chunk: buildChunk(n, cc, cc, 0x9e37 + n) }
  }, [n])

  const containerRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const off = useRef({ x: 0, y: 0 })
  const vel = useRef({ x: 0, y: 0 })
  const dragging = useRef(false)
  const didDrag = useRef(false)
  const sizeRef = useRef({ w: 0, h: 0 })
  const rangeRef = useRef<Range>({ minC: 0, maxC: 0, minR: 0, maxR: 0 })

  const [range, setRange] = useState<Range>({ minC: 0, maxC: 0, minR: 0, maxR: 0 })
  const [auto, setAuto] = useState(defaultAutoMotion)

  // item + stagger for an absolute grid cell (grid mode)
  const itemAt = useCallback((c: number, r: number) => {
    const cc = ((c % cols) + cols) % cols
    const rr = ((r % rows) + rows) % rows
    return items[chunk[rr * cols + cc] % n]
  }, [items, chunk, cols, rows, n])

  // push offset → wrapper transform (imperative, no React render) and refresh
  // the visible range only when we cross a cell / block boundary.
  const apply = useCallback(() => {
    const { x, y } = off.current
    if (wrapRef.current) wrapRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
    const { w, h } = sizeRef.current
    if (!w) return
    let next: Range
    if (masonry) {
      const bh = blockHRef.current || 700
      next = {
        minC: Math.floor(-x / blockW) - 1,
        maxC: Math.ceil((-x + w) / blockW) + 1,
        minR: Math.floor(-y / bh) - 1,
        maxR: Math.ceil((-y + h) / bh) + 1,
      }
    } else {
      const pad = 2
      next = {
        minC: Math.floor(-x / strideX) - pad,
        maxC: Math.ceil((-x + w) / strideX) + pad,
        minR: Math.floor(-y / strideY) - pad,
        maxR: Math.ceil((-y + h) / strideY) + pad + (stagger ? 1 : 0),
      }
    }
    const prev = rangeRef.current
    if (next.minC !== prev.minC || next.maxC !== prev.maxC || next.minR !== prev.minR || next.maxR !== prev.maxR) {
      rangeRef.current = next
      setRange(next)
    }
  }, [masonry, blockW, strideX, strideY, stagger])

  // measure container — synchronously up front, then keep in sync on resize
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      sizeRef.current = { w: r.width, h: r.height }
      apply()
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [apply])

  // measure the masonry block height so copies tile without overlap / dead gaps
  useLayoutEffect(() => {
    if (!masonry) return
    const el = measureRef.current
    if (!el) return
    const measure = () => {
      const hh = el.offsetHeight
      if (hh && Math.abs(hh - blockHRef.current) > 0.5) setBlockH(hh)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [masonry, items, columns, columnWidth, gap])

  // recompute the visible range once the block height is known
  useLayoutEffect(() => { if (masonry) apply() }, [blockH, masonry, apply])

  // the one animation loop: inertia after release, then ambient drift
  useEffect(() => {
    let raf = 0
    const FRICTION = 0.92
    const loop = () => {
      if (!dragging.current) {
        const v = vel.current
        if (Math.abs(v.x) > 0.05 || Math.abs(v.y) > 0.05) {
          off.current.x += v.x; off.current.y += v.y
          v.x *= FRICTION; v.y *= FRICTION
          apply()
        } else if (auto && !reduce) {
          off.current.x += motionVector.x
          off.current.y += motionVector.y
          apply()
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [auto, reduce, apply, motionVector.x, motionVector.y])

  // ── pointer drag ──
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let startX = 0, startY = 0, baseX = 0, baseY = 0
    let lastX = 0, lastY = 0, lastT = 0

    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('[data-canvas-control]')) return
      dragging.current = true
      didDrag.current = false
      vel.current = { x: 0, y: 0 }
      startX = e.clientX; startY = e.clientY
      baseX = off.current.x; baseY = off.current.y
      lastX = e.clientX; lastY = e.clientY; lastT = performance.now()
      try { el.setPointerCapture(e.pointerId) } catch { /* no active pointer */ }
      el.style.cursor = 'grabbing'
    }
    const move = (e: PointerEvent) => {
      if (!dragging.current) return
      const dx = e.clientX - startX, dy = e.clientY - startY
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag.current = true
      off.current.x = baseX + dx
      off.current.y = baseY + dy
      const now = performance.now()
      const dt = Math.max(1, now - lastT)
      vel.current.x = Math.max(-45, Math.min(45, (e.clientX - lastX) / dt * 16))
      vel.current.y = Math.max(-45, Math.min(45, (e.clientY - lastY) / dt * 16))
      lastX = e.clientX; lastY = e.clientY; lastT = now
      apply()
    }
    const up = (e: PointerEvent) => {
      if (!dragging.current) return
      dragging.current = false
      try { el.releasePointerCapture(e.pointerId) } catch { /* not captured */ }
      el.style.cursor = 'grab'
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [apply])

  // suppress clicks that were actually drags (so tiles can still hold links)
  const onClickCapture = (e: React.MouseEvent) => {
    if (didDrag.current) { e.preventDefault(); e.stopPropagation() }
  }

  // build visible tiles / blocks
  const nodes: React.ReactNode[] = []
  if (masonry) {
    for (let c = range.minC; c <= range.maxC; c++) {
      for (let r = range.minR; r <= range.maxR; r++) {
        const offX = c * blockW
        const offY = r * blockH + (stagger && (((c % 2) + 2) % 2) === 1 ? blockH / 2 : 0)
        nodes.push(
          <div key={`${c},${r}`} className="absolute left-0 top-0" style={{ transform: `translate(${offX}px, ${offY}px)` }}>
            <MasonryBlock items={items} columns={columns} gap={gap} contentW={contentW} />
          </div>,
        )
      }
    }
  } else {
    for (let c = range.minC; c <= range.maxC; c++) {
      for (let r = range.minR; r <= range.maxR; r++) {
        nodes.push(
          <Tile
            key={`${c},${r}`}
            left={c * strideX}
            top={r * strideY + (stagger && (((c % 2) + 2) % 2) === 1 ? strideY / 2 : 0)}
            w={cellWidth}
            h={cellHeight}
            radius={radius}
            node={itemAt(c, r)}
            tileClassName={tileClassName}
            bare={bare}
          />,
        )
      }
    }
  }

  return (
    <div
      ref={containerRef}
      onClickCapture={onClickCapture}
      className={cn(
        'relative w-full touch-none select-none overflow-hidden bg-zinc-50 dark:bg-zinc-950',
        'cursor-grab [--canvas-fade:rgba(250,250,250,0.92)] dark:[--canvas-fade:rgba(9,9,11,0.92)]',
        className,
      )}
      style={{ height }}
    >
      {/* the panned plane */}
      <div ref={wrapRef} className="absolute left-0 top-0 will-change-transform">
        {nodes}
      </div>

      {/* hidden measurement copy for masonry block height */}
      {masonry && (
        <div ref={measureRef} aria-hidden className="pointer-events-none absolute left-0 top-0" style={{ visibility: 'hidden' }}>
          <MasonryBlock items={items} columns={columns} gap={gap} contentW={contentW} />
        </div>
      )}

      {/* edge vignette — sells the depth and hides the hard tile fringe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 50%, transparent 55%, var(--canvas-fade, rgba(250,250,250,0.9)) 100%)',
        }}
      />

      {/* text-in-the-middle variant */}
      {centerContent && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center">
          <div className="pointer-events-auto" data-canvas-control>{centerContent}</div>
        </div>
      )}

      {/* auto-motion toggle */}
      {showToggle && (
        <div className="absolute bottom-3 right-3 z-20" data-canvas-control>
          <Surface
            radius={13}
            lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
            className="flex items-center gap-2.5 bg-white/80 px-3 py-2 backdrop-blur-md dark:bg-zinc-900/80"
          >
            <span className="text-[12px] font-medium tracking-[-0.01em] text-zinc-600 dark:text-zinc-300">
              Auto-motion
            </span>
            <Toggle size="sm" checked={auto} onChange={setAuto} />
          </Surface>
        </div>
      )}
    </div>
  )
}
