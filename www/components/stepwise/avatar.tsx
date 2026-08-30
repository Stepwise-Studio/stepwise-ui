'use client'

import { useState, useRef, useId, useEffect, useLayoutEffect, type HTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/cn'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Tooltip } from '@/components/stepwise/tooltip'
import { FadeText } from '@/components/stepwise/fade-text'

export type AvatarSize    = 'xs' | 'sm' | 'default' | 'lg'
export type AvatarVariant = 'letter' | 'image'
export type AvatarBadge   = 'online' | 'away' | 'busy' | 'offline'

export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  src?       : string
  name?      : string
  /**
   * "letter" — initial(s) on a neutral fill, matching border and a soft shadow (default).
   * "image"  — the photo, on the same tinted backdrop; falls back to "letter" if it fails to load.
   */
  variant?   : AvatarVariant
  size?      : AvatarSize
  /** How many initials the letter variant shows. Default 1. */
  letters?   : 1 | 2
  /**
   * "cover" — the photo fills the circle edge to edge, cropped (default,
   * right for an ordinary headshot). "contain" — the photo sits inset with
   * room to breathe, right for art with its own transparent margin.
   */
  imageFit?  : 'cover' | 'contain'
  /** `object-position` for the "cover" fit — e.g. "top" to favor a face over the chest below it. Default "center". */
  imagePosition?: string
  /** Scales the photo within its "cover" fit — under 1 zooms out a touch, revealing a little more around the crop. Default 1. */
  imageScale?: number
  /** Small status dot on the bottom-right edge. Omit for none. */
  badge?     : AvatarBadge
  /** The tinted border stroke. Default true — AvatarGroup turns it off itself. */
  bordered?  : boolean
  /** Names the avatar on hover, via Tooltip. Default true. */
  showTooltip?: boolean
  /** Overrides the letter's color. Default "text-zinc-800 dark:text-zinc-200". */
  textClassName?: string
  className? : string
}

export interface AvatarGroupProps {
  avatars   : AvatarProps[]
  max?      : number
  size?     : AvatarSize
  /** Renders a + button after the stack. Wire it to your invite flow. */
  onAdd?    : () => void
  className?: string
}

// rem, not px — so avatars scale with the user's browser text-size setting
// rather than staying a fixed physical size at 200% zoom.
const SIZE: Record<AvatarSize, { rem: number; text: string }> = {
  xs:      { rem: 1.5,  text: 'text-[0.5625rem]' },
  sm:      { rem: 2,    text: 'text-[0.75rem]' },
  default: { rem: 2.5,  text: 'text-[0.875rem]' },
  lg:      { rem: 3.5,  text: 'text-[1.1875rem]' },
}

const BADGE_COLOR: Record<AvatarBadge, string> = {
  online:  'bg-emerald-500',
  away:    'bg-amber-500',
  busy:    'bg-rose-500',
  offline: 'bg-zinc-400 dark:bg-zinc-600',
}

const BADGE_LABEL: Record<AvatarBadge, string> = {
  online:  'Online',
  away:    'Away',
  busy:    'Busy',
  offline: 'Offline',
}

const DEFAULT_TEXT_COLOR = 'text-zinc-800 dark:text-zinc-200'
const EASE = [0.22, 1, 0.36, 1] as const

