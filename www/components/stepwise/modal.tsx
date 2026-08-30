'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { InfoCircle, Danger } from 'iconsax-react'
import { cn } from '@/lib/utils/cn'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Button } from '@/components/stepwise/button'

export interface ModalProps {
  /**
   * Portal target. Defaults to `document.body`. Point it at an element that
   * establishes a containing block (one with a `transform`/`filter`/`contain`)
   * to scope the modal's `fixed` backdrop to that box instead of the viewport —
   * how the landing page shows a modal open inside a showcase tile.
   */
  container?  : HTMLElement | null
  /**
   * Presentational mode: render the dialog in place without locking page
   * scroll, marking the rest of the page `inert`, or pulling focus. For
   * showing a modal open inside a preview tile — never for a real dialog,
   * which needs every one of those behaviours.
   */
  inline?     : boolean
  open        : boolean
  onClose     : () => void
  title       : string
  description?: string
  /** Label for the confirm button. Default "Confirm". */
  confirmLabel?: string
  /** Label for the cancel button. Default "Cancel". */
  cancelLabel?: string
  /** 'default' | 'destructive'. Default 'default'. */
  variant?    : 'default' | 'destructive'
  /** 'center' (default) or 'left' — icon/title/description left-align and the
   *  actions move to the trailing edge as auto-width buttons instead of a
   *  centered, evenly-split row. */
  align?      : 'center' | 'left'
  onConfirm?  : () => void
  /** If true, confirm button shows a loading spinner. */
  loading?    : boolean
  /** Replace the built-in icon. */
  icon?       : React.ReactNode
  children?   : React.ReactNode
}

const EASE = [0.22, 1, 0.36, 1] as const
const OPEN_DUR = 0.25
const CLOSE_DUR = 0.15
const SCALE = 0.96
const STAGGER = 0.03
const CONTENT_DELAY = 0.08
const CONTENT_DUR = 0.22

