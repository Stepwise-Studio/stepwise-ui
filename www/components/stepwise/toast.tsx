'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Verify, Warning2, CloseCircle, InfoCircle } from 'iconsax-react'

// ── types ──────────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'warning' | 'error' | 'info'

export interface ToastData {
  id          : string
  type        : ToastType
  title       : string
  description?: string
  action?     : { label: string; onClick: () => void }
  duration?   : number
  sound?      : boolean
}

// ── singleton store ────────────────────────────────────────────────────────────
let _toasts: ToastData[] = []
const _listeners = new Set<() => void>()
const _notify = () => _listeners.forEach(l => l())

export const toast = {
  show(data: Omit<ToastData, 'id'>) {
    const id = Math.random().toString(36).slice(2)
    _toasts = [..._toasts, { ...data, id }]
    _notify()
    return id
  },
  success(title: string, opts?: Partial<Omit<ToastData, 'id' | 'type' | 'title'>>) {
    return toast.show({ type: 'success', title, ...opts })
  },
  warning(title: string, opts?: Partial<Omit<ToastData, 'id' | 'type' | 'title'>>) {
    return toast.show({ type: 'warning', title, ...opts })
  },
  error(title: string, opts?: Partial<Omit<ToastData, 'id' | 'type' | 'title'>>) {
    return toast.show({ type: 'error', title, ...opts })
  },
  info(title: string, opts?: Partial<Omit<ToastData, 'id' | 'type' | 'title'>>) {
    return toast.show({ type: 'info', title, ...opts })
  },
  dismiss(id: string) {
    _toasts = _toasts.filter(t => t.id !== id)
    _notify()
  },
}

// ── per-type config ────────────────────────────────────────────────────────────
// Only the coloured tint differs per type; the base surface comes from a
// theme-flipping CSS var (--toast-bg) so the toast is dark-mode aware. A
// gradient border was tried here and cut — it broke the background outright
// once (invalid CSS shorthand) and still read as too strong even dialed back
// afterward. A plain neutral border is what actually looked right.
const typeConfig: Record<ToastType, { tint: string; icon: React.ReactNode }> = {
  success: { tint: 'rgba(74,222,128,0.22)',  icon: <Verify      variant="Bold" size={24} color="#22c55e" /> },
  warning: { tint: 'rgba(251,191,36,0.22)',  icon: <Warning2    variant="Bold" size={24} color="#f59e0b" /> },
  error:   { tint: 'rgba(248,113,113,0.22)', icon: <CloseCircle variant="Bold" size={24} color="#f43f5e" /> },
  info:    { tint: 'rgba(56,189,248,0.22)',  icon: <InfoCircle  variant="Bold" size={24} color="#0ea5e9" /> },
}

// ── sound ──────────────────────────────────────────────────────────────────────
// A toaster popping up: the mechanical spring "ka-chunk" (fast pitch-drop + a
// noise thunk) followed by the bright "ding" of the toast being ready.
let _sndCtx: AudioContext | null = null
function toasterCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!_sndCtx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    _sndCtx = new AC()
  }
  if (_sndCtx.state === 'suspended') _sndCtx.resume()
  return _sndCtx
}

function playToasterSound() {
  const c = toasterCtx()
  if (!c) return
  const t = c.currentTime

  // spring release — pitch drops fast, like the lever letting go
  const spring = c.createOscillator()
  spring.type = 'triangle'
  spring.frequency.setValueAtTime(520, t)
  spring.frequency.exponentialRampToValueAtTime(120, t + 0.11)
  const sg = c.createGain()
  sg.gain.setValueAtTime(0.16, t)
  sg.gain.exponentialRampToValueAtTime(0.001, t + 0.14)
  spring.connect(sg).connect(c.destination)
  spring.start(t); spring.stop(t + 0.15)

  // mechanical thunk (short filtered noise)
  const len = Math.floor(c.sampleRate * 0.05)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2)
  const noise = c.createBufferSource(); noise.buffer = buf
  const nf = c.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 900
  const ng = c.createGain(); ng.gain.value = 0.22
  noise.connect(nf).connect(ng).connect(c.destination)
  noise.start(t)

  // the "ding" — two bell partials, a beat after the pop
  const bt = t + 0.07
  ;[1760, 2640].forEach((f, i) => {
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, bt)
    g.gain.exponentialRampToValueAtTime(i ? 0.05 : 0.12, bt + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, bt + 0.7)
    o.connect(g).connect(c.destination)
    o.start(bt); o.stop(bt + 0.75)
  })
}

// ── stack tuning ─────────────────────────────────────────────────────────────
const MAX_VISIBLE = 3     // toasts kept visible in the collapsed deck
const PEEK        = 15    // px each stacked toast peeks above the one in front
const SCALE_STEP  = 0.05  // per-level shrink for the collapsed deck
const GAP         = 12    // px between toasts when the deck is expanded (hovered)
const SPRING      = { type: 'spring' as const, stiffness: 320, damping: 34 }

