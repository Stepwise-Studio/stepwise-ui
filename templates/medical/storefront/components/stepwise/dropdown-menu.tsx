'use client'

import { useState, useRef, useEffect, useLayoutEffect, useId, isValidElement, cloneElement, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ChevronRightIcon } from '@hugeicons/core-free-icons'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Separator } from '@/components/stepwise/separator'
import { cn } from '@/lib/utils/cn'

export interface DropdownMenuItem {
  label: string
  /** Omit for a text-only row - the icon gutter simply isn't reserved. */
  icon?: ReactNode
  shortcut?: string
  onSelect?: () => void
  destructive?: boolean
  disabled?: boolean
  /** Nested items. Presence alone turns this row into a submenu trigger - it
   *  renders a trailing chevron instead of a shortcut, opens on hover/click/
   *  ArrowRight, and its own `onSelect` (if any) is ignored. */
  items?: DropdownEntry[]
}
/** A divider between groups. */
export interface DropdownMenuSeparator { separator: true }
/** A non-interactive group label. */
export interface DropdownMenuLabel { heading: string }

export type DropdownEntry = DropdownMenuItem | DropdownMenuSeparator | DropdownMenuLabel

export interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownEntry[]
  /** Horizontal edge to anchor the panel to. Default 'start'. */
  align?: 'start' | 'end'
  /** Render the menu already open - for showcases and screenshots. Default false. */
  defaultOpen?: boolean
  className?: string
}

const EASE = [0.22, 1, 0.36, 1] as const
export const DROPDOWN_PANEL_CLASS = 'min-w-[190px] bg-white p-1.5 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1),0_2px_6px_-2px_rgba(0,0,0,0.06)] dark:bg-zinc-900 dark:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.6)]'
const PANEL_CLASS = DROPDOWN_PANEL_CLASS
const ITEM_CLASS = 'flex w-full items-center gap-1.5 rounded-[12px] px-2.5 py-2 text-left text-[13px] font-medium tracking-[-0.01em] transition-colors duration-100 disabled:opacity-40 disabled:pointer-events-none'

/** A level's own menuitems only - excludes anything inside a nested open
 *  submenu, whose items live under a different `role="menu"` ancestor. */
function levelFocusables(menuRef: React.RefObject<HTMLDivElement | null>) {
  if (!menuRef.current) return []
  return [...menuRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)')]
    .filter(el => el.closest('[role="menu"]') === menuRef.current)
}

/** Shared ArrowUp/Down/Home/End roving-focus handler for one menu level.
 *  Items stay at tabIndex={-1}, so arrows are the only way to move focus
 *  within the menu, per the ARIA menu pattern. Tab is left alone so it still
 *  moves focus onward; `onTabOut` just closes the menu behind it. */
function rovingKeyDown(menuRef: React.RefObject<HTMLDivElement | null>, onTabOut: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      onTabOut()
      return
    }
    const focusable = levelFocusables(menuRef)
    if (!focusable.length) return
    const idx = focusable.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusable[(idx + 1) % focusable.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusable[(idx - 1 + focusable.length) % focusable.length]?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusable[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      focusable[focusable.length - 1]?.focus()
    }
  }
}

function focusFirstItem(menuRef: React.RefObject<HTMLDivElement | null>) {
  requestAnimationFrame(() => {
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)')?.focus()
  })
}

/** Renders one level's entries - separators, headings, plain items, and
 *  submenu triggers. Used for both the root panel and every nested submenu,
 *  each with its own `subOpenIndex` so only one child submenu is open at a
 *  time within that level. */
