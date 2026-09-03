'use client'

import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion, type MotionProps } from 'motion/react'
import { cn } from '@/lib/utils/cn'
import { Surface } from '@/components/stepwise/primitives/surface'

export type DrawerSide = 'left' | 'right' | 'bottom'

export interface DrawerProps {
  open       : boolean
  onClose    : () => void
  side?      : DrawerSide
  title?     : string
  /** Width for left/right drawers (px). Default 360. */
  width?     : number
  /** Height for bottom drawer (px or 'auto'). Default 'auto'. */
  height?    : number | 'auto'
  children?  : React.ReactNode
  className? : string
  /** Accessible name when there's no visible `title`. Ignored if `title` is set. */
  ariaLabel? : string
}

const EASE = [0.22, 1, 0.36, 1] as const

// Typed via ['exit'] rather than ['initial']/['animate'] - none of these
// values are ever the literal `false` those wider prop types also allow, and
// the narrower type is what both the `initial` and `exit` props below need.
const INITIAL: Record<DrawerSide, MotionProps['exit']> = {
  left:   { x: '-100%' },
  right:  { x: '100%' },
  bottom: { y: '100%' },
}

const ANIMATE: Record<DrawerSide, MotionProps['exit']> = {
  left:   { x: 0 },
  right:  { x: 0 },
  bottom: { y: 0 },
}

export function Drawer({
  open,
  onClose,
  side = 'right',
  title,
  width = 360,
  height = 'auto',
  children,
  className,
  ariaLabel,
}: DrawerProps) {
  const reduce = useReducedMotion()
  const titleId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  // Escape key
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onClose])

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Everything outside the drawer's portal root goes inert while open so Tab
  // cannot reach content behind the backdrop. Only siblings this instance made
  // inert are restored, never ones that were already inert.
  //
  // Declared before the focus-restore effect on purpose: React runs cleanups in
  // declaration order, so `inert` must be removed before focus is returned to
  // the trigger, which is unfocusable while still inert.
  useEffect(() => {
    if (!open) return
    const root = rootRef.current
    if (!root) return
    const touched: HTMLElement[] = []
    for (const el of Array.from(document.body.children)) {
      if (el !== root && el instanceof HTMLElement && !el.hasAttribute('inert')) {
        el.setAttribute('inert', '')
        touched.push(el)
      }
    }
    return () => { touched.forEach(el => el.removeAttribute('inert')) }
  }, [open])

  // Focus moves in on open and returns to the trigger on close.
  useEffect(() => {
    if (!open) return
    triggerRef.current = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    const focusable = panel?.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    ;(focusable ?? panel)?.focus()
    return () => { triggerRef.current?.focus?.() }
  }, [open])

  if (typeof window === 'undefined') return null

  const isBottom = side === 'bottom'

  // Every variant floats as a fully separated card - a uniform 20px margin
  // (== the panel's own corner radius, the standard floating-card ratio) on
  // every screen edge it's near. A right drawer keeps its own width free
  // (that's not a screen edge, so no margin needed there) but gets margin on
  // top, right, and bottom; a bottom drawer gets it on left, right, and
  // bottom. No side of any variant touches the viewport edge anymore, so
  // every corner is a real floating corner and gets the full squircle radius.
  const panelStyle = isBottom
    ? (height === 'auto' ? undefined : { height })
    : { width }

  const panelPositionClass = {
    left:   'fixed left-3 top-3 bottom-3 max-w-[calc(100vw-1.5rem)]',
    right:  'fixed right-3 top-3 bottom-3 max-w-[calc(100vw-1.5rem)]',
    bottom: 'fixed bottom-3 left-3 right-3 max-h-[calc(100dvh-1.5rem)]',
  }[side]

  const panelInitial = reduce ? { opacity: 0 } : INITIAL[side]
  const panelAnimate = reduce ? { opacity: 1 } : ANIMATE[side]
  const panelTransition = reduce ? { duration: 0.15 } : { duration: 0.3, ease: EASE }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div ref={rootRef}>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            // [&>div]:h-full pushes full height through SmoothCorners' unclassed
            // wrapper divs - without it the side panel collapses to content height
            className={cn('z-50 pointer-events-auto', panelPositionClass, !isBottom && '[&>div]:h-full')}
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelInitial}
            transition={panelTransition}
            style={panelStyle}
          >
            <Surface
              ref={panelRef}
              radius={26}
              smoothing={0.6}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              aria-label={!title ? ariaLabel : undefined}
              tabIndex={-1}
              // className here lands on the SmoothCorners wrapper - without h-full
              // on it, the side panel collapses to content height instead of
              // spanning the screen.
              lisse={{
                className: isBottom ? undefined : 'h-full block',
                middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border, rgb(138 138 141 / 0.23))' },
              }}
              className={cn(
                'h-full flex flex-col bg-white dark:bg-zinc-900',
                'shadow-[0_0_48px_-8px_rgba(0,0,0,0.24)] dark:shadow-[0_0_48px_-8px_rgba(0,0,0,0.6)]',
                'focus:outline-none',
                isBottom && 'overflow-hidden',
                className,
              )}
            >
              {/* Drag handle - bottom drawer only */}
              {isBottom && (
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                  <div className="w-8 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                </div>
              )}

              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-zinc-100 dark:border-zinc-800">
                  <h2 id={titleId} className="text-[16px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className={cn(
                      'relative pointer-coarse:after:content-[""] pointer-coarse:after:absolute pointer-coarse:after:inset-x-0 pointer-coarse:after:top-1/2 pointer-coarse:after:[translate:0_-50%] pointer-coarse:after:h-[max(100%,44px)] flex items-center justify-center w-7 h-7 rounded-full shrink-0 cursor-pointer',
                      'text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400',
                      'hover:bg-rose-50 dark:hover:bg-rose-500/10',
                      'focus-visible:outline-2 focus-visible:outline-offset-2',
                      'focus-visible:outline-sky-600 dark:focus-visible:outline-sky-400',
                      'transition-[color,background-color,scale] duration-150 active:scale-[0.92]',
                    )}
                    aria-label="Close"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                {children}
              </div>
            </Surface>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
