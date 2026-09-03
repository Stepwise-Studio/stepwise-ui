'use client'

import { useState, useRef, useEffect, useLayoutEffect, useId, cloneElement, isValidElement, ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Surface } from '@/components/stepwise/primitives/surface'
import { cn } from '@/lib/utils/cn'

export type PopoverSide = 'bottom' | 'top'
export type PopoverAlign = 'start' | 'center' | 'end'

export interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  side?: PopoverSide
  align?: PopoverAlign
  /** Controlled open state - omit for uncontrolled. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  /** Extra classes on the floating panel. */
  contentClassName?: string
  /**
   * Accessible name for the floating panel (it's `role="dialog"`). Falls
   * back to the trigger's own `aria-label` or plain-string text when omitted.
   */
  'aria-label'?: string
}

// Open and close are deliberately asymmetric: the open takes 250ms and the
// close 150ms, and the scale goes 0.97 in but only 0.99 out. The 8px travel
// applies to the enter only, so the exit is a quiet fade rather than the panel
// flying back to the trigger.
const EASE = [0.22, 1, 0.36, 1] as const
const OPEN_DUR = 0.25
const CLOSE_DUR = 0.15
const OPEN_SCALE = 0.97
const CLOSE_SCALE = 0.99
const DISTANCE = 8
const EDGE_MARGIN = 8

const alignX: Record<PopoverAlign, string> = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
}

const panelVariants = (side: PopoverSide, reduce: boolean) => ({
  hidden: {
    opacity: 0,
    scale: reduce ? 1 : OPEN_SCALE,
    y: reduce ? 0 : side === 'top' ? DISTANCE : -DISTANCE,
    filter: reduce ? 'blur(0px)' : 'blur(2px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: reduce ? 0.1 : OPEN_DUR, ease: EASE },
  },
  exit: {
    opacity: 0,
    scale: reduce ? 1 : CLOSE_SCALE,
    filter: 'blur(0px)',
    transition: { duration: reduce ? 0.1 : CLOSE_DUR, ease: EASE },
  },
})

export function Popover({
  trigger,
  children,
  side = 'bottom',
  align = 'center',
  open: controlledOpen,
  onOpenChange,
  className,
  contentClassName,
  'aria-label': ariaLabel,
}: PopoverProps) {
  const [internal, setInternal] = useState(false)
  const open = controlledOpen ?? internal
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentId = useId()

  // Preferred placement comes from props; resolved placement is what
  // actually fits once the panel's real size is known post-mount.
  const [resolvedSide, setResolvedSide] = useState(side)
  const [offsetX, setOffsetX] = useState(0)

  const setOpen = (v: boolean) => {
    if (controlledOpen === undefined) setInternal(v)
    onOpenChange?.(v)
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Focus moves into the panel on open and returns to the trigger on close,
  // however it closed: Escape, outside click, or the trigger again.
  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus?.()
      return
    }
    const panel = panelRef.current
    const focusable = panel?.querySelector<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    focusable?.focus()
  }, [open])

  // Flip vertically and clamp horizontally when the preferred placement
  // would push the panel off-screen. Runs in useLayoutEffect so any
  // correction lands before the browser paints - no visible jump.
  useLayoutEffect(() => {
    if (!open) { setResolvedSide(side); setOffsetX(0); return }
    const trigger = rootRef.current
    const panel = panelRef.current
    if (!trigger || !panel) return
    const tRect = trigger.getBoundingClientRect()
    const pRect = panel.getBoundingClientRect()

    let nextSide = side
    if (side === 'bottom' && pRect.bottom > window.innerHeight - EDGE_MARGIN) {
      if (tRect.top - pRect.height - EDGE_MARGIN >= 0) nextSide = 'top'
    } else if (side === 'top' && pRect.top < EDGE_MARGIN) {
      if (tRect.bottom + pRect.height + EDGE_MARGIN <= window.innerHeight) nextSide = 'bottom'
    }
    setResolvedSide(nextSide)

    let dx = 0
    if (pRect.left < EDGE_MARGIN) dx = EDGE_MARGIN - pRect.left
    else if (pRect.right > window.innerWidth - EDGE_MARGIN) dx = (window.innerWidth - EDGE_MARGIN) - pRect.right
    setOffsetX(dx)
  }, [open, side, align])

  const originY = resolvedSide === 'top' ? 'bottom' : 'top'
  const originX = align === 'end' ? 'right' : align === 'start' ? 'left' : 'center'

  // The trigger is cloned rather than wrapped so the ARIA attributes and the
  // focus-return ref land on the real interactive element. On a wrapper div,
  // aria-expanded would sit on a node that is never focusable.
  const isElementTrigger = isValidElement<Record<string, unknown>>(trigger)

  // globalThis rather than a bare `process`, which would need @types/node to
  // typecheck in projects that don't already have it.
  const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV
  if (nodeEnv !== 'production' && !isElementTrigger) {
    console.warn('[Stepwise Popover] `trigger` should be a single element (e.g. a Button) - a non-element trigger falls back to a plain, non-keyboard-accessible click target.')
  }

  const triggerElement = isElementTrigger
    ? cloneElement(trigger, {
        ref: triggerRef,
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-controls': contentId,
        onClick: (e: React.MouseEvent) => {
          ;(trigger.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e)
          setOpen(!open)
        },
      })
    : trigger

  const triggerProps = isElementTrigger ? (trigger.props as Record<string, unknown>) : undefined
  const triggerOwnLabel = typeof triggerProps?.['aria-label'] === 'string' ? (triggerProps['aria-label'] as string) : undefined
  const triggerText = typeof triggerProps?.children === 'string' ? (triggerProps.children as string) : undefined
  const resolvedLabel = ariaLabel ?? triggerOwnLabel ?? triggerText

  return (
    <div ref={rootRef} className={cn('relative inline-block', className)}>
      {isElementTrigger ? triggerElement : <div onClick={() => setOpen(!open)}>{trigger}</div>}

      <AnimatePresence>
        {open && (
          <motion.div
            className={cn(
              'absolute z-50',
              resolvedSide === 'top' ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]',
              alignX[align],
            )}
            style={{ transformOrigin: `${originY} ${originX}`, marginLeft: offsetX }}
            variants={panelVariants(resolvedSide, !!reduce)}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Surface
              ref={panelRef}
              id={contentId}
              radius={16}
              lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border, rgb(138 138 141 / 0.23))' } }}
              className={cn(
                'bg-white p-3 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.12),0_2px_6px_-2px_rgba(0,0,0,0.06)] dark:bg-zinc-900 dark:shadow-[0_10px_30px_-6px_rgba(0,0,0,0.6)]',
                contentClassName,
              )}
              role="dialog"
              aria-label={resolvedLabel}
              tabIndex={-1}
            >
              {children}
            </Surface>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