export function Modal({
  container,
  inline = false,
  open,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  align = 'center',
  onConfirm,
  loading = false,
  icon,
  children,
}: ModalProps) {
  const reduce = useReducedMotion()
  const destructive = variant === 'destructive'
  const left = align === 'left'
  const titleId = useId()
  const descId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [needsClamp, setNeedsClamp] = useState(false)

  // Long descriptions clamp to 4 lines with a "View more" toggle instead of
  // forcing the whole panel to scroll — keeps Cancel/Confirm visible without
  // interaction for the common case. Re-measured whenever the modal (re)opens
  // or the description text changes; only shown when it's actually clamped.
  useLayoutEffect(() => {
    if (!open) { setExpanded(false); return }
    const el = descRef.current
    if (!el) return
    setNeedsClamp(el.scrollHeight > el.clientHeight + 1)
  }, [open, description])

  useEffect(() => {
    if (!open || inline) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !loading) onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, inline, onClose, loading])

  useEffect(() => {
    if (!open || inline) return
    // Locking scroll removes the page's scrollbar, which reclaims its width
    // and shifts everything else on the page sideways. Pad it back so the
    // page doesn't visibly jump when the modal opens or closes.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [open])

  useEffect(() => {
    if (!open || inline) return
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

  useEffect(() => {
    if (!open || inline) return
    triggerRef.current = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    const focusable = panel?.querySelector<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    ;(focusable ?? panel)?.focus()
    return () => { triggerRef.current?.focus?.() }
  }, [open])

  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: reduce ? 0 : OPEN_DUR, ease: EASE } },
    exit: { opacity: 0, transition: { duration: reduce ? 0 : CLOSE_DUR, ease: EASE } },
  }

  const panelMotion = {
    hidden: { opacity: 0, scale: reduce ? 1 : SCALE },
    visible: { opacity: 1, scale: 1, transition: { duration: reduce ? 0.15 : OPEN_DUR, ease: EASE } },
    exit: { opacity: 0, scale: reduce ? 1 : SCALE, transition: { duration: reduce ? 0 : CLOSE_DUR, ease: EASE } },
  }

  const piece = (i: number) => ({
    hidden: { opacity: 0, y: reduce ? 0 : 8, filter: reduce ? 'blur(0px)' : 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: reduce ? 0 : CONTENT_DUR,
        delay: reduce ? 0 : CONTENT_DELAY + i * STAGGER,
        ease: EASE,
      },
    },
    exit: { opacity: 0, transition: { duration: reduce ? 0 : CLOSE_DUR, ease: EASE } },
  })

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div ref={rootRef}>
          <motion.div
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={loading ? undefined : onClose}
          />

          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              // Panel content (a long description, or the open-ended `children`
              // slot) can exceed the viewport height. The panel itself has no
              // fixed height, so without this the outer wrapper — which can't
              // scroll, it's pointer-events-none so backdrop clicks pass
              // through it — would just let the excess render off-screen with
              // no way to reach it. Scrolling here, on the pointer-events-auto
              // panel wrapper, keeps that backdrop-click behavior intact.
              className="pointer-events-auto w-full max-w-[400px] max-h-full overflow-y-auto"
              variants={panelMotion}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Surface
                ref={panelRef}
                radius={26}
                smoothing={0.6}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descId : undefined}
                tabIndex={-1}
                lisse={{
                  middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' },
                }}
                className={cn(
                  'relative overflow-hidden bg-white focus:outline-none',
                  'shadow-[0_0_48px_-8px_rgba(0,0,0,0.24)]',
                  'dark:bg-zinc-900 dark:shadow-[0_0_48px_-8px_rgba(0,0,0,0.6)]',
                )}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full blur-3xl"
                  style={{
                    background: destructive
                      ? 'radial-gradient(closest-side, rgba(244,63,94,0.14), transparent)'
                      : 'radial-gradient(closest-side, rgba(14,165,233,0.12), transparent)',
                  }}
                />

                <div className="relative flex flex-col px-6 pb-6 pt-7">
                  <motion.div
                    variants={piece(0)}
                    className={cn('flex items-center gap-3', left ? 'justify-start' : 'justify-center')}
                  >
                    <Surface
                      radius={14}
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center',
                        destructive
                          ? 'bg-gradient-to-b from-rose-50 to-rose-100/80 dark:from-rose-950/50 dark:to-rose-900/30'
                          : 'bg-gradient-to-b from-sky-50 to-sky-100/80 dark:from-sky-950/50 dark:to-sky-900/30',
                      )}
                    >
                      {icon ?? (destructive ? (
                        <Danger variant="Bold" size={18} color="currentColor" className="text-rose-500" aria-hidden />
                      ) : (
                        <InfoCircle variant="Bold" size={18} color="currentColor" className="text-sky-500" aria-hidden />
                      ))}
                    </Surface>

                    <h2
                      id={titleId}
                      className={cn(
                        'text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 [text-wrap:balance] dark:text-zinc-50',
                        left && 'text-left',
                      )}
                    >
                      {title}
                    </h2>
                  </motion.div>

                  {description && (
                    <motion.div variants={piece(1)} className="mt-3">
                      <p
                        ref={descRef}
                        id={descId}
                        className={cn(
                          'text-[14px] leading-relaxed text-zinc-500 [text-wrap:pretty] dark:text-zinc-400',
                          left ? 'text-left' : 'text-center',
                          !expanded && 'line-clamp-4',
                        )}
                      >
                        {description}
                      </p>
                      {needsClamp && (
                        <button
                          type="button"
                          onClick={() => setExpanded(v => !v)}
                          aria-expanded={expanded}
                          aria-controls={descId}
                          className={cn(
                            'mt-1 text-[13px] font-medium text-sky-600 hover:underline dark:text-sky-400',
                            left ? 'text-left' : 'block w-full text-center',
                          )}
                        >
                          {expanded ? 'View less' : 'View more'}
                        </button>
                      )}
                    </motion.div>
                  )}

                  {children && (
                    <motion.div variants={piece(2)} className="mt-5 w-full">
                      {children}
                    </motion.div>
                  )}

                  <motion.div
                    variants={piece(children ? 3 : 2)}
                    className={cn('mt-7 flex w-full gap-2.5', left && 'justify-end')}
                  >
                    <div className={left ? undefined : 'min-w-0 flex-auto'}>
                      <Button variant="soft" onClick={onClose} disabled={loading} fullWidth={!left}>
                        {cancelLabel}
                      </Button>
                    </div>
                    <div className={left ? undefined : 'min-w-0 flex-auto'}>
                      <Button
                        variant={destructive ? 'destructive' : 'solid'}
                        onClick={onConfirm}
                        loading={loading}
                        fullWidth={!left}
                      >
                        {confirmLabel}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </Surface>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    container ?? document.body,
  )
}
