'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { PencilEditIcon, ColorPickerIcon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils/cn'
import { Surface } from '@/components/stepwise/primitives/surface'

// ─── colour math (HSV ↔ RGB ↔ HEX) ───────────────────────────────────────────

function hsvToRgb(h: number, s: number, v: number) {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r = 0, g = 0, b = 0
  if (h < 60)       [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else              [r, g, b] = [c, 0, x]
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) }
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  let h = 0
  if (d) {
    if (max === r)      h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else                h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s: max === 0 ? 0 : d / max, v: max }
}

const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, '0')

function hsvToHex(h: number, s: number, v: number, a: number) {
  const { r, g, b } = hsvToRgb(h, s, v)
  return `#${hex2(r)}${hex2(g)}${hex2(b)}${a < 1 ? hex2(a * 255) : ''}`
}

function parseHex(hex: string) {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const a = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
  return { ...rgbToHsv(r, g, b), a }
}

const CHECKER = 'repeating-conic-gradient(#c8c8cf 0% 25%, #ffffff 0% 50%) 0 / 12px 12px'
const HUE_TRACK = 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)'

// ─── layout ──────────────────────────────────────────────────────────────────

const POP_W  = 248
const POP_H  = 400
const PAD    = 14
const SQUARE = POP_W - PAD * 2   // big SV field — the dominant preview, like the reference

// The SV field clips to a squircle (overflow-hidden), so a thumb centered at
// a literal 0%/100% edge — worst at the corners, where the squircle curves
// inward the most — gets half cut off. Inset the thumb's rendered position
// by its own radius so it's always fully visible; applySv still stores the
// true, unclamped 0–1 value, so dragging to the actual edge still selects
// the true edge color, only the drawn dot stays inside the visible curve.
const THUMB_SIZE = 16
const THUMB_INSET_PCT = ((THUMB_SIZE / 2) / SQUARE) * 100
const THUMB_MIN = THUMB_INSET_PCT
const THUMB_RANGE = 100 - THUMB_INSET_PCT * 2

// ─── component ───────────────────────────────────────────────────────────────

// Trigger box/badge scale together — sizes computed inline via style (not
// template-literal Tailwind classes) since Tailwind can't statically pick up
// a dynamically-built class name at build time. No radius here — the
// trigger is a plain circle (rounded-full), not a squircle.
const SIZES = {
  sm: { box: 40, badge: 20, badgeIcon: 9,  offset: -4 },
  md: { box: 56, badge: 28, badgeIcon: 12, offset: -6 },
  lg: { box: 72, badge: 34, badgeIcon: 15, offset: -7 },
} as const
export type ColorPickerSize = keyof typeof SIZES

export interface ColorPickerProps {
  value?       : string
  onChange?    : (hex: string) => void
  /** Show the row of quick-pick preset swatches below the hex field. Default false. */
  showPresets? : boolean
  /** Trigger swatch size. Default "md". */
  size?        : ColorPickerSize
  /** Render the popover open on mount. Default false. */
  defaultOpen? : boolean
  className?   : string
}