function initials(name: string, count: 1 | 2) {
  const trimmed = name.trim()
  if (!trimmed) return '?'
  if (count === 1) return trimmed[0].toUpperCase()
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Names itself on hover by default (a Tooltip, fading in via FadeText) — set
 * `showTooltip={false}` for the cases that don't want it, e.g. a spot where
 * the name is already printed right next to the avatar.
 */
export function Avatar({
  src, name = '', variant, size = 'default', letters = 1, imageFit = 'cover', imagePosition = 'center', imageScale = 1,
  badge, bordered = true, showTooltip = true, textClassName, className, ...rest
}: AvatarProps) {
  const { rem, text } = SIZE[size]
  const [imgError, setImgError] = useState(false)

  const resolved: AvatarVariant = variant ?? (src ? 'image' : 'letter')
  const showImage = resolved === 'image' && src && !imgError
  const badgeRem = Math.max(rem * 0.16, 0.28)

  const avatar = (
    <div className="relative inline-block shrink-0" style={{ width: `${rem}rem`, height: `${rem}rem` }}>
      <div
        // tabIndex/aria-label only when a Tooltip will actually wrap this (showTooltip)
        // — that's the only case hover reveals something with no other visible text.
        tabIndex={showTooltip ? 0 : undefined}
        aria-label={showTooltip ? name || 'Unnamed' : undefined}
        className={cn(
          'flex h-full w-full shrink-0 items-center justify-center overflow-hidden select-none rounded-full shadow-sm',
          showImage
            ? cn('bg-white', bordered && 'border border-[var(--ui-border)]')
            : cn('bg-zinc-100 dark:bg-zinc-900', bordered && 'border border-[var(--ui-border)]'),
          showTooltip && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400',
          className,
        )}
        {...rest}
      >
        {showImage ? (
          <img
            src={src}
            alt={name}
            style={{ objectPosition: imagePosition, transform: imageScale !== 1 ? `scale(${imageScale})` : undefined }}
            className={cn(imageFit === 'cover' ? 'h-full w-full object-cover' : 'h-[78%] w-[78%] object-contain')}
            onError={() => setImgError(true)}
          />
        ) : (
          <span
            className={cn('flex h-full w-full items-center justify-center font-semibold leading-none', text, textClassName ?? DEFAULT_TEXT_COLOR)}
            aria-label={name}
          >
            {initials(name, letters)}
          </span>
        )}
      </div>
      {badge && (
        <span
          role="img"
          aria-label={BADGE_LABEL[badge]}
          className={cn('absolute rounded-full ring-2 ring-white dark:ring-zinc-950', BADGE_COLOR[badge])}
          style={{
            width: `${badgeRem}rem`,
            height: `${badgeRem}rem`,
            // The circle's own bottom-right point sits at 50% + 50%·cos45°
            // along each axis (≈85.36%), not the square container's corner
            // — right:0/bottom:0 was aligning to the corner of the bounding
            // box, which sits outside the circle, so the dot read as
            // shifted inward off the actual stroke. Percentage + centering
            // transform lands exactly on the ring regardless of size.
            top: '85.36%',
            left: '85.36%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </div>
  )

  if (!showTooltip) return avatar

  return (
    <Tooltip content={<FadeText stagger={0.03}>{name || 'Unnamed'}</FadeText>}>
      {avatar}
    </Tooltip>
  )
}

interface OverflowFlyoutProps {
  hidden: AvatarProps[]
  triggerClassName: string
  triggerStyle: React.CSSProperties
  children: React.ReactNode
}

/**
 * The overflow list, portaled to <body> with fixed, viewport-clamped
 * coordinates — not CSS-anchored like a plain dropdown — because it's
 * shown from inside a clipped/scrollable ancestor (a docs preview box, a
 * card, a modal) as often as not, and anything a clipped ancestor's
 * descendant renders outside that ancestor's own box gets silently cut
 * off (the same class of bug the DropdownMenu submenu panel solves this
 * exact way). The open transition reuses DropdownMenu's own "goo" filter
 * so this reads as the same family of flyout, not a different one.
 */
function OverflowFlyout({ hidden, triggerClassName, triggerStyle, children }: OverflowFlyoutProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const gooId = useId()
  const panelId = useId()
  const reduceMotion = useReducedMotion()

  // The panel is portaled to <body>, physically separate from the trigger —
  // moving the cursor between them crosses a real gap, so a plain
  // mouseleave-closes-immediately handler flickers shut mid-transit, then
  // reopens and recomputes position from scratch, reading as a sideways
  // jump. A short close delay, cancelled by either element's mouseenter,
  // is the standard hover-intent fix — same idea as a click-away timer,
  // just short enough nobody perceives it as lag.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const show = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null }
    setOpen(true)
  }
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150)
  }
  const close = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null }
    setOpen(false)
  }
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current) }, [])

  // Pass 1: open centered directly under the trigger.
  useLayoutEffect(() => {
    if (!open) { setPos(null); return }
    const r = rootRef.current?.getBoundingClientRect()
    if (!r) return
    setPos({ top: r.bottom + 8, left: r.left + r.width / 2 })
  }, [open])

  // Pass 2: now that the panel has real dimensions, flip above the trigger
  // if it would overflow the viewport bottom, and clamp horizontally —
  // this is the actual "aware of the space available" fix, not a z-index bump.
  useLayoutEffect(() => {
    if (!open || !pos) return
    const p = panelRef.current?.getBoundingClientRect()
    const r = rootRef.current?.getBoundingClientRect()
    if (!p || !r) return
    const top = p.bottom > window.innerHeight - 8 ? r.top - p.height - 8 : pos.top
    const left = Math.min(Math.max(8, r.left + r.width / 2 - p.width / 2), window.innerWidth - p.width - 8)
    if (top === pos.top && left === pos.left) return
    setPos({ top, left })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pos])

  return (
    <div ref={rootRef} onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        className={triggerClassName}
        style={triggerStyle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${hidden.length} more ${hidden.length === 1 ? 'member' : 'members'}`}
        onFocus={show}
        onBlur={hide}
        onClick={() => (open ? close() : show())}
        onKeyDown={e => { if (e.key === 'Escape') close() }}
      >
        {children}
      </button>

      {!reduceMotion && (
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <filter id={gooId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -12" />
          </filter>
        </svg>
      )}

      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {open && pos && (
            <motion.div
              ref={panelRef}
              id={panelId}
              className="fixed z-[9999]"
              style={{ top: pos.top, left: pos.left, transformOrigin: 'top center' }}
              onMouseEnter={show}
              onMouseLeave={hide}
              onKeyDown={e => { if (e.key === 'Escape') close() }}
              initial={reduceMotion ? { opacity: 0, scale: 0.96, y: -4 } : { opacity: 1, scale: 0.2, y: 0, filter: `url(#${gooId})` }}
              animate={reduceMotion
                ? { opacity: 1, scale: 1, y: 0, transition: { duration: 0.16, ease: EASE } }
                : { opacity: 1, scale: 1, y: 0, filter: [`url(#${gooId})`, `url(#${gooId})`, 'none'], transition: { duration: 0.36, ease: EASE, filter: { duration: 0.36, times: [0, 0.5, 1] } } }}
              exit={{ opacity: 0, scale: 0.97, y: -2, filter: 'none', transition: { duration: 0.14, ease: EASE } }}
            >
              <Surface
                radius={16}
                lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
                className="bg-white p-3 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.12),0_2px_6px_-2px_rgba(0,0,0,0.06)] dark:bg-zinc-800 dark:shadow-[0_10px_30px_-6px_rgba(0,0,0,0.6)]"
              >
                <div className="flex flex-col gap-2.5 py-0.5">
                  {hidden.map((a, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Avatar {...a} size="sm" bordered={false} showTooltip={false} />
                      <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                        {a.name || 'Unnamed'}
                      </span>
                    </div>
                  ))}
                </div>
              </Surface>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}

/**
 * Overlapping stack — a ring in the page's own background color punches a
 * clean gap between avatars where they overlap, and each avatar lifts
 * slightly and comes forward on hover (naming itself via its own built-in
 * Tooltip). Hovering the overflow pill opens a flyout listing everyone it's
 * hiding. The optional + button at the end is the invite entry point.
 */
export function AvatarGroup({ avatars, max = 5, size = 'default', onAdd, className }: AvatarGroupProps) {
  const { rem, text } = SIZE[size]
  const shown   = avatars.slice(0, max)
  const hidden  = avatars.slice(max)
  const overlap = rem * 0.32

  const itemCls = 'relative transition-transform duration-150 ease-out hover:z-10 hover:-translate-y-0.5'

  return (
    <div className={cn('flex items-center', className)}>
      {shown.map((a, i) => (
        <div
          key={i}
          className={itemCls}
          style={{ marginLeft: i === 0 ? 0 : `-${overlap}rem`, zIndex: shown.length - i }}
        >
          <Avatar
            {...a}
            size={size}
            bordered={false}
            className="ring-[3px] ring-white dark:ring-zinc-950"
          />
        </div>
      ))}

      {hidden.length > 0 && (
        <div className={itemCls} style={{ marginLeft: `-${overlap}rem`, zIndex: 0 }}>
          <OverflowFlyout
            hidden={hidden}
            triggerClassName={cn(
              'flex cursor-pointer items-center justify-center rounded-full font-semibold shadow-sm ring-[3px] ring-white dark:ring-zinc-950',
              'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400',
              text,
            )}
            triggerStyle={{ width: `${rem}rem`, height: `${rem}rem` }}
          >
            +{hidden.length}
          </OverflowFlyout>
        </div>
      )}

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          aria-label="Add member"
          className={cn(
            itemCls,
            'flex items-center justify-center rounded-full border border-dashed cursor-pointer',
            'border-zinc-300 text-zinc-400 dark:border-zinc-600 dark:text-zinc-500',
            'hover:border-zinc-400 hover:text-zinc-500 dark:hover:border-zinc-500 dark:hover:text-zinc-400',
            'bg-white dark:bg-zinc-950 transition-colors',
          )}
          style={{ width: `${rem}rem`, height: `${rem}rem`, marginLeft: '0.5rem' }}
        >
          <svg width={`${rem * 0.36}rem`} height={`${rem * 0.36}rem`} viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
