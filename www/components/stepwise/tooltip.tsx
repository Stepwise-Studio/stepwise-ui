'use client'

import {
  useState, useRef, useLayoutEffect, useCallback, useEffect, useId, cloneElement,
  type ReactNode, type ReactElement, type HTMLAttributes,
} from 'react'
import { createPortal } from 'react-dom'
import { useReducedMotion } from 'motion/react'
import { Surface } from '@/components/stepwise/primitives/surface'
import { cn } from '@/lib/utils/cn'

type Side = 'top' | 'bottom' | 'left' | 'right'
type Phase = 'closed' | 'measuring' | 'open' | 'closing'

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }
// Same constant on every side — this is the entire visible gap between
// trigger and tooltip now that there's no arrow adding its own protrusion,
// so the distance reads identically regardless of which side it lands on.
const GAP    = 10   // px between trigger edge and tooltip body
const MARGIN = 8    // min clearance from boundary edges

type Bounds = { top: number; left: number; right: number; bottom: number }

interface Placement {
  top: number
  left: number
  side: Side
}

function computePlacement(
  trigger: DOMRect,
  // Only width/height are read below — deliberately not a DOMRect. Measuring
  // via getBoundingClientRect() while the enter transform's `scale(0.95)` is
  // still applied (true during the whole "measuring" phase, since it's only
  // ever *not* `open`) shrinks the reported size by 5%, and that error scales
  // with the tooltip's own dimensions — a wide tooltip drifts further off
  // than a narrow one. offsetWidth/offsetHeight ignore transforms entirely.
  tooltip: { width: number; height: number },
  preferred: Side,
  bounds: Bounds,
): Placement {
  const room: Record<Side, number> = {
    top:    trigger.top    - bounds.top    - MARGIN,
    bottom: bounds.bottom  - trigger.bottom - MARGIN,
    left:   trigger.left   - bounds.left   - MARGIN,
    right:  bounds.right   - trigger.right  - MARGIN,
  }
  const need = (s: Side) => (s === 'top' || s === 'bottom') ? tooltip.height : tooltip.width
  const fits = (s: Side) => room[s] >= need(s) + GAP

  let side = preferred
  if (!fits(side)) {
    side = fits(OPPOSITE[preferred])
      ? OPPOSITE[preferred]
      : (Object.keys(room) as Side[]).reduce((a, b) => room[a] >= room[b] ? a : b)
  }

  // Ideal unclamped position
  let top = 0, left = 0
  if (side === 'top') {
    top  = trigger.top  - tooltip.height - GAP
    left = trigger.left + trigger.width  / 2 - tooltip.width / 2
  } else if (side === 'bottom') {
    top  = trigger.bottom + GAP
    left = trigger.left + trigger.width  / 2 - tooltip.width / 2
  } else if (side === 'left') {
    left = trigger.left - tooltip.width - GAP
    top  = trigger.top  + trigger.height / 2 - tooltip.height / 2
  } else {
    left = trigger.right + GAP
    top  = trigger.top  + trigger.height / 2 - tooltip.height / 2
  }

  // Clamp so tooltip stays inside the boundary
  const clampedLeft = Math.max(bounds.left + MARGIN, Math.min(left, bounds.right  - tooltip.width  - MARGIN))
  const clampedTop  = Math.max(bounds.top  + MARGIN, Math.min(top,  bounds.bottom - tooltip.height - MARGIN))

  return { top: clampedTop, left: clampedLeft, side }
}

const enterTranslate: Record<Side, string> = {
  top:    'translateY(3px)',
  bottom: 'translateY(-3px)',
  left:   'translateX(3px)',
  right:  'translateX(-3px)',
}

export interface TooltipProps {
  content: ReactNode
  children: ReactElement<HTMLAttributes<HTMLElement>>
  side?: Side
  /**
   * Boundary element for collision detection.
   * Defaults to the viewport when omitted.
   * Pass a ref to a container to constrain the tooltip within that element —
   * useful for demos or scroll containers.
   */
  boundary?: React.RefObject<Element | null>
  className?: string
}