export function ColorPicker({ value = '#3b82f6', onChange, showPresets = false, size = 'md', defaultOpen = false, className }: ColorPickerProps) {
  const sz = SIZES[size]
  const init = parseHex(value)
  const [h, setH] = useState(init.h)
  const [s, setS] = useState(init.s)
  const [v, setV] = useState(init.v)
  const [a, setA] = useState(init.a)
  const [open, setOpen] = useState(defaultOpen)
  const [hexInput, setHexInput] = useState(value.toUpperCase())
  const [eyedropperSupported, setEyedropperSupported] = useState(false)
  // Page-sampling fallback state — no browser feature-detection needed, this
  // just reads DOM pixels the page already rendered, so it works everywhere.
  const [pageSampling, setPageSampling] = useState(false)
  const [previewColor, setPreviewColor] = useState<string | null>(null)
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 })

  const triggerRef = useRef<HTMLButtonElement>(null)
  const popRef = useRef<HTMLDivElement>(null)
  const svRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const drag = useRef<'sv' | 'hue' | null>(null)

  const hex = hsvToHex(h, s, v, a)
  const solidHex = hsvToHex(h, s, v, 1)

  useEffect(() => {
    setEyedropperSupported(typeof window !== 'undefined' && 'EyeDropper' in window)
  }, [])

  // Fixed-position placement so the panel is never clipped by an overflow parent.
  const [pos, setPos] = useState<{ left: number; top: number; origin: string } | null>(null)

  const place = useCallback(() => {
    const t = triggerRef.current?.getBoundingClientRect()
    if (!t) return
    const gap = 12
    const below = t.bottom + gap + POP_H <= window.innerHeight
    let top = below ? t.bottom + gap : t.top - gap - POP_H
    top = Math.max(8, Math.min(top, window.innerHeight - POP_H - 8))
    let left = t.left + t.width / 2 - POP_W / 2
    left = Math.max(8, Math.min(left, window.innerWidth - POP_W - 8))
    setPos({ left, top, origin: below ? 'top center' : 'bottom center' })
  }, [])

  // `defaultOpen` is a showcase/screenshot mode — the popover stays anchored
  // to the trigger in normal flow instead of a viewport-fixed, scroll-tracked
  // overlay, so it scrolls away with the page like any other open dropdown
  // instead of pinning itself to the same screen position forever.
  useLayoutEffect(() => { if (open && !defaultOpen) place() }, [open, defaultOpen, place])
  useEffect(() => {
    if (!open || defaultOpen) return
    const onScroll = () => place()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll, true); window.removeEventListener('resize', onScroll) }
  }, [open, defaultOpen, place])

  const emit = useCallback((nh: number, ns: number, nv: number, na: number) => {
    const out = hsvToHex(nh, ns, nv, na)
    setHexInput(out.toUpperCase())
    onChange?.(out)
  }, [onChange])

  // close on outside click, or Escape — and return focus to the trigger so
  // a keyboard user isn't dropped onto the page with no indication of where
  // focus went.
  useEffect(() => {
    if (!open || defaultOpen) return
    const handler = (e: MouseEvent) => {
      if (!popRef.current?.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // shared pointer handlers for the hue track + SV field
  const applyHue = useCallback((clientX: number) => {
    const r = hueRef.current!.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width))
    const nh = ratio * 360
    setH(nh); emit(nh, s, v, a)
  }, [s, v, a, emit])

  const applySv = useCallback((clientX: number, clientY: number) => {
    const r = svRef.current!.getBoundingClientRect()
    const ns = Math.min(1, Math.max(0, (clientX - r.left) / r.width))
    const nv = Math.min(1, Math.max(0, 1 - (clientY - r.top) / r.height))
    setS(ns); setV(nv); emit(h, ns, nv, a)
  }, [h, a, emit])

  const STEP = 0.02
  const onSvKeyDown = (e: React.KeyboardEvent) => {
    const deltas: Record<string, [number, number]> = {
      ArrowRight: [STEP, 0], ArrowLeft: [-STEP, 0],
      ArrowUp: [0, STEP], ArrowDown: [0, -STEP],
    }
    const d = deltas[e.key]
    if (!d) return
    e.preventDefault()
    const ns = Math.min(1, Math.max(0, s + d[0]))
    const nv = Math.min(1, Math.max(0, v + d[1]))
    setS(ns); setV(nv); emit(h, ns, nv, a)
  }
  const onHueKeyDown = (e: React.KeyboardEvent) => {
    const deltas: Record<string, number> = { ArrowRight: 2, ArrowUp: 2, ArrowLeft: -2, ArrowDown: -2 }
    const d = deltas[e.key]
    if (d === undefined) return
    e.preventDefault()
    const nh = Math.min(360, Math.max(0, h + d))
    setH(nh); emit(nh, s, v, a)
  }

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!drag.current) return
      e.preventDefault()
      if (drag.current === 'hue') applyHue(e.clientX)
      else applySv(e.clientX, e.clientY)
    }
    const up = () => { drag.current = null }
    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', up)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [applyHue, applySv])

  const commitHex = (raw: string) => {
    setHexInput(raw)
    if (/^#?[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(raw)) {
      const p = parseHex(raw.startsWith('#') ? raw : `#${raw}`)
      setH(p.h); setS(p.s); setV(p.v); setA(p.a)
      onChange?.(raw.startsWith('#') ? raw : `#${raw}`)
    }
  }

  // Same technique Figma's own web eyedropper uses outside its desktop app:
  // sample the page's own already-rendered DOM, not the OS screen. No
  // permission dialog, no getDisplayMedia — this is just reading a pixel
  // color the browser already computed for its own content, so it works
  // identically in every browser. The trade-off, same as Figma's: it can
  // only sample colors visible on THIS page, not other apps or windows.
  const sampleCanvas = useRef<HTMLCanvasElement | null>(null)

  // getComputedStyle can serialize a background in rgb(), hsl(), lab(),
  // oklch(), color(), or a named color — this project's own palette is
  // largely oklch/lab, not rgb. Rather than regex-matching one format (and
  // silently failing on the rest, which reads as "nothing sampled" almost
  // everywhere on an OKLCH-heavy page), let the canvas 2D context — which
  // already has to parse every CSS color syntax to paint anything — do it:
  // set it as fillStyle, paint one pixel, read the normalized sRGB back out.
  const cssColorToHex = (css: string): string | null => {
    if (!sampleCanvas.current) {
      const c = document.createElement('canvas')
      c.width = 1; c.height = 1
      sampleCanvas.current = c
    }
    const ctx = sampleCanvas.current.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null
    ctx.clearRect(0, 0, 1, 1)
    // Reset to a known baseline first — an unparseable fillStyle assignment
    // is a silent no-op per spec, which would otherwise let this frame
    // reuse whatever color happened to be set on a previous call.
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'
    ctx.fillStyle = css
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b, alpha] = ctx.getImageData(0, 0, 1, 1).data
    if (alpha === 0) return null
    return `#${hex2(r)}${hex2(g)}${hex2(b)}`
  }

  const colorAtPoint = (clientX: number, clientY: number): string | null => {
    const el = document.elementFromPoint(clientX, clientY)
    let node: Element | null = el
    while (node) {
      const hexColor = cssColorToHex(getComputedStyle(node).backgroundColor)
      if (hexColor) return hexColor
      node = node.parentElement
    }
    return null
  }

  useEffect(() => {
    if (!pageSampling) return
    const prevCursor = document.body.style.cursor
    document.body.style.cursor = 'crosshair'
    let raf = 0
    const onMove = (e: MouseEvent) => {
      // mousemove can fire far faster than the DOM-walk + canvas read needs
      // to run — coalesce to one sample per animation frame.
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        setPreviewPos({ x: e.clientX, y: e.clientY })
        setPreviewColor(colorAtPoint(e.clientX, e.clientY))
      })
    }
    const onClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const c = colorAtPoint(e.clientX, e.clientY)
      if (c) commitHex(c)
      setPageSampling(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPageSampling(false) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', onClick, true)
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.cursor = prevCursor
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick, true)
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSampling])

  // Browser eyedropper — native EyeDropper first (Chromium — an even more
  // precise per-pixel screen sample), page-DOM sampling fallback everywhere
  // else. Both commit straight into the picker.
  const pickFromScreen = async () => {
    if (eyedropperSupported) {
      try {
        // EyeDropper isn't in TS's DOM lib yet.
        const EyeDropperCtor = (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper
        const result = await new EyeDropperCtor().open()
        commitHex(result.sRGBHex)
      } catch {
        // user cancelled — no-op
      }
      return
    }
    setPageSampling(true)
  }

  const PRESETS = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
    '#f43f5e', '#a3e635', '#06b6d4', '#6366f1', '#78716c', '#525252', '#0f172a', '#ffffff',
  ]

  // Shared between the anchored (defaultOpen) and portaled render paths —
  // same panel either way, only the positioning strategy around it differs.
  const panelBody = (
    <>
      {/* Concentric with the inner SV Surface: 14 (its radius) + 14
          (this padding) = 28. */}
      <Surface
        radius={28}
        lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
        className="w-full bg-white shadow-2xl dark:bg-zinc-900"
        style={{ padding: PAD }}
      >
      {/* ── big SV preview — the dominant swatch ── */}
      <Surface radius={20} className="relative overflow-hidden">
        <div
          ref={svRef}
          role="slider"
          tabIndex={0}
          aria-label="Color saturation and brightness"
          aria-valuenow={Math.round(s * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`Saturation ${Math.round(s * 100)}%, brightness ${Math.round(v * 100)}%`}
          onPointerDown={e => { drag.current = 'sv'; applySv(e.clientX, e.clientY) }}
          onKeyDown={onSvKeyDown}
          className="relative cursor-crosshair touch-none outline-offset-2"
          style={{
            width: SQUARE, height: SQUARE,
            background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${h}, 100%, 50%))`,
          }}
        >
          <span
            className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
            style={{ left: `${THUMB_MIN + s * THUMB_RANGE}%`, top: `${THUMB_MIN + (1 - v) * THUMB_RANGE}%`, background: solidHex }}
          />
        </div>
      </Surface>

      {/* ── hue rail — plain horizontal slider, not a ring ── */}
      <div
        ref={hueRef}
        role="slider"
        tabIndex={0}
        aria-label="Hue"
        aria-valuenow={Math.round(h)}
        aria-valuemin={0}
        aria-valuemax={360}
        onPointerDown={e => { drag.current = 'hue'; applyHue(e.clientX) }}
        onKeyDown={onHueKeyDown}
        className="relative mt-3 h-4 w-full cursor-pointer touch-none select-none rounded-full outline-offset-2"
        style={{ background: HUE_TRACK }}
      >
        <span
          className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
          style={{ left: `${(h / 360) * 100}%`, background: `hsl(${h}, 100%, 50%)` }}
        />
      </div>

      {/* hex + swatch — the swatch doubles as the eyedropper trigger, revealed on hover */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={pickFromScreen}
          aria-label="Pick color from screen"
          className="group relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-700"
        >
          <span className="absolute inset-0" style={{ background: CHECKER }} />
          <span className="absolute inset-0" style={{ background: hex }} />
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-transparent transition-colors duration-150 group-hover:bg-black/45 group-hover:text-white">
            <HugeiconsIcon icon={ColorPickerIcon} size={13} strokeWidth={2} color="currentColor" />
          </span>
        </button>
        <input
          value={hexInput}
          onChange={e => commitHex(e.target.value)}
          spellCheck={false}
          maxLength={9}
          aria-label="Hex color value"
          className="h-8 min-w-0 flex-1 rounded-[13.5px] border border-zinc-200 bg-transparent px-2.5 text-center font-mono text-[12px] tracking-wider text-zinc-700 outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:focus:border-zinc-500"
        />
      </div>

      {/* presets — opt-in via showPresets */}
      {showPresets && (
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => commitHex(p)}
              aria-label={p}
              className="h-5 w-5 rounded-full border border-black/10 transition-transform duration-100 hover:scale-115 active:scale-90 dark:border-white/15"
              style={{ background: p }}
            />
          ))}
        </div>
      )}
      </Surface>
    </>
  )

  return (
    <div className={cn('relative inline-block', className)}>
      {/* trigger — glossy squircle swatch with a pencil badge, like a saved-palette tile */}
      <motion.button
        ref={triggerRef}
        onClick={() => setOpen(o => !o)}
        aria-label="Pick a color"
        aria-expanded={open}
        whileTap={{ scale: 0.94 }}
        className={cn('group relative block transition-opacity duration-150', pageSampling && 'pointer-events-none opacity-30')}
        style={{ width: sz.box, height: sz.box }}
      >
        {/* A perfect circle (radius is always exactly half the box) needs no
            squircle smoothing — corners only exist on shapes that have them.
            Surface/SmoothCorners also does an async geometry measurement
            pass that briefly renders at zero height while "pending", which
            for a plain circle is pure unneeded overhead — plain rounded-full
            clips instantly with the very first paint. */}
        <div className="relative h-full w-full overflow-hidden rounded-full">
          <span className="absolute inset-0" style={{ background: CHECKER }} />
          <span className="absolute inset-0 transition-colors duration-150" style={{ background: hex }} />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10" />
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(0,0,0,0.12)' }}
        />
        <span
          aria-hidden
          className={cn(
            'absolute flex items-center justify-center rounded-full',
            'border-2 border-white bg-zinc-900 text-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]',
            'transition-transform duration-150 ease-out group-hover:scale-110',
            'dark:border-zinc-950 dark:bg-white dark:text-zinc-900',
          )}
          style={{ width: sz.badge, height: sz.badge, bottom: sz.offset, right: sz.offset }}
        >
          <HugeiconsIcon icon={PencilEditIcon} size={sz.badgeIcon} strokeWidth={2} color="currentColor" />
        </span>
      </motion.button>

      {defaultOpen ? (
        <AnimatePresence>
          {open && (
            <motion.div
              ref={popRef}
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: pageSampling ? 0.3 : 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 6 }}
              transition={{ type: 'spring', duration: 0.32, bounce: 0.08 }}
              className={cn('absolute left-1/2 top-full z-[60] mt-3 -translate-x-1/2', pageSampling && 'pointer-events-none')}
              style={{ width: POP_W, transformOrigin: 'top center' }}
            >{panelBody}</motion.div>
          )}
        </AnimatePresence>
      ) : typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {open && pos && (
            <motion.div
              ref={popRef}
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              // Motion sets opacity via inline style, which beats a Tailwind
              // class in specificity — the dim-during-sampling state has to
              // ride in this same `animate` target, not a CSS class, or it's
              // silently overridden back to fully opaque every render.
              animate={{ opacity: pageSampling ? 0.3 : 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 6 }}
              transition={{ type: 'spring', duration: 0.32, bounce: 0.08 }}
              className={cn('fixed z-[9999]', pageSampling && 'pointer-events-none')}
              style={{ left: pos.left, top: pos.top, width: POP_W, transformOrigin: pos.origin }}
            >{panelBody}</motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* page-sampling eyedropper fallback — Firefox/Safari have no native
          EyeDropper, so this reads the page's own DOM colors instead.
          Everything here is pointer-events-none except the invisible hit
          layer isn't even needed: the window-level listeners in the effect
          above do the work, this just draws the hint + live preview swatch.
          The swatch flips to sit BELOW the cursor near the top of the
          viewport instead of rendering off-screen above it, and always
          carries its hex value as text — a near-white/near-black sample is
          visually indistinguishable from "nothing happened", so the number
          is what actually proves it's live. */}
      {typeof document !== 'undefined' && pageSampling && createPortal(
        <>
          <div className="pointer-events-none fixed left-1/2 top-6 z-[10000] -translate-x-1/2 rounded-full bg-zinc-900/90 px-4 py-2 text-[13px] text-white shadow-lg dark:bg-white/90 dark:text-zinc-900">
            Click any color on this page to sample it · Esc to cancel
          </div>
          <div
            className="pointer-events-none fixed z-[10000] flex items-center gap-2"
            style={{
              left: previewPos.x + 18,
              top: previewPos.y < 60 ? previewPos.y + 18 : previewPos.y - 18,
              transform: previewPos.y < 60 ? 'translateY(0)' : 'translateY(-100%)',
            }}
          >
            <div
              className="h-7 w-7 shrink-0 overflow-hidden rounded-full border-2 shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
              style={{ borderColor: previewColor ? '#fff' : 'rgba(0,0,0,0.25)' }}
            >
              <span className="block h-full w-full" style={{ background: previewColor ?? CHECKER }} />
            </div>
            <span className="rounded-full bg-zinc-900/90 px-2 py-1 font-mono text-[11px] tracking-wide text-white shadow-lg dark:bg-white/90 dark:text-zinc-900">
              {previewColor ? previewColor.toUpperCase() : '—'}
            </span>
          </div>
        </>,
        document.body,
      )}
    </div>
  )
}