export function DropdownMenuList({ items, menuRef, menuRootId, onRequestCloseAll }: {
  items: DropdownEntry[]
  menuRef: React.RefObject<HTMLDivElement | null>
  /** Shared with the root's outside-click check - every portaled submenu
   *  panel carries this as `data-menu-root` so a click inside one isn't
   *  mistaken for a click outside the whole widget. */
  menuRootId: string
  onRequestCloseAll: () => void
}) {
  const [subOpenIndex, setSubOpenIndex] = useState<number | null>(null)

  return (
    <>
      {items.map((entry, i) => {
        if ('separator' in entry) {
          return <Separator key={i} className="my-1" />
        }
        if ('heading' in entry) {
          return (
            <div key={i} className={cn('px-2.5 pt-1.5 pb-1 text-[13px] font-semibold tracking-tight text-zinc-500 dark:text-zinc-400', i > 0 && 'pt-3')}>
              {entry.heading}
            </div>
          )
        }
        if (entry.items) {
          return (
            <SubmenuItem
              key={i}
              entry={entry as DropdownMenuItem & { items: DropdownEntry[] }}
              open={subOpenIndex === i}
              onOpen={() => setSubOpenIndex(i)}
              onClose={() => setSubOpenIndex(cur => (cur === i ? null : cur))}
              menuRootId={menuRootId}
              onRequestCloseAll={onRequestCloseAll}
            />
          )
        }
        return (
          <button
            key={i}
            role="menuitem"
            tabIndex={-1}
            disabled={entry.disabled}
            onMouseEnter={() => setSubOpenIndex(null)}
            onClick={() => { entry.onSelect?.(); onRequestCloseAll() }}
            className={cn(
              ITEM_CLASS,
              entry.destructive
                ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40'
                : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800',
            )}
          >
            {entry.icon && <span className="flex h-4 w-4 shrink-0 items-center justify-center">{entry.icon}</span>}
            <span className="flex-1 truncate">{entry.label}</span>
            {entry.shortcut && (
              <span className="text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500">{entry.shortcut}</span>
            )}
          </button>
        )
      })}
    </>
  )
}

