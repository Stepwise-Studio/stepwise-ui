'use client'

import { useRef, useState, useEffect, useCallback, useMemo, DragEvent, ChangeEvent, ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { SmoothCorners } from '@lisse/react'
import { Tooltip } from '@/components/stepwise/tooltip'
import { cn } from '@/lib/utils/cn'

export interface FolderFile {
  /** Optional image thumbnail URL — shown as a photo peeking out. */
  thumb?: string
  /** 0–100 upload progress for this item. */
  progress?: number
  /** File name — shown in a tooltip on hover so people know what they named it. */
  name?: string
}

export interface FolderProps {
  /** Title under the folder. */
  label?: string
  /** Count / subtitle line. Falls back to "{n} items". */
  count?: string
  /** Folder body colour. Any CSS color. Default a soft neutral. */
  color?: string
  /** A Hugeicons icon shown on the front pocket. */
  icon?: IconSvgElement
  /** Frosted-glass blur on the front pocket, px. Default 6. */
  blur?: number
  /** Folder width in px. Height derives from it. Default 260. */
  size?: number
  /** The items peeking out — { thumb } for photos, otherwise a unified skeleton card. */
  files?: FolderFile[]
  /** How many skeleton cards to show when no files are given. Default 3. */
  peek?: number
  /** Force-open — fans the cards out. Omit to let hover / drag drive it. */
  open?: boolean
  /** Overall upload progress 0–100 — drives the bar across the pocket. */
  progress?: number
  /** Extra decoration on the pocket (emoji, etc.) — sits under the icon. */
  stickers?: ReactNode
  /** Show the title. Default true. */
  showLabel?: boolean
  /** Show the count line. Default true. */
  showCount?: boolean
  /** Enable drag-and-drop + click-to-browse. */
  interactive?: boolean
  /** Let a tap toggle the fan — the touch/keyboard path to a hover-only reveal.
   *  Turn it off when an ancestor already owns the click (see File Uploader's
   *  `folder` variant), so the two don't fight over the same tap. Defaults to
   *  on whenever the folder isn't `interactive`. */
  toggleOnClick?: boolean
  /** Join the tab order and reveal the fan on focus, without also making a
   *  tap toggle it (that's `toggleOnClick`) or giving the folder its own file
   *  input (that's `interactive`). Only needed when `toggleOnClick` is `false`
   *  — with it left on, tapping already puts the folder in the tab order, so
   *  this is off by default and only exists for the ancestor-owns-the-click
   *  case, where the hover-only reveal would otherwise be entirely
   *  unreachable by keyboard. */
  focusable?: boolean
  accept?: string
  multiple?: boolean
  onFiles?: (files: File[]) => void
  /** Shows a small remove button on each fanned-out card, reporting the
   *  file's index within `files`. Only appears while the fan is open. */
  onRemoveFile?: (index: number) => void
  className?: string
}

/** Surface open/close — one spring for every part of the folder so the tilt,
 *  the lift and the ground shadow all settle on the same beat. */
const SPRING = { type: 'spring', stiffness: 260, damping: 24 } as const
/** Cards travel further than the pocket tilts, so they get a slightly softer,
 *  heavier spring — snappy enough to feel direct, damped enough not to wobble. */
const CARD_SPRING = { type: 'spring', stiffness: 230, damping: 26, mass: 0.9 } as const

/** How many cards the fan shows at once before paging kicks in. */
const FAN_MAX = 5

type Vertex = { x: number; y: number; r: number }

/**
 * One continuous rounded path through `pts`, closed.
 *
 * The back panel used to be two overlapping elements — a `clip-path`'d tab on
 * top of a `SmoothCorners` body. That is what produced the notch on the left
 * edge: the body's top-left corner starts curving inward ~`r * 1.6` from the
 * edge, but the tab's straight left edge stopped dead at `y = tabH`, so the
 * two silhouettes simply did not meet. No clip-path can fix that, because the
 * fillet has to straddle a boundary between two separate boxes — and for the
 * same reason the tab's slant corners could never be rounded either.
 *
 * Drawing the whole silhouette as a single path removes the seam by
 * construction and lets every corner, slant included, carry a real fillet.
 *
 * `smoothing` follows the squircle convention used everywhere else in the
 * library (0 = a plain circular fillet, 0.6 = the project default): the
 * tangent points slide further out along each edge while the control points
 * stay at their circular distance from the corner, so curvature ramps in
 * gradually instead of jumping from straight to full-radius arc. Convex and
 * concave corners are handled by the same math — the curve just bends the
 * other way — which is what lets the slant's inner corner round off too.
 */
function roundedPolygon(pts: Vertex[], smoothing = 0.6) {
  const n = pts.length
  const unit = (x: number, y: number) => {
    const l = Math.hypot(x, y) || 1
    return { x: x / l, y: y / l }
  }

  const cs = pts.map((p, i) => {
    const prev = pts[(i - 1 + n) % n]
    const next = pts[(i + 1) % n]
    const inV = unit(p.x - prev.x, p.y - prev.y)
    const outV = unit(next.x - p.x, next.y - p.y)
    const phi = Math.acos(Math.max(-1, Math.min(1, inV.x * outV.x + inV.y * outV.y)))
    const flat = phi < 1e-4
    // tangent distance for a fillet of radius r across a turn of `phi`
    const t = flat ? 0 : p.r * Math.tan(phi / 2)
    // control-point distance from the corner: the exact circular-fillet value,
    // held fixed while `smoothing` pushes the tangent points outward
    const dC = flat ? 0 : t * (1 - (4 / 3) * Math.tan(phi / 4) / Math.tan(phi / 2))
    return { p, inV, outV, t, dC, T: t * (1 + smoothing) }
  })

  // two fillets sharing an edge must never overrun it
  for (let i = 0; i < n; i++) {
    const a = cs[i]
    const b = cs[(i + 1) % n]
    const edge = Math.hypot(b.p.x - a.p.x, b.p.y - a.p.y)
    const need = a.T + b.T
    if (need > edge && need > 0) {
      const k = edge / need
      a.T *= k; a.dC *= k
      b.T *= k; b.dC *= k
    }
  }

  const d: string[] = []
  cs.forEach((c, i) => {
    const ax = c.p.x - c.inV.x * c.T,   ay = c.p.y - c.inV.y * c.T
    const bx = c.p.x + c.outV.x * c.T,  by = c.p.y + c.outV.y * c.T
    const c1x = c.p.x - c.inV.x * c.dC,  c1y = c.p.y - c.inV.y * c.dC
    const c2x = c.p.x + c.outV.x * c.dC, c2y = c.p.y + c.outV.y * c.dC
    d.push(`${i === 0 ? 'M' : 'L'} ${ax.toFixed(2)} ${ay.toFixed(2)}`)
    d.push(`C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${bx.toFixed(2)} ${by.toFixed(2)}`)
  })
  return `${d.join(' ')} Z`
}

/* one unified minimal "document" card — thumbnail + title + body lines.
 * Exported so anything showing a "pretend file" (e.g. a drag-and-drop demo)
 * uses the exact same placeholder language as the folder's own peeking
 * cards, instead of inventing a second one. */
export function SkeletonCard() {
  const line = 'var(--folder-card-line)'
  return (
    <div className="relative flex h-full w-full flex-col gap-[9%] p-[13%]" style={{ background: 'var(--folder-card)' }}>
      <div className="flex items-start gap-[8%]">
        <div className="shrink-0 rounded-[5px]" style={{ width: '26%', aspectRatio: '1', background: 'var(--folder-card-accent)' }} />
        <div className="flex flex-1 flex-col gap-[10px] pt-[4%]">
          <span className="h-[4px] rounded-full" style={{ width: '86%', background: 'var(--folder-card-line-strong)' }} />
          <span className="h-[3px] rounded-full" style={{ width: '58%', background: line }} />
        </div>
      </div>
      <div className="flex flex-col gap-[7px]">
        {[100, 90, 74].map(wpc => (
          <span key={wpc} className="h-[3px] rounded-full" style={{ width: `${wpc}%`, background: line }} />
        ))}
      </div>
    </div>
  )
}

function FanNav({
  dir, onClick, onEngage, style,
}: { dir: 'prev' | 'next'; onClick: () => void; onEngage: () => void; style: React.CSSProperties }) {
  return (
    <motion.button
      type="button"
      aria-label={dir === 'prev' ? 'Previous files' : 'Next files'}
      // the fan lives inside the folder's own click target (browse files) —
      // paging must not also open the file picker
      onClick={e => {
        e.stopPropagation()
        onClick()
        // A mouse click leaves the button focused, and the folder's own
        // onFocus/onBlur wiring (there so a keyboard user tabbing to this
        // exact button keeps the fan open) then keeps the fan pinned open
        // forever afterward — hovering out no longer closes it, only
        // clicking elsewhere does, because focus never left the subtree.
        // `detail` is 0 only for a keyboard-triggered click (Enter/Space via
        // the browser's own activation, not a real pointer event), so a real
        // mouse click blurs itself right back out and keyboard users are
        // untouched.
        if (e.detail !== 0) e.currentTarget.blur()
      }}
      // The nav buttons sit right at the edge of the 40px hover-catch
      // buffer, and a real cursor doesn't travel in a perfectly straight
      // line to reach one — a slightly wide approach can graze just
      // outside that buffer for a frame, firing onMouseLeave a beat
      // before the click lands. That collapses the fan mid-click, so the
      // click either misses (button already gone) or lands on a card
      // that's mid-exit-animation from the collapse, which is what read
      // as "a card stuck sitting in the folder". `onEngage` re-asserts
      // hover the instant a press starts on either button — before that
      // race has any window to run — independent of whether the physical
      // cursor position still reads as "inside" the buffer.
      onPointerDown={e => { e.stopPropagation(); onEngage() }}
      className={cn(
        'absolute flex h-7 w-7 items-center justify-center rounded-full',
        'bg-white/90 text-zinc-600 shadow-[0_2px_8px_rgba(0,0,0,0.14)] backdrop-blur',
        'dark:bg-zinc-800/90 dark:text-zinc-300',
        'transition-colors duration-150',
        'hover:bg-white dark:hover:bg-zinc-700',
      )}
      style={style}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <HugeiconsIcon icon={dir === 'prev' ? ArrowLeft01Icon : ArrowRight01Icon} size={15} strokeWidth={2} color="currentColor" />
    </motion.button>
  )
}

export function Folder({
  label,
  count,
  color,
  icon,
  blur = 6,
  size = 260,
  files,
  peek = 3,
  open: openProp,
  progress,
  stickers,
  showLabel = true,
  showCount = true,
  interactive = false,
  toggleOnClick,
  focusable = false,
  accept,
  multiple = true,
  onFiles,
  onRemoveFile,
  className,
}: FolderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focusedIn, setFocusedIn] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [fanStart, setFanStart] = useState(0)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current) }, [])
  const engage = () => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null }
    setHovered(true)
  }
  // Guards against paging faster than a card's own exit animation (~0.16s):
  // firing a second page() while the previous one's outgoing card is still
  // mid-exit re-adds that same rawKey to AnimatePresence while it's still
  // classified as exiting, which can leave it stuck at its exit's mid-fade
  // values instead of restarting a proper enter — it reads as a card frozen
  // half-faded "sitting in the folder" instead of sliding back into place.
  const lastPageAtRef = useRef(0)
  const page = (dir: 1 | -1) => {
    const now = performance.now()
    if (now - lastPageAtRef.current < 180) return
    lastPageAtRef.current = now
    setFanStart(s => s + dir)
  }
  const reduce = useReducedMotion()

  const items: FolderFile[] = files?.length ? files : Array.from({ length: peek }, () => ({}))
  // A hover-only reveal is unreachable on touch (no hover at all) and by
  // keyboard, so the fan also answers to focus, and to a tap when the folder
  // isn't already spending its click on opening the file picker.
  const tappable = (toggleOnClick ?? !interactive) && items.length > 0 && openProp === undefined
  const open = openProp ?? (dragging || hovered || focusedIn || pinned)
  const fanned = open && items.length > 0

  const w = size
  const h = w * 0.82
  const pocketH = h * 0.6
  const tabW = w * 0.42
  const tabH = h * 0.13
  const r = w * 0.08
  const tabCut = tabH * 1.1

  // Clockwise from the tab's top-left. There is deliberately no vertex where
  // the tab meets the body on the left: that edge is one straight run from
  // (0, 0) to (0, h), which is precisely what removes the old notch.
  const backPath = useMemo(() => roundedPolygon([
    { x: 0,             y: 0,    r: r * 0.55 },  // tab top-left
    { x: tabW - tabCut, y: 0,    r: r * 0.9  },  // slant starts (convex)
    { x: tabW,          y: tabH, r: r * 1.2  },  // slant meets the body top (concave)
    { x: w,             y: tabH, r },            // body top-right
    { x: w,             y: h,    r },            // body bottom-right
    { x: 0,             y: h,    r },            // body bottom-left
  ]), [w, h, tabW, tabH, tabCut, r])

  const body = color ?? 'var(--folder-body)'

  /* ── fan geometry ────────────────────────────────────────────────────── */
  const cardW = w * 0.56
  const cardH = h * 0.56
  // resting height of the peeking cards — sitting a little lower than they
  // used to, so their tops read as tucked into the folder rather than
  // floating above the back panel
  const topBase = h * 0.2
  const fanLift = -h * 0.46
  const fanArc = h * 0.09
  const fanScale = 0.94

  // The fan reaches well past the folder's own box, so it has to answer to the
  // room it actually has rather than to `size` alone: tighten the gap first,
  // and only drop a card once the cards would start burying each other. The
  // "room it actually has" is the nearest ancestor that would actually clip
  // or scroll the overflow — not just the immediate parent, which is
  // routinely a shrink-to-fit flex column (sized to the folder itself, or to
  // a caption below it) and would report a width no wider than the folder.
  const [avail, setAvail] = useState<number | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let el = wrapRef.current?.parentElement ?? null
    while (el && el !== document.body) {
      const cs = getComputedStyle(el)
      if (/(auto|hidden|scroll|clip)/.test(cs.overflowX)) break
      el = el.parentElement
    }
    const host = el ?? document.documentElement
    if (typeof ResizeObserver === 'undefined') return
    const read = () => setAvail(host.clientWidth)
    read()
    const ro = new ResizeObserver(read)
    ro.observe(host)
    return () => ro.disconnect()
  }, [])

  const halfCard = (cardW * fanScale) / 2
  const NAV_ROOM = 42
  const availHalf = avail ? Math.max(halfCard, avail / 2 - NAV_ROOM) : Infinity
  const gapThatFits = (count: number) => count <= 1 ? Infinity : (availHalf - halfCard) / ((count - 1) / 2)

  const idealGap = w * 0.24
  const minGap = w * 0.14
  const floorCount = Math.min(3, items.length)
  let fanCount = Math.min(FAN_MAX, items.length)
  while (fanCount > floorCount && gapThatFits(fanCount) < minGap) fanCount--
  const fanGap = Math.max(0, Math.min(idealGap, gapThatFits(fanCount)))

  // Circular window: paging never runs out — index n-1 → 0 → 1 → ... — so
  // there's always something to browse to on either side, and the arrows
  // never need a disabled state.
  //
  // Slot *identity* (the React key, which drives mount/unmount and thus the
  // enter/exit animation) and slot *content* (which file's data renders
  // there) are deliberately different numbers. Keying by the wrapped file
  // index broke exactly when every file already fit in the fan (items ≤
  // fanCount): a full rotation reassigns each index to a slot one turn away,
  // but the two indices at the seam jump the *entire width of the fan* in
  // one spring — and because z-index can't animate smoothly, the card
  // visually ducked behind its neighbors mid-flight instead of just sliding
  // over. Keying by the raw, unbounded `fanStart + i` instead means every
  // page action shifts existing keys by exactly one slot and only ever
  // mounts/unmounts the one key at the seam — identical to the many-files
  // case, where that new key genuinely is a new file. Here it's the same
  // file reappearing, but the animation doesn't need to know that.
  const n = items.length
  const slots = Array.from({ length: fanCount }, (_, i) => {
    const rawKey = fanStart + i
    const idx = n > 0 ? ((rawKey % n) + n) % n : 0
    return { rawKey, idx, file: items[idx] }
  })
  const windowed = slots.map(s => s.file)

  // Cards ripple in at 40ms apart the first time a batch appears. Only a real
  // batch staggers: paging brings in a single card, and making that one wait
  // its index out would read as lag rather than rhythm. Read during render,
  // committed after paint.
  const seen = useRef<Set<number>>(new Set())
  const newKeys = slots.map(s => s.rawKey).filter(k => !seen.current.has(k))
  const batchEntry = newKeys.length > 1
  const entryDelay = (key: number) => batchEntry ? newKeys.indexOf(key) * 0.04 : null
  useEffect(() => {
    slots.forEach(s => seen.current.add(s.rawKey))
  })

  // Arrows show whenever there's something else to bring into view — even a
  // folder with just 2 files benefits from a way to swap which one is front
  // and center.
  const canPage = n > 1
  const mid = (windowed.length - 1) / 2
  const halfSpan = mid * fanGap + halfCard

  const cardAt = (i: number) => {
    if (!fanned) {
      // Tucked: a tight stack, front-and-center card straight, anything
      // behind it peeking out tilted to either side. The stack has to
      // adapt to how many cards are actually showing right now — a fixed
      // 3-slot array indexed by position (as this used to be) put a single
      // lone card in the "back-left" slot (tilted -5°) instead of front-
      // center, since index 0 was always the back-left card in the
      // 3-card layout. The front slot is always the LAST index, not a
      // fixed position, so 1 card is straight, 2 cards are straight + one
      // tilted behind, and 3+ reproduces the original stack exactly.
      const front = windowed.length - 1
      if (i === front) return { x: 0, y: 0, rot: 0, z: 3, op: 1 }
      const left = i % 2 === 0
      return { x: left ? -w * 0.1 : w * 0.11, y: 0, rot: left ? -5 : 5, z: i + 1, op: 1 }
    }
    const off = i - mid
    const t = mid === 0 ? 0 : off / mid
    return {
      x: off * fanGap,
      // parabolic rise — the middle card sits highest, the outer ones ease down
      y: fanLift - (1 - t * t) * fanArc,
      rot: off * 8,
      z: 10 - Math.abs(off),
      op: 1,
    }
  }

  const handleFiles = useCallback((raw: FileList | null) => {
    if (!raw?.length) return
    onFiles?.(Array.from(raw))
  }, [onFiles])

  const dropHandlers = interactive ? {
    onDrop: (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) },
    onDragOver: (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(true) },
    onDragLeave: (e: DragEvent<HTMLDivElement>) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false) },
    onClick: () => inputRef.current?.click(),
  } : {}

  const uploading = progress !== undefined && progress < 100
  const metaText = count ?? (dragging ? 'Drop to add' : files?.length ? `${files.length} item${files.length > 1 ? 's' : ''}` : interactive ? 'Drop files or click' : undefined)

  // Tint the peeking skeleton cards to match `color` instead of leaving them
  // on the fixed light/dark tokens — same OKLCH-relative approach as the
  // pocket/icon, applied as custom-property overrides so SkeletonCard
  // doesn't need to know about `color` at all.
  const cardVars = color ? {
    '--folder-card': `oklch(from ${color} 0.97 calc(c * 0.3) h)`,
    '--folder-card-accent': `oklch(from ${color} 0.88 calc(c * 0.6) h)`,
  } as React.CSSProperties : undefined

  return (
    <div ref={wrapRef} className={cn('inline-flex flex-col items-center gap-4', className)} style={cardVars}>
      <div
        {...dropHandlers}
        onMouseEnter={engage}
        // A short grace period, not an immediate close — the nav buttons
        // sit right at the edge of the hover-catch buffer, and a real
        // cursor doesn't travel in a perfectly straight line to reach one.
        // A momentary graze just outside that buffer used to close the fan
        // mid-click, so the click either missed (button already gone) or
        // landed on a card mid-exit from the collapse — read as "a card
        // stuck sitting in the folder". Any genuine re-entry (including
        // the nav buttons' own onEngage) cancels this before it fires.
        onMouseLeave={() => {
          closeTimerRef.current = setTimeout(() => setHovered(false), 220)
        }}
        // focus anywhere inside (the folder itself or a paging arrow) keeps
        // the fan open; leaving the subtree entirely closes it
        onFocus={() => setFocusedIn(true)}
        onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusedIn(false) }}
        {...(tappable && {
          onClick: () => setPinned(p => !p),
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPinned(p => !p) }
          },
        })}
        tabIndex={interactive || tappable || focusable ? 0 : undefined}
        className={cn(
          'relative select-none rounded-[30px] outline-none',
          (interactive || tappable) && 'cursor-pointer',
          (interactive || tappable || focusable) && 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-500',
        )}
        style={{ width: w, height: h, perspective: 900 }}
        role={interactive || tappable ? 'button' : undefined}
        aria-label={interactive ? 'Upload files' : tappable ? (label ? `${label} — show files` : 'Show files') : focusable ? (label ? `${label} — files` : 'Files') : undefined}
        aria-expanded={(tappable || focusable) ? fanned : undefined}
      >
        {interactive && (
          <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="sr-only"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)} />
        )}

        {/* The fan reaches well outside the folder's own box. This invisible
            extension is a DOM child, so the pointer staying anywhere over the
            fanned cards (or the gaps between them) still counts as hovering
            the folder and the fan doesn't flicker shut. It sits BELOW the
            cards (zIndex 2) — above it, a card's own hover (and its name
            tooltip) would never be reachable, since this div would catch
            every pointer event over the whole fan region first. */}
        {fanned && (
          <div
            aria-hidden
            className="absolute"
            style={{
              left: -(halfSpan - w / 2) - 40, right: -(halfSpan - w / 2) - 40,
              top: topBase + fanLift - fanArc - 20, height: -fanLift + fanArc + cardH,
              zIndex: 1,
            }}
          />
        )}

        {/* ground shadow */}
        <motion.div aria-hidden className="absolute left-1/2 rounded-[50%] bg-black/25 blur-xl dark:bg-black/60"
          style={{ bottom: -h * 0.05, width: w * 0.82, height: h * 0.13, zIndex: 0 }}
          animate={{ x: '-50%', scale: reduce ? 1 : (open ? 1.1 : 1), opacity: open ? 0.9 : 0.6 }}
          transition={reduce ? { duration: 0.15 } : SPRING} />

        {/* back panel + tab — one continuous silhouette, no seam to notch */}
        <svg
          width={w} height={h} viewBox={`0 0 ${w} ${h}`}
          className="absolute inset-0"
          style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.09))', zIndex: 1 }}
          aria-hidden
        >
          <path d={backPath} style={{ fill: body }} />
        </svg>

        {/* the cards — below the pocket at rest, lifted clear of it when fanned */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <AnimatePresence initial={false}>
            {slots.map(({ rawKey, idx, file: f }, i) => {
              const c = cardAt(i)
              const off = i - mid
              const cardUploading = f.progress !== undefined && f.progress < 100
              const cardEl = (
                <div className="relative h-full w-full">
                  {f.thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <SkeletonCard />
                  )}
                  {/* per-file progress — same bar language as the pocket's
                      overall one, just small enough to sit on a peeking card */}
                  {cardUploading && (
                    <div className="absolute inset-x-[10%] bottom-[8%] h-[2.5px] overflow-hidden rounded-full bg-black/15 dark:bg-white/15">
                      <motion.span className="block h-full rounded-full bg-zinc-800 dark:bg-white"
                        initial={{ width: 0 }} animate={{ width: `${f.progress}%` }}
                        transition={{ ease: 'linear', duration: reduce ? 0 : 0.3 }} />
                    </div>
                  )}
                  {/* remove — only once the fan is open (a tucked stack has no
                      room to show it, and it'd be too easy to hit by accident).
                      Inset rather than overhung off the corner: the card's own
                      overflow-hidden (needed to clip the thumb/skeleton to its
                      rounded corners) would clip a badge hanging outside it. */}
                  {fanned && onRemoveFile && (
                    <button
                      type="button"
                      aria-label={`Remove ${f.name ?? 'file'}`}
                      onClick={e => {
                        e.stopPropagation()
                        onRemoveFile(idx)
                        if (e.detail !== 0) e.currentTarget.blur()
                      }}
                      onPointerDown={e => e.stopPropagation()}
                      // Visible badge stays a small 20px circle so it doesn't
                      // overwhelm a ~76px card — the actual hit target is
                      // widened to the 24px WCAG minimum with an invisible
                      // ::after rather than growing the badge itself.
                      className="absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-black/65 after:absolute after:-inset-0.5 after:content-['']"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={11} strokeWidth={2.2} color="currentColor" />
                    </button>
                  )}
                </div>
              )
              // Dragging any fanned card left/right pages the whole fan,
              // same as the chevrons — same `page()` (and its debounce), so
              // a fast flick can't hit the same exit/re-enter race the
              // chevrons could. No `dragConstraints`: the card is free to
              // follow the pointer, and once released, `animate.x` (still
              // targeting `c.x`) pulls it straight back with the same
              // spring — there's no separate "snap back" to write.
              const dragProps = (!reduce && fanned && canPage) ? {
                drag: 'x' as const,
                dragMomentum: false,
                dragElastic: 0.35,
                whileDrag: { cursor: 'grabbing' },
                onDragEnd: (e: PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
                  e.stopPropagation()
                  const { offset, velocity } = info
                  if (offset.x < -36 || velocity.x < -350) page(1)
                  else if (offset.x > 36 || velocity.x > 350) page(-1)
                },
              } : {}
              return (
                <motion.div
                  key={rawKey}
                  className="absolute left-1/2 top-0 overflow-hidden"
                  style={{
                    width: cardW, height: cardH,
                    marginLeft: -cardW / 2,
                    borderRadius: w * 0.05,
                    zIndex: c.z,
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04), 0 5px 16px -6px rgba(0,0,0,0.28)',
                    cursor: fanned && canPage ? 'grab' : undefined,
                  }}
                  initial={reduce
                    ? { opacity: 0, x: c.x, y: topBase + c.y, rotate: c.rot, scale: 1 }
                    : { opacity: 0, x: c.x, y: topBase + c.y + h * 0.14, rotate: c.rot, scale: 0.86 }}
                  animate={{
                    opacity: c.op,
                    x: c.x,
                    y: topBase + c.y,
                    rotate: c.rot,
                    scale: fanned ? fanScale : 1,
                  }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.88, transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] } }}
                  transition={reduce ? { duration: 0 } : {
                    ...CARD_SPRING,
                    // a fresh batch ripples in per-item; opening spreads
                    // outward from the middle; a close never waits —
                    // dismissal has to feel immediate
                    delay: entryDelay(rawKey) ?? (fanned ? Math.abs(off) * 0.03 : 0),
                  }}
                  {...dragProps}
                >
                  {fanned && f.name ? (
                    <Tooltip content={f.name} side="top">
                      <div className="h-full w-full">{cardEl}</div>
                    </Tooltip>
                  ) : cardEl}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* paging — always available once there's more than one file to
            browse; the window wraps, so the arrows never disable */}
        <AnimatePresence>
          {fanned && canPage && (
            <div className="absolute inset-0" style={{ zIndex: 12 }} key="nav">
              <FanNav
                dir="prev"
                onClick={() => page(-1)}
                onEngage={engage}
                style={{ left: w / 2 - halfSpan - 34, top: topBase + fanLift + cardH / 2 - 14 }}
              />
              <FanNav
                dir="next"
                onClick={() => page(1)}
                onEngage={engage}
                style={{ left: w / 2 + halfSpan + 6, top: topBase + fanLift + cardH / 2 - 14 }}
              />
            </div>
          )}
        </AnimatePresence>

        {/* front pocket — frosted glass, tilts open, sits ABOVE the files */}
        <motion.div
          className="absolute inset-x-0 bottom-0 origin-bottom"
          style={{ height: pocketH, transformStyle: 'preserve-3d', zIndex: 5 }}
          initial={false}
          animate={{ rotateX: open ? -34 : 0 }}
          transition={reduce ? { duration: 0 } : SPRING}
        >
          <SmoothCorners
            corners={{ radius: r, smoothing: 0.6 }}
            className="relative overflow-hidden"
            style={{
              width: w, height: pocketH,
              // Relative OKLCH lightness (not a color-mix toward white) so
              // the bump is perceptually consistent for every base color —
              // mixing a fixed % of white lightens a near-black color far
              // more than a near-white one, which is why only dark colors
              // used to end up looking translucent/mismatched against their
              // own folder body.
              background: color ? `oklch(from ${color} calc(l + 0.08) c h / 0.92)` : 'var(--folder-pocket)',
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.55), 0 -2px 10px rgba(0,0,0,0.05)',
            }}
          >
            {(icon || stickers) && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                // Same relative-lightness reasoning as the pocket background
                // — darkening by a fixed OKLCH amount instead of mixing a
                // fixed % of black, so an already-dark color doesn't get
                // crushed toward unreadable near-black.
                style={{ color: color ? `oklch(from ${color} calc(l - 0.22) c h)` : 'var(--folder-icon)' }}
              >
                {icon && <HugeiconsIcon icon={icon} size={Math.round(w * 0.15)} color="currentColor" strokeWidth={1.8} />}
                {stickers && <div className="flex items-center gap-3">{stickers}</div>}
              </div>
            )}

            {uploading && (
              <div className="absolute inset-x-4 bottom-3 h-[3px] overflow-hidden rounded-full bg-black/12 dark:bg-white/12">
                <motion.span className="block h-full rounded-full bg-zinc-800 dark:bg-white"
                  initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ ease: 'linear', duration: 0.3 }} />
              </div>
            )}
          </SmoothCorners>
        </motion.div>

        {interactive && (
          <motion.div aria-hidden className="pointer-events-none absolute -inset-2 rounded-[30px] border-2 border-dashed border-zinc-400 dark:border-zinc-500"
            style={{ zIndex: 6 }}
            initial={false} animate={{ opacity: dragging ? 1 : 0, scale: dragging ? 1 : 0.98 }} transition={{ duration: 0.15 }} />
        )}
      </div>

      {((showLabel && label) || (showCount && metaText)) && (
        <div className="flex flex-col items-center gap-1.5 text-center">
          {showLabel && label && (
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-800 dark:text-zinc-100">{label}</span>
          )}
          {showCount && metaText && (
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[12px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              {metaText}
            </span>
          )}
        </div>
      )}

      <style>{`
        :root {
          --folder-body: #dfe1e7;
          --folder-pocket: rgba(232,234,239,0.86);
          --folder-icon: #71717a;
          --folder-card: #ffffff;
          --folder-card-accent: #e6e8ee;
          --folder-card-line: rgba(0,0,0,0.08);
          --folder-card-line-strong: rgba(0,0,0,0.16);
        }
        .dark {
          --folder-body: #2c2d33;
          --folder-pocket: rgba(40,41,47,0.8);
          --folder-icon: #52525b;
          --folder-card: #eceef3;
          --folder-card-accent: #d5d8e0;
          --folder-card-line: rgba(0,0,0,0.10);
          --folder-card-line-strong: rgba(0,0,0,0.20);
        }
      `}</style>
    </div>
  )
}