export function Tooltip({ content, children, side: preferred = 'top', boundary, className }: TooltipProps) {
  const id = useId()
  const reduce = useReducedMotion()
  const [phase,       setPhase]      = useState<Phase>('closed')
  const [pos,        setPos]  = useState({ top: -9999, left: -9999 })
  const [actualSide, setSide] = useState<Side>(preferred)

  const triggerRef = useRef<HTMLElement>(null)
  const outerRef   = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useLayoutEffect(() => {
    if (phase !== 'measuring') return
    const outer = outerRef.current
    const trig  = triggerRef.current
    if (!outer || !trig) return

    const bounds: Bounds = boundary?.current
      ? (() => { const r = boundary.current!.getBoundingClientRect(); return { top: r.top, left: r.left, right: r.right, bottom: r.bottom } })()
      : { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight }

    const { top, left, side } = computePlacement(
      trig.getBoundingClientRect(),
      { width: outer.offsetWidth, height: outer.offsetHeight },
      preferred,
      bounds,
    )
    setPos({ top, left })
    setSide(side)
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase('open')))
  }, [phase, preferred, boundary])

  const show = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null }
    if (phase === 'open' || phase === 'measuring') return
    setPhase('measuring')
  }, [phase])

  const hide = useCallback(() => {
    if (phase === 'closed' || phase === 'closing') return
    setPhase('closing')
    closeTimer.current = setTimeout(() => { setPhase('closed'); closeTimer.current = null }, 120)
  }, [phase])

  const isOpen    = phase === 'open'
  const isClosed  = phase === 'closed'
  const isMeasure = phase === 'measuring'

  // Escape dismisses an open tooltip (APG tooltip pattern).
  useEffect(() => {
    if (isClosed) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') hide() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isClosed, hide])

  const outerStyle: React.CSSProperties = {
    position:      'fixed',
    top:           isMeasure ? -9999 : pos.top,
    left:          isMeasure ? -9999 : pos.left,
    zIndex:        9999,
    pointerEvents: 'none',
    visibility:    isMeasure ? 'hidden' : 'visible',
    opacity:       isOpen ? 1 : 0,
    filter: reduce ? 'none' : (isOpen
      ? 'drop-shadow(0 4px 16px rgba(0,0,0,0.14)) drop-shadow(0 0 0.5px rgba(0,0,0,0.10)) blur(0px)'
      : 'drop-shadow(0 4px 16px rgba(0,0,0,0)) drop-shadow(0 0 0.5px rgba(0,0,0,0)) blur(1px)'),
    transform: reduce ? 'none' : (isOpen ? 'scale(1)' : `scale(0.95) ${enterTranslate[actualSide]}`),
    transition: reduce
      ? 'opacity 100ms ease-out'
      : (isOpen
        ? 'opacity 150ms ease-out 50ms, transform 150ms ease-out 50ms, filter 150ms ease-out 50ms'
        : 'opacity 80ms ease-in, transform 80ms ease-in, filter 80ms ease-in'),
  }

  const trigger = children as ReactElement<HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>
  const cloned = cloneElement(trigger, {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => { show(); trigger.props.onMouseEnter?.(e) },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => { hide(); trigger.props.onMouseLeave?.(e) },
    onFocus:  (e: React.FocusEvent<HTMLElement>) => { show(); trigger.props.onFocus?.(e) },
    onBlur:   (e: React.FocusEvent<HTMLElement>) => { hide(); trigger.props.onBlur?.(e)  },
    'aria-describedby': isOpen ? id : undefined,
  } as HTMLAttributes<HTMLElement> & { ref: React.Ref<HTMLElement> })

  return (
    <>
      {cloned}
      {!isClosed && typeof window !== 'undefined' && createPortal(
        <div ref={outerRef} id={id} role="tooltip" style={outerStyle}>
          <Surface
            radius={10}
            className={cn(
              // leading-snug gives the font its natural ascender/descender room,
              // preventing the optical "text sits too high" effect that leading-none causes.
              'flex items-center px-3 py-[7px] max-w-[220px]',
              'bg-zinc-900 dark:bg-zinc-100',
              'text-zinc-50 dark:text-zinc-900',
              'text-[12px] font-medium leading-snug tracking-[-0.01em]',
              className,
            )}
          >
            {content}
          </Surface>
        </div>,
        document.body,
      )}
    </>
  )
}