function SubmenuItem({ entry, open, onOpen, onClose, menuRootId, onRequestCloseAll }: {
  entry: DropdownMenuItem & { items: DropdownEntry[] }
  open: boolean
  onOpen: () => void
  onClose: () => void
  menuRootId: string
  onRequestCloseAll: () => void
}) {
  const rowRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const subMenuRef = useRef<HTMLDivElement>(null)
  // Fixed coordinates computed from the row's rect. The panel is portaled to
  // <body> rather than positioned in the DOM, because the parent Surface's
  // squircle clip-path would cut off anything rendered outside its box.
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  // Which edge of the panel the row sits against - the goo seed blob (below)
  // renders on that edge, same idea as the root panel's own originSide.
  const [side, setSide] = useState<'right' | 'left'>('right')
  const reduceMotion = useReducedMotion()
  const gooId = useId()

  // Pass 1: open immediately to the right of the row.
  useLayoutEffect(() => {
    if (!open) { setPos(null); return }
    const r = rowRef.current?.getBoundingClientRect()
    if (!r) return
    setPos({ top: r.top - 6, left: r.right + 12 })
    setSide('right')
  }, [open])

  // Pass 2: flip to the row's left edge if the panel would overflow, measured
  // and corrected before paint so there is no visible jump. Clamped afterwards
  // for viewports too narrow for either side.
  useLayoutEffect(() => {
    if (!open || !pos) return
    const p = panelRef.current?.getBoundingClientRect()
    const r = rowRef.current?.getBoundingClientRect()
    if (!p || !r) return
    const flipped = p.right > window.innerWidth
    const left = Math.min(
      Math.max(4, flipped ? r.left - p.width - 12 : pos.left),
      window.innerWidth - p.width - 4,
    )
    if (!flipped && left === pos.left) return
    setPos({ top: r.top - 6, left })
    setSide(flipped ? 'left' : 'right')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pos?.left])

  // The panel is fixed in viewport coordinates and computed once, so unlike
  // the absolutely-positioned root panel it does not follow the page as it
  // scrolls. Re-track the row's position, keeping the side already chosen.
  useEffect(() => {
    if (!open) return
    const reposition = () => {
      const r = rowRef.current?.getBoundingClientRect()
      if (!r) return
      const width = panelRef.current?.getBoundingClientRect().width ?? 190
      const left = side === 'right' ? r.right + 12 : r.left - width - 12
      setPos({ top: r.top - 6, left })
    }
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [open, side])

  useEffect(() => {
    if (open) focusFirstItem(subMenuRef)
  }, [open])

  return (
    <div className="relative">
      <button
        ref={rowRef}
        role="menuitem"
        tabIndex={-1}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={entry.disabled}
        onMouseEnter={onOpen}
        onClick={onOpen}
        onKeyDown={e => {
          if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpen()
          }
        }}
        className={cn(
          ITEM_CLASS,
          'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800',
          open && 'bg-zinc-100 dark:bg-zinc-800',
        )}
      >
        {entry.icon && <span className="flex h-4 w-4 shrink-0 items-center justify-center">{entry.icon}</span>}
        <span className="flex-1 truncate">{entry.label}</span>
        <HugeiconsIcon icon={ChevronRightIcon} size={14} strokeWidth={2} className="shrink-0 text-zinc-400 dark:text-zinc-500" />
      </button>

      {typeof document !== 'undefined' && document.body && createPortal(
        <>
          {/* Same goo trick as the root panel (see its own comment) - a
              separate filter per submenu since each is portaled independently. */}
          {!reduceMotion && (
            <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
              <filter id={gooId}>
                <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -12" />
              </filter>
            </svg>
          )}
          <AnimatePresence>
            {open && pos && (
              <motion.div
                className="fixed z-50"
                style={{ top: pos.top, left: pos.left }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.18 } }}
                exit={{ opacity: 0, transition: { duration: 0.14 } }}
              >
                <motion.div
                  ref={panelRef}
                  data-menu-root={menuRootId}
                  className="relative"
                  style={{ transformOrigin: side === 'right' ? 'top left' : 'top right' }}
                  onKeyDown={e => {
                    if (e.key === 'ArrowLeft') {
                      e.preventDefault()
                      e.stopPropagation()
                      onClose()
                      rowRef.current?.focus()
                    } else {
                      // Tab exits the whole menu tree, not just this level.
                      rovingKeyDown(subMenuRef, onRequestCloseAll)(e)
                    }
                  }}
                  initial={reduceMotion ? { scale: 0.96 } : { scale: 0.2 }}
                  animate={reduceMotion
                    ? { scale: 1, filter: 'none', transition: { duration: 0.16, ease: EASE } }
                    : { scale: 1, filter: [`url(#${gooId})`, `url(#${gooId})`, 'none'], transition: { duration: 0.3, ease: EASE, filter: { duration: 0.3, times: [0, 0.5, 1] } } }}
                  exit={{ scale: 0.97, filter: 'none', transition: { duration: 0.1 } }}
                >
                  {!reduceMotion && (
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-0 rounded-full bg-white dark:bg-zinc-900"
                      style={side === 'right' ? { left: 6 } : { right: 6 }}
                      initial={{ width: 32, height: 32, opacity: 1 }}
                      animate={{ width: 0, height: 0, opacity: 0, transition: { duration: 0.26, ease: EASE } }}
                    />
                  )}
                  <Surface
                    ref={subMenuRef}
                    radius={18}
                    lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border, rgb(138 138 141 / 0.23))' } }}
                    className={PANEL_CLASS}
                    role="menu"
                  >
                    <DropdownMenuList items={entry.items} menuRef={subMenuRef} menuRootId={menuRootId} onRequestCloseAll={onRequestCloseAll} />
                  </Surface>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body,
      )}
    </div>
  )
}

