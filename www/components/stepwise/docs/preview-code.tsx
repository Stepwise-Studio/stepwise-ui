'use client'

import { useState, useRef, useCallback, useEffect, useId } from 'react'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ViewIcon, CodeIcon } from '@hugeicons/core-free-icons'
import { Surface } from '@/components/stepwise/primitives/surface'
import { cn } from '@/lib/utils/cn'

type Tab = 'preview' | 'code'

const BAYER8 = [
  [ 0, 32,  8, 40,  2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44,  4, 36, 14, 46,  6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [ 3, 35, 11, 43,  1, 33,  9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47,  7, 39, 13, 45,  5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
]

const TRANSITION_MS = 520

// 65 mask data-URLs (steps 0–64), built once as inline SVG.
// SVG is text-based — no async PNG decode path — so the first transition
// is as smooth as subsequent ones in every browser including Firefox.
let _masks: string[] | null = null

function getDitherMasks(): string[] {
  if (_masks) return _masks
  _masks = Array.from({ length: 65 }, (_, step) => {
    let rects = ''
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (BAYER8[y][x] >= step) {
          rects += `<rect x='${x}' y='${y}' width='1' height='1'/>`
        }
      }
    }
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'><g fill='white'>${rects}</g></svg>`
    return `data:image/svg+xml;base64,${btoa(svg)}` // raw data URL — setMask wraps in url()
  })
  return _masks
}

// TypeScript-safe setter for webkit-prefixed mask properties
function setMask(el: HTMLElement, url: string) {
  const s = el.style as unknown as Record<string, string>
  s.maskImage        = url
  s.webkitMaskImage  = url
}

function setMaskProps(el: HTMLElement) {
  const s = el.style as unknown as Record<string, string>
  s.maskSize         = '16px 16px'
  s.webkitMaskSize   = '16px 16px'
  s.maskRepeat       = 'repeat'
  s.webkitMaskRepeat = 'repeat'
  s.maskMode         = 'alpha'
  s.webkitMaskMode   = 'alpha'
}

function clearMask(el: HTMLElement) {
  const s = el.style as unknown as Record<string, string>
  s.maskImage = s.webkitMaskImage = ''
  s.maskSize  = s.webkitMaskSize  = ''
  s.maskRepeat = s.webkitMaskRepeat = ''
  s.maskMode  = s.webkitMaskMode  = ''
}


interface PreviewCodeProps {
  preview: React.ReactNode
  code: React.ReactNode
  minHeight?: number
  className?: string
  allowOverflow?: boolean
  /** Let preview content (glows, popovers) paint outside the box. */
  overflowVisible?: boolean
  /**
   * Drop the preview panel's padding so the demo gets the box's full width —
   * for components that measure their own container (carousels, marquees)
   * and should be shown edge to edge.
   */
  bleed?: boolean
}

// Standard preview-box height — matches the Theme Toggle showcase and gives the
// Code tab enough room to read. Every box is at least this tall; taller requests
// (calendar, date-picker) are honored.
const STANDARD_MIN_HEIGHT = 440