// ── toast item ────────────────────────────────────────────────────────────────
function ToastItem({
  data, index, y, scale, opacity, zIndex, paused, onHeight, onDismiss,
}: {
  data: ToastData
  index: number
  y: number
  scale: number
  opacity: number
  zIndex: number
  paused: boolean
  onHeight: (id: string, h: number) => void
  onDismiss: () => void
}) {
  const c = typeConfig[data.type]
  const reduce = useReducedMotion()
  const cardRef   = useRef<HTMLDivElement>(null)
  const dismissRef = useRef(onDismiss)
  dismissRef.current = onDismiss

  // Play the pop once, on mount only.
  useEffect(() => { if (data.sound) playToasterSound() }, [])

  // Measure card height so the expanded layout can space toasts exactly.
  useEffect(() => {
    if (cardRef.current) onHeight(data.id, cardRef.current.offsetHeight)
  }, [data.id, onHeight])

  // Auto-dismiss — paused while the deck is hovered/expanded, and never for
  // toasts carrying an action (the user needs time to read and act on it).
  useEffect(() => {
    if (paused || data.action) return
    const id = setTimeout(() => dismissRef.current(), data.duration ?? 5000)
    return () => clearTimeout(id)
  }, [paused, data.duration, data.action])

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 44, scale: reduce ? 1 : 0.9 }}
      animate={{ opacity, y: reduce ? 0 : y, scale: reduce ? 1 : scale }}
      exit={{    opacity: 0, y: reduce ? 0 : 44, scale: reduce ? 1 : 0.9 }}
      transition={reduce ? { duration: 0.15 } : { y: SPRING, scale: SPRING, opacity: { duration: 0.2 } }}
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex, transformOrigin: 'bottom center' }}
      className="w-full pointer-events-auto"
    >
      <div
        ref={cardRef}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className="flex items-center justify-between gap-3 p-4 rounded-[20px] overflow-hidden border border-zinc-200/70 dark:border-zinc-700/60 [--toast-bg:#f4f4f5] dark:[--toast-bg:#1c1c1f]"
        style={{
          // 135deg = top-left → bottom-right, so the tint reads as bleeding
          // in from the corner rather than sweeping across from the side.
          background: `linear-gradient(135deg, ${c.tint} 4%, transparent 30%), var(--toast-bg)`,
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
        }}
      >
        {/* Left: icon + text */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="shrink-0">{c.icon}</span>
          <div className="flex flex-col min-w-0 gap-1.5">
            <p className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-100 truncate leading-none tracking-[-0.36px]">
              {data.title}
            </p>
            {data.description && (
              <p className="text-[14px] font-normal text-zinc-500 dark:text-zinc-400 leading-none tracking-[-0.36px] truncate">
                {data.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: action or dismiss */}
        {data.action ? (
          <button
            onClick={() => { data.action!.onClick(); onDismiss() }}
            className="shrink-0 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-100 font-medium rounded-full transition-[background-color,transform] duration-150 active:scale-[0.96] whitespace-nowrap"
            style={{ fontSize: 12, letterSpacing: '-0.3px', lineHeight: 1, padding: '9px 14px' }}
          >
            {data.action.label}
          </button>
        ) : (
          <button
            onClick={onDismiss}
            className="shrink-0 cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors duration-150 p-0.5"
            aria-label="Dismiss"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ── Toaster ───────────────────────────────────────────────────────────────────
export interface ToasterProps {
  /**
   * Portal target. Defaults to `document.body`. Point it at an element that
   * establishes a containing block to dock the stack inside that box instead
   * of the viewport.
   */
  container?: HTMLElement | null
}

export function Toaster({ container }: ToasterProps = {}) {
  const [items,   setItems]   = useState<ToastData[]>([])
  const [mounted, setMounted] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [heights, setHeights] = useState<Record<string, number>>({})

  useEffect(() => {
    setMounted(true)
    const update = () => setItems([..._toasts])
    _listeners.add(update)
    return () => { _listeners.delete(update) }
  }, [])

  const onHeight = (id: string, h: number) =>
    setHeights(prev => (prev[id] === h ? prev : { ...prev, [id]: h }))

  if (!mounted) return null

  // Newest first → front of the deck (index 0, sits at the bottom).
  const ordered = [...items].reverse()
  const count   = ordered.length
  const h = (id: string) => heights[id] ?? 76

  // Position for toast at deck index i (0 = front).
  const yFor = (i: number) => {
    if (expanded) {
      let acc = 0
      for (let j = 0; j < i; j++) acc += h(ordered[j].id) + GAP
      return -acc
    }
    return -Math.min(i, MAX_VISIBLE) * PEEK
  }
  const scaleFor   = (i: number) => (expanded ? 1 : Math.max(1 - i * SCALE_STEP, 0.8))
  const opacityFor = (i: number) => (expanded || i < MAX_VISIBLE ? 1 : 0)

  // Height of the hover target so the whole deck (collapsed or expanded) is hoverable.
  const frontH   = count ? h(ordered[0].id) : 0
  const stackH   = expanded
    ? ordered.reduce((s, it) => s + h(it.id), 0) + Math.max(count - 1, 0) * GAP
    : frontH + Math.min(count - 1, MAX_VISIBLE - 1) * PEEK

  return createPortal(
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
      <div
        className="relative w-[min(460px,calc(100vw-32px))] pointer-events-auto"
        style={{ height: stackH, transition: 'height 250ms cubic-bezier(0.22,1,0.36,1)' }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setExpanded(false) }}
      >
        <AnimatePresence initial={false}>
          {ordered.map((item, i) => (
            <ToastItem
              key={item.id}
              data={item}
              index={i}
              y={yFor(i)}
              scale={scaleFor(i)}
              opacity={opacityFor(i)}
              zIndex={count - i}
              paused={expanded}
              onHeight={onHeight}
              onDismiss={() => toast.dismiss(item.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>,
    container ?? document.body,
  )
}