export function DropdownMenu({ trigger, items, align = 'start', defaultOpen = false, className }: DropdownMenuProps) {
  const [open, setOpen] = useState(defaultOpen)
  // The requested alignment can flip at runtime if the panel would overflow
  // the viewport at that edge - see the layout effect below.
  const [resolvedAlign, setResolvedAlign] = useState(align)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const gooId = useId()
  const menuId = useId()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Submenu panels are portaled to <body>, so a click inside one is not a
      // descendant of rootRef and would otherwise count as an outside click.
      if (rootRef.current && !rootRef.current.contains(target) && !target.closest?.(`[data-menu-root="${menuId}"]`)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Measure before paint so a flip never flickers at the requested edge
  // first. Re-measures each open in case the trigger moved (resize, scroll
  // into a different layout) since the last time.
  useLayoutEffect(() => {
    if (!open) { setResolvedAlign(align); return }
    const el = panelRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (align === 'start' && rect.right > window.innerWidth) setResolvedAlign('end')
    else if (align === 'end' && rect.left < 0) setResolvedAlign('start')
    else setResolvedAlign(align)
  }, [open, align])

  // Move focus into the menu on open, restore it to whatever had focus
  // before (the trigger, in the common case) on close.
  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null
      focusFirstItem(menuRef)
    } else {
      restoreFocusRef.current?.focus()
    }
  }, [open])

  const originSide = resolvedAlign === 'end' ? { right: 10 } : { left: 10 }

  const triggerNode = isValidElement(trigger)
    ? cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
        'aria-haspopup': 'menu',
        'aria-expanded': open,
      })
    : trigger

  return (
    <div ref={rootRef} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen(o => !o)}>{triggerNode}</div>

      {/* Goo filter for the open transition: blur merges the trigger-origin
          blob into the panel itself while it's still small, then the
          contrast matrix snaps the soft blurred edges back into one smooth
          silhouette (the classic "gooey blob merge" trick). The filter is a
          keyframe array that snaps to `none` partway through - by then the
          panel is most of the way to full size, so content resolves crisp
          instead of staying blurred once it's readable. */}
      {!reduceMotion && (
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <filter id={gooId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -12" />
          </filter>
        </svg>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            onKeyDown={rovingKeyDown(menuRef, () => setOpen(false))}
            className={cn('absolute z-50 mt-2', resolvedAlign === 'end' ? 'right-0' : 'left-0')}
            style={{ transformOrigin: resolvedAlign === 'end' ? 'top right' : 'top left' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.18 } }}
            exit={{ opacity: 0, transition: { duration: 0.14 } }}
          >
            {/* This is the wrapper that actually grows - the goo filter rides
                on the SAME element as the real panel, so what you see melting
                into shape is the real content, not a decoy layer hidden behind it. */}
            <motion.div
              className="relative"
              style={{ transformOrigin: resolvedAlign === 'end' ? 'top right' : 'top left' }}
              initial={reduceMotion ? { scale: 0.96, y: -4 } : { scale: 0.2, y: 0 }}
              animate={reduceMotion
                ? { scale: 1, y: 0, filter: 'none', transition: { duration: 0.16, ease: EASE } }
                : { scale: 1, y: 0, filter: [`url(#${gooId})`, `url(#${gooId})`, 'none'], transition: { duration: 0.36, ease: EASE, filter: { duration: 0.36, times: [0, 0.5, 1] } } }}
              exit={{ scale: 0.97, y: -2, filter: 'none', transition: { duration: 0.14, ease: EASE } }}
            >
              {!reduceMotion && (
                // trigger-origin seed blob - merges into the panel's own
                // growing edge via the shared goo filter, then dissolves.
                // Open-only: the close transition stays a plain fast fade.
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 rounded-full bg-white dark:bg-zinc-900"
                  style={originSide}
                  initial={{ width: 40, height: 40, opacity: 1 }}
                  animate={{ width: 0, height: 0, opacity: 0, transition: { duration: 0.3, ease: EASE } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                />
              )}

              <Surface
                ref={menuRef}
                radius={20}
                lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border, rgb(138 138 141 / 0.23))' } }}
                className={PANEL_CLASS}
                role="menu"
              >
                <DropdownMenuList items={items} menuRef={menuRef} menuRootId={menuId} onRequestCloseAll={() => setOpen(false)} />
              </Surface>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