export function PreviewCode({ preview, code, minHeight = STANDARD_MIN_HEIGHT, className, allowOverflow, overflowVisible, bleed }: PreviewCodeProps) {
  const previewPad = bleed ? '' : 'p-4 sm:p-8'
  const h               = Math.max(minHeight, STANDARD_MIN_HEIGHT)
  const uid             = useId()
  const [tab, setTab]   = useState<Tab>('preview')
  const [busy, setBusy] = useState(false)
  const previewRef      = useRef<HTMLDivElement>(null)
  const codeRef         = useRef<HTMLDivElement>(null)
  const rafRef          = useRef<number | null>(null)

  const switchTo = useCallback((next: Tab) => {
    if (next === tab || busy) return
    if (allowOverflow) { setTab(next); return }
    setBusy(true)
    setTab(next)

    const masks    = getDitherMasks()
    const outPanel = next === 'code' ? previewRef.current : codeRef.current
    const inPanel  = next === 'code' ? codeRef.current   : previewRef.current
    if (!outPanel || !inPanel) { setBusy(false); return }

    // Outgoing panel sits on top and gets the dither mask applied
    outPanel.style.zIndex        = '2'
    outPanel.style.pointerEvents = 'none'
    inPanel.style.zIndex         = '1'
    inPanel.style.opacity        = '1'
    inPanel.style.pointerEvents  = 'none'

    setMaskProps(outPanel)
    setMask(outPanel, `url(${masks[0]})`) // prime step-0 before first rAF tick to avoid first-frame pop

    let t0 = -1 // initialized on the first actual frame so cold-start React delay doesn't skip early steps

    const tick = (now: number) => {
      if (t0 < 0) t0 = now
      const rawP = Math.min((now - t0) / TRANSITION_MS, 1)
      const step = Math.round(rawP * 64) // linear — Bayer matrix provides natural visual dispersion
      setMask(outPanel, `url(${masks[step]})`)

      if (rawP < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        outPanel.style.opacity        = '0'
        outPanel.style.zIndex         = '1'
        outPanel.style.pointerEvents  = 'none'
        clearMask(outPanel)
        inPanel.style.zIndex          = '2'
        inPanel.style.pointerEvents   = ''
        setBusy(false)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [tab, busy])

  useEffect(() => {
    // Pre-build all 65 mask data-URLs on mount so the first transition is as smooth as subsequent ones
    getDitherMasks()
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Tab toggle */}
      <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/60 p-[3px] gap-px w-fit rounded-2xl">
        {(['preview', 'code'] as const).map((t) => (
          <button
            key={t}
            onClick={() => switchTo(t)}
            disabled={busy}
            className={cn(
              'relative flex items-center gap-1.5 px-3 h-8 text-[14px] rounded-xl font-medium select-none cursor-pointer',
              'active:scale-[0.96] transition-transform duration-80 disabled:cursor-not-allowed',
            )}
          >
            {tab === t && (
              <motion.div
                layoutId={`previewcode-pill-${uid}`}
                className="absolute inset-0 rounded-[14px] bg-white dark:bg-zinc-700/40 shadow-sm dark:shadow-none"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
              />
            )}
            <span className={cn(
              'relative z-10 flex items-center gap-1.5 transition-colors duration-150',
              tab === t ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500',
            )}>
              <HugeiconsIcon
                icon={t === 'preview' ? ViewIcon : CodeIcon}
                size={13}
                strokeWidth={1.5}
                color="currentColor"
              />
              {t === 'preview' ? 'Preview' : 'Code'}
            </span>
          </button>
        ))}
      </div>

      {/* Content box — squircle Surface with a middle-border on both variants */}
      {allowOverflow ? (
        // Inline-growth variant: panels are normal flow (not absolute), so an
        // expanding select/dropdown grows the box height. overflow:clip still
        // masks the squircle corners — nothing overflows because the box tracks
        // its content. Tabs swap instantly (the dither cross-fade needs the
        // fixed-height absolute panels the standard variant uses).
        <Surface
          radius={24}
          lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border-subtle)' } }}
          className={overflowVisible ? 'overflow-visible' : '[overflow:clip]'}
        >
          <div
            className={cn(
              'flex items-center justify-center bg-zinc-50 dark:bg-zinc-950',
              previewPad,
              tab !== 'preview' && 'hidden',
            )}
            style={{ minHeight: h }}
          >
            {preview}
          </div>
          <div
            className={cn(
              'overflow-auto [scrollbar-width:thin] [scrollbar-color:theme(colors.zinc.300/50)_transparent] dark:[scrollbar-color:theme(colors.zinc.600/40)_transparent] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 bg-zinc-50 dark:bg-zinc-950',
              tab !== 'code' && 'hidden',
            )}
            style={{ minHeight: h }}
          >
            {code}
          </div>
        </Surface>
      ) : (
        <Surface
          radius={24}
          lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border-subtle)' } }}
          className="[overflow:clip] relative"
          style={{ minHeight: h }}
        >
          <div
            ref={previewRef}
            className={cn(
              'absolute inset-0 overflow-auto flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
              previewPad,
            )}
            style={{ zIndex: 2 }}
          >
            {preview}
          </div>

          <div
            ref={codeRef}
            className="absolute inset-0 overflow-auto [scrollbar-width:thin] [scrollbar-color:theme(colors.zinc.300/50)_transparent] dark:[scrollbar-color:theme(colors.zinc.600/40)_transparent] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700"
            style={{ zIndex: 1, opacity: 0, pointerEvents: 'none' }}
          >
            {code}
          </div>
        </Surface>
      )}
    </div>
  )
}
