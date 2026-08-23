'use client'

import {
  useState, useEffect, useLayoutEffect, useRef, useCallback, useImperativeHandle,
  forwardRef, ButtonHTMLAttributes,
} from 'react'
import { cva } from 'class-variance-authority'
import { motion, useReducedMotion } from 'motion/react'
import { SmoothCorners, type SmoothCornersOwnProps } from '@lisse/react'
import { cn } from '@/lib/utils/cn'
import { useTheme } from '@/lib/theme'

export type ButtonSize    = 'sm' | 'default' | 'lg'
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'soft' | 'destructive'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?         : ButtonSize
  variant?      : ButtonVariant
  /** Icon element — iconsax-react or @hugeicons/react */
  icon?         : React.ReactNode
  iconPosition? : 'left' | 'right'
  /** Square icon-only button — omit children, always add aria-label */
  iconOnly?     : boolean
  /**
   * Icon hides on desktop, slides in on hover, from whichever side
   * `iconPosition` names. Always visible on touch (pointer: coarse).
   */
  slideIcon?    : boolean
  loading?      : boolean
  /** Stretches button to 100% of its parent's width */
  fullWidth?    : boolean
  /**
   * Icon+label alignment within the button. "start" pins the icon at a fixed
   * inset from the leading edge — use it when stacking fullWidth buttons with
   * varying label lengths (e.g. a social-login list) so the icons line up in
   * a column instead of each shifting with its own label's width. Default "center".
   */
  contentAlign? : 'center' | 'start'
  /** Disable the press ripple. Motion is skipped automatically under reduced-motion. */
  noRipple?     : boolean
}

const metrics = {
  sm:      { iconPx: 14, gap: 5, r: 14, text: 12 },
  default: { iconPx: 16, gap: 5, r: 18, text: 14 },
  lg:      { iconPx: 18, gap: 8, r: 20, text: 15 },
} as const

/*
 * Button surface stack (@lisse/react SmoothCorners)
 * ─────────────────────────────────────────────────
 * Lisse clips the <button> with clip-path — fill, wash, and ripple all inherit
 * the squircle. CSS border / inset box-shadow on that node get sliced.
 *
 * 1. Fill      — Tailwind bg-gradient on <button>
 * 2. Edge      — middleBorder: 1px stroke centred on the squircle path
 * 3. Elevation — box-shadow on the outer wrapper (outside clip-path)
 * 4. Wash      — absolute overlay on <button> for hover / press
 *
 * No innerShadow / inset highlight — it traces the same curve as the hairline.
 */

type ThemePair<T> = { light: T; dark: T }

/**
 * One centred hairline on the squircle path. Ghost has no stroke.
 * `middleBorder.color` is a prop @lisse/react reads directly, not a
 * className — Tailwind utilities don't apply here. Written as `rgb(... / alpha)`
 * so it still maps 1:1 onto Tailwind's own color/opacity syntax: swap the rgb
 * triplet for another Tailwind color's value, tweak the trailing `/ N%` for opacity.
 */
const edgeColor: Record<ButtonVariant, ThemePair<string> | undefined> = {
  solid:       { light: 'rgb(0 0 0 / 50%)',        dark: 'rgb(0 0 0 / 12%)' },      // black/50   · black/12
  destructive: { light: 'rgb(190 18 60 / 60%)',    dark: 'rgb(0 0 0 / 35%)' },      // rose-700/60 · black/35
  soft:        { light: 'rgb(228 228 231 / 70%)',  dark: 'rgb(255 255 255 / 8%)' }, // zinc-200/70 · white/8
  outline:     { light: 'rgb(228 228 231 / 70%)',  dark: 'rgb(255 255 255 / 14%)' },// zinc-200/70 · white/14
  ghost:       undefined,
}

const buttonVariants = cva(
  [
    'relative isolate items-center justify-center',
    'select-none cursor-pointer whitespace-nowrap py-0',
    'disabled:opacity-45 disabled:pointer-events-none',
    // No focus-visible outline here — this element sits inside SmoothCorners'
    // clip-path wrapper, sized exactly to the button's own box, so any
    // outline drawn on it gets clipped away with zero room to render. The
    // focus ring is drawn on the unclipped outer wrapper instead (below).
  ].join(' '),
  {
    variants: {
      variant: {
        solid: [
          'bg-gradient-to-b from-zinc-700 to-zinc-900 text-white',
          'dark:from-white dark:to-zinc-200 dark:text-zinc-900',
        ].join(' '),
        destructive: [
          'bg-gradient-to-b from-rose-500 to-rose-600 text-white',
          'dark:from-rose-600 dark:to-rose-700',
        ].join(' '),
        soft: [
          'bg-gradient-to-b from-zinc-50 to-zinc-200/70 text-zinc-700',
          'dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-200',
        ].join(' '),
        outline: 'bg-transparent text-zinc-700 dark:text-zinc-200',
        ghost:   'bg-transparent text-zinc-700 dark:text-zinc-200',
      },
      size: {
        sm:      'h-7 px-2.5 text-[12px]/[1.2] tracking-[-0.01em] font-medium',
        default: 'h-9 px-3.5 text-[14px]/[1.2] tracking-[-0.02em] font-medium',
        lg:      'h-10 px-4 text-[15px]/[1.2] tracking-[-0.02em] font-medium',
      },
      iconOnly: {
        true:  'px-0',
        false: '',
      },
      fullWidth: {
        true:  'flex w-full',
        false: 'inline-flex',
      },
    },
    compoundVariants: [
      { iconOnly: true, size: 'sm',      class: 'size-7 px-0' },
      { iconOnly: true, size: 'default', class: 'size-9 px-0' },
      { iconOnly: true, size: 'lg',      class: 'size-10 px-0' },
    ],
    defaultVariants: {
      variant:   'solid',
      size:      'default',
      iconOnly:  false,
      fullWidth: false,
    },
  },
)

const washClass: Record<ButtonVariant, { idle: string; press: string }> = {
  solid: {
    idle:  'bg-gradient-to-b from-zinc-700 to-zinc-800 dark:from-white dark:to-zinc-100',
    press: 'bg-zinc-800 dark:bg-zinc-200',
  },
  destructive: {
    idle:  'bg-gradient-to-b from-rose-400 to-rose-500 dark:from-rose-500 dark:to-rose-600',
    press: 'bg-rose-600 dark:bg-rose-700',
  },
  soft: {
    idle:  'bg-gradient-to-b from-zinc-100 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800',
    press: 'bg-zinc-300 dark:bg-zinc-700',
  },
  outline: {
    idle:  'bg-black/[0.035] dark:bg-white/5',
    press: 'bg-black/[0.055] dark:bg-white/8',
  },
  ghost: {
    idle:  'bg-black/5 dark:bg-white/6',
    press: 'bg-black/[0.07] dark:bg-white/9',
  },
}

const elevated: Record<ButtonVariant, boolean> = {
  solid: true, destructive: true, soft: true, outline: true, ghost: false,
}

const BG_SKIP =
  /^(?:[\w-]+:)*bg-(?:clip-|origin-|repeat-|no-repeat|fixed|local|scroll|auto|cover|contain|none|size-|gradient-|linear-|radial-|conic-|top|bottom|left|right|center|transparent)(?:-|$)/

/** An explicit from-/to-/via- gradient still needs a direction utility. */
function ensureGradientDirection(className?: string) {
  if (!className) return className
  const tokens = className.split(/\s+/).filter(Boolean)
  if (tokens.some(t => /(?:^|:)bg-gradient-/.test(t))) return className
  return ['bg-gradient-to-b', ...tokens].join(' ')
}

/*
 * Flat fill override
 * ───────────────────
 * A flat `bg-*` colour used to get promoted into synthetic `from-*`/`to-*`
 * class names (e.g. `bg-sky-500` → `from-sky-500 to-sky-500`) so it'd still
 * beat the variant's own gradient. That never actually worked: Tailwind only
 * generates CSS for class names it can see as literal text in source files —
 * never ones built by string concatenation at runtime — so the synthesized
 * classes had no matching CSS and silently did nothing. Same fix as the
 * border override: resolve the real color via a hidden probe and apply it
 * as an inline style instead of inventing class names Tailwind never sees.
 */
function splitFlatFillTokens(className?: string) {
  if (!className) return { rest: className, bgClasses: '' }
  const tokens = className.split(/\s+/).filter(Boolean)
  if (tokens.some(t => /(?:^|:)(?:from|to|via)-/.test(t))) return { rest: className, bgClasses: '' }
  const bgTokens = tokens.filter(t => /^(?:[\w-]+:)*bg-/.test(t) && !BG_SKIP.test(t))
  if (!bgTokens.length) return { rest: className, bgClasses: '' }
  const bgSet = new Set(bgTokens)
  const rest = tokens.filter(t => !bgSet.has(t)).join(' ')
  return { rest, bgClasses: bgTokens.join(' ') }
}

let fillProbe: HTMLDivElement | null = null

/** Renders `bgClasses` on a hidden probe and reads back the real background color. */
function resolveFlatFillColor(bgClasses: string): string | null {
  if (!bgClasses || typeof document === 'undefined') return null
  if (!fillProbe) {
    fillProbe = document.createElement('div')
    fillProbe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;width:0;height:0;'
    document.body.appendChild(fillProbe)
  }
  fillProbe.className = bgClasses
  const bg = getComputedStyle(fillProbe).backgroundColor
  return bg && bg !== 'rgba(0, 0, 0, 0)' ? bg : null
}

function hasFillOverride(className?: string) {
  if (!className) return false
  return className.split(/\s+/).some(t => {
    if (/(?:^|:)(?:from|to|via)-/.test(t)) return true
    return /^(?:[\w-]+:)*bg-/.test(t) && !BG_SKIP.test(t)
  })
}

/*
 * Border override
 * ────────────────
 * A plain CSS `border` on the <button> gets sliced unevenly by the squircle's
 * clip-path (see the file-level comment above) — it can't render as a clean
 * stroke on its own. So any `border*` utility the caller passes is pulled out
 * of the className before it reaches the DOM, resolved to a real color via a
 * hidden probe element (works for any Tailwind color/opacity/dark: variant,
 * not just a hardcoded palette), and fed into `middleBorder` instead — the
 * one mechanism that actually draws a clean stroke on the clipped path.
 */
const BORDER_TOKEN = /^(?:[\w-]+:)*border(?:-|$)/

function splitBorderTokens(className?: string) {
  if (!className) return { rest: className, borderClasses: '' }
  const tokens = className.split(/\s+/).filter(Boolean)
  const borderClasses = tokens.filter(t => BORDER_TOKEN.test(t)).join(' ')
  const rest = tokens.filter(t => !BORDER_TOKEN.test(t)).join(' ')
  return { rest, borderClasses }
}

let borderProbe: HTMLDivElement | null = null

/** Renders `borderClasses` on a hidden probe and reads back the real color/width. */
function resolveBorderOverride(borderClasses: string): { color: string; width: number } | null {
  if (!borderClasses || typeof document === 'undefined') return null
  if (!borderProbe) {
    borderProbe = document.createElement('div')
    borderProbe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;width:0;height:0;'
    document.body.appendChild(borderProbe)
  }
  borderProbe.className = borderClasses
  const cs = getComputedStyle(borderProbe)
  const width = parseFloat(cs.borderTopWidth) || 0
  if (width <= 0) return null
  return { color: cs.borderTopColor, width }
}

type Ripple = { id: number; x: number; y: number; d: number }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  size         = 'default',
  variant      = 'solid',
  icon,
  iconPosition = 'left',
  iconOnly     = false,
  slideIcon    = false,
  loading      = false,
  fullWidth    = false,
  contentAlign = 'center',
  noRipple     = false,
  disabled,
  children,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onPointerDown,
  onClick,
  ...props
}, ref) => {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [ripples, setRipples] = useState<Ripple[]>([])

  const innerRef  = useRef<HTMLButtonElement>(null)
  const rippleId  = useRef(0)
  const rippleTimers = useRef<Set<number>>(new Set())
  const reduceMotion = useReducedMotion()

  useImperativeHandle(ref, () => innerRef.current as HTMLButtonElement)

  useEffect(() => {
    const mq      = window.matchMedia('(pointer: coarse)')
    setIsTouch(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    if (iconOnly && !props['aria-label'] && !props['aria-labelledby']) {
      console.warn('[Stepwise Button] `iconOnly` needs an `aria-label` — the control has no accessible name.')
    }
  }, [iconOnly, props])

  const { theme } = useTheme()
  const s = metrics[size]
  // Whole pixels only: the slide roll below moves this by a CSS `-50%`
  // transform, so a fractional row height (s.text * 1.2 lands on 14.4 /
  // 16.8 / 18 depending on size) makes the browser round the transformed
  // text row to a different sub-pixel than the untransformed icon SVG sitting
  // next to it — a hairline drift that's invisible on the static icon-only
  // layout (no transform there at all) but visible here.
  const rowH = Math.round(s.text * 1.2)
  const wash = washClass[variant]
  const isDark = theme === 'dark'

  const { rest: classNameNoBorder, borderClasses } = splitBorderTokens(className)
  const customFill = hasFillOverride(classNameNoBorder)
  const { rest: classNameNoFill, bgClasses } = splitFlatFillTokens(classNameNoBorder)

  const [borderOverride, setBorderOverride] = useState<{ color: string; width: number } | null>(null)
  useLayoutEffect(() => {
    setBorderOverride(resolveBorderOverride(borderClasses))
  }, [borderClasses, isDark])

  const [fillOverride, setFillOverride] = useState<string | null>(null)
  useLayoutEffect(() => {
    setFillOverride(resolveFlatFillColor(bgClasses))
  }, [bgClasses, isDark])

  // A custom fill with no explicit border override shouldn't fall back to the
  // variant's own edge color (e.g. plain black) — that reads as a mismatched
  // ring around an arbitrary custom color. Draw no edge unless one was asked for.
  const edge = borderOverride
    ? { light: borderOverride.color, dark: borderOverride.color }
    : customFill ? undefined : edgeColor[variant]

  const isDisabled = disabled || loading
  const isSliding  = !!icon && slideIcon && !iconOnly
  const showSlide  = isSliding && (hovered || isTouch)
  const slideIconOnLeft = iconPosition === 'left'
  const isElevated = elevated[variant] && !isDisabled

  const endRipple = useCallback(
    (id: number) => setRipples(prev => prev.filter(r => r.id !== id)),
    [],
  )

  const spawnRipple = useCallback((clientX?: number, clientY?: number) => {
    const el = innerRef.current
    if (!el || noRipple || reduceMotion) return
    const r = el.getBoundingClientRect()
    const x = clientX == null ? r.width  / 2 : clientX - r.left
    const y = clientY == null ? r.height / 2 : clientY - r.top
    const d = 2 * Math.max(
      Math.hypot(x, y),           Math.hypot(r.width - x, y),
      Math.hypot(x, r.height - y), Math.hypot(r.width - x, r.height - y),
    )
    const id = ++rippleId.current
    setRipples(prev => [...prev.slice(-2), { id, x, y, d }])
    const t = window.setTimeout(() => endRipple(id), 700)
    rippleTimers.current.add(t)
  }, [noRipple, reduceMotion, endRipple])

  useEffect(() => () => {
    rippleTimers.current.forEach(clearTimeout)
    rippleTimers.current.clear()
  }, [])

  useEffect(() => {
    if (!pressed) return
    const release = () => setPressed(false)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    return () => {
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [pressed])

  const iconBox = (node: React.ReactNode) => (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center"
      style={{ width: s.iconPx, height: s.iconPx }}
    >
      {node}
    </span>
  )

  const spinner = (
    <svg className="animate-spin" width={s.iconPx} height={s.iconPx} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )

  const iconSlot   = loading && !iconOnly && !!icon ? spinner : icon
  const overlaySpinner = loading && (iconOnly || !icon)

  const leftIcon  = iconSlot && iconPosition === 'left'  && !iconOnly && !isSliding
  const rightIcon = iconSlot && iconPosition === 'right' && !iconOnly && !isSliding

  return (
    <div
      className={cn(
        'relative origin-center will-change-transform',
        'transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'data-[pressed=true]:scale-[0.96] data-[pressed=true]:duration-90',
        'motion-reduce:transition-shadow motion-reduce:data-[pressed=true]:scale-100',
        // Focus ring lives here, not on the clipped <button> — this wrapper
        // has no clip-path, so the ring actually has room to render.
        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-transparent',
        'has-[:focus-visible]:ring-sky-600 dark:has-[:focus-visible]:ring-sky-400',
        isElevated && (variant === 'destructive' ? [
          'shadow-sm shadow-rose-600/20 dark:shadow-rose-950/50',
          'data-[hovered=true]:shadow-md data-[hovered=true]:shadow-rose-600/18 dark:data-[hovered=true]:shadow-rose-950/60',
          'data-[pressed=true]:shadow-xs data-[pressed=true]:shadow-rose-600/24 dark:data-[pressed=true]:shadow-rose-950/70',
        ] : [
          'shadow-sm shadow-black/13 dark:shadow-black/50',
          'data-[hovered=true]:shadow-md data-[hovered=true]:shadow-black/12 dark:data-[hovered=true]:shadow-black/60',
          'data-[pressed=true]:shadow-xs data-[pressed=true]:shadow-black/15 dark:data-[pressed=true]:shadow-black/70',
        ]),
        fullWidth ? 'block w-full [&>div]:w-full' : 'inline-flex',
      )}
      data-hovered={hovered && !isDisabled ? 'true' : undefined}
      data-pressed={pressed && !isDisabled ? 'true' : undefined}
      style={{ borderRadius: s.r }}
    >
      <SmoothCorners
        // The border resolves async (a probe measures the real color a beat
        // after mount) — SmoothCorners only computes its stroke once, so a
        // prop change after that doesn't redraw it. Keying on the resolved
        // color forces a clean remount instead, which always redraws correctly.
        key={edge ? `${isDark ? edge.dark : edge.light}-${borderOverride?.width ?? 1}-${isDisabled}` : 'none'}
        corners={{ radius: s.r, smoothing: 0.6 }}
        className={fullWidth ? 'block w-full' : undefined}
        autoEffects={false}
        {...(edge
          // middleBorder is drawn by SmoothCorners as a sibling of <button>, not
          // a descendant — the button's own `disabled:opacity-45` never reaches
          // it, so the edge stayed fully opaque while the fill/text faded out
          // from under it. Fade it to the same 45% by hand to match.
          ? { middleBorder: { width: borderOverride?.width ?? 1, opacity: isDisabled ? 0.3 : 1, color: isDark ? edge.dark : edge.light } as NonNullable<SmoothCornersOwnProps['middleBorder']> }
          : {})}
      >
        <button
          ref={innerRef}
          disabled={isDisabled}
          aria-busy={loading || undefined}
          onMouseEnter={e => { setHovered(true);  onMouseEnter?.(e) }}
          onMouseLeave={e => { setHovered(false); onMouseLeave?.(e) }}
          onPointerDown={e => {
            setPressed(true)
            spawnRipple(e.clientX, e.clientY)
            onPointerDown?.(e)
          }}
          onClick={e => {
            if (e.detail === 0) spawnRipple()
            onClick?.(e)
          }}
          className={cn(
            buttonVariants({ variant, size, iconOnly, fullWidth }),
            'stepwise-btn-hit',
            ensureGradientDirection(classNameNoFill),
          )}
          style={fillOverride ? { ...style, backgroundImage: 'none', backgroundColor: fillOverride } : style}
          {...props}
        >
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-0 -z-10 transition-opacity duration-200 ease-out',
              (hovered || pressed) && !isDisabled ? 'opacity-100' : 'opacity-0',
              customFill
                ? (pressed ? 'bg-black/12' : 'bg-black/6')
                : (pressed ? wash.press : wash.idle),
            )}
          />

          {ripples.map(r => (
            <span
              key={r.id}
              aria-hidden="true"
              className="stepwise-btn-ripple -z-10 bg-black/8 dark:bg-white/12"
              style={{ left: r.x - r.d / 2, top: r.y - r.d / 2, width: r.d, height: r.d }}
              onAnimationEnd={() => endRipple(r.id)}
            />
          ))}

          {iconOnly && (
            <span className="relative z-[1]">{iconBox(loading ? spinner : icon)}</span>
          )}

          {/* contentAlign="start" — icon pinned in its own fixed-width column so it
              lands at the same x on every button in a stacked set regardless of
              label length; the label centers within the remaining column instead
              of the whole group hugging the icon (see SocialButton). */}
          {!iconOnly && contentAlign === 'start' && (
            <span
              className="relative z-[1] grid w-full items-center"
              style={{ gridTemplateColumns: `${s.iconPx}px 1fr`, columnGap: s.gap }}
            >
              <span className="flex items-center justify-start">{iconBox(iconSlot)}</span>
              <span className="flex items-center justify-center">
                <span
                  className="stepwise-btn-label transition-opacity duration-150 ease-out"
                  style={{ opacity: overlaySpinner ? 0 : 1 }}
                >
                  {children}
                </span>
              </span>
              {overlaySpinner && (
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                  {spinner}
                </span>
              )}
            </span>
          )}

          {!iconOnly && contentAlign !== 'start' && (
            <span className="relative z-[1] flex min-w-0 items-center justify-center">
              {leftIcon && (
                <span className="flex shrink-0" style={{ marginRight: s.gap }}>
                  {iconBox(iconSlot)}
                </span>
              )}

              {isSliding ? (
                reduceMotion ? (
                  // Reduced motion: no scroll, plain opacity crossfade.
                  <span className="relative grid items-center justify-center overflow-hidden">
                    <span
                      className="[grid-area:1/1] flex items-center justify-center stepwise-btn-label transition-opacity duration-150 ease-out"
                      style={{ opacity: showSlide ? 0 : (overlaySpinner ? 0 : 1) }}
                    >
                      {children}
                    </span>
                    <span
                      className="[grid-area:1/1] flex items-center justify-center transition-opacity duration-150 ease-out"
                      style={{ opacity: showSlide ? (overlaySpinner ? 0 : 1) : 0 }}
                    >
                      {slideIconOnLeft && (
                        <span className="flex shrink-0" style={{ marginRight: s.gap }}>
                          {iconBox(loading ? spinner : icon)}
                        </span>
                      )}
                      <span className="stepwise-btn-label">{children}</span>
                      {!slideIconOnLeft && (
                        <span className="flex shrink-0" style={{ marginLeft: s.gap }}>
                          {iconBox(loading ? spinner : icon)}
                        </span>
                      )}
                    </span>
                  </span>
                ) : (
                  // Text roll: both rows live in one wrapper twice the line
                  // height, clipped to a single line by the outer overflow-
                  // hidden window. The wrapper scrolls as ONE rigid unit
                  // (0 → -50%, i.e. exactly one line) so the plain label
                  // scrolls up and out while the icon-attached label scrolls
                  // up into view from directly below it — a real, continuous
                  // roll, not two layers independently guessing a common exit.
                  <span
                    className="relative overflow-hidden"
                    style={{ height: rowH, opacity: overlaySpinner ? 0 : 1 }}
                  >
                    <motion.span
                      initial={false}
                      className="flex flex-col items-center"
                      animate={{ y: showSlide ? '-50%' : '0%' }}
                      transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
                    >
                      <span className="flex items-center justify-center stepwise-btn-label" style={{ height: rowH }}>
                        {children}
                      </span>
                      <span className="flex items-center justify-center" style={{ height: rowH }}>
                        {slideIconOnLeft && (
                          <span className="flex shrink-0" style={{ marginRight: s.gap }}>
                            {iconBox(loading ? spinner : icon)}
                          </span>
                        )}
                        <span className="stepwise-btn-label">{children}</span>
                        {!slideIconOnLeft && (
                          <span className="flex shrink-0" style={{ marginLeft: s.gap }}>
                            {iconBox(loading ? spinner : icon)}
                          </span>
                        )}
                      </span>
                    </motion.span>
                  </span>
                )
              ) : (
                <span
                  className="stepwise-btn-label transition-opacity duration-150 ease-out"
                  style={{ opacity: overlaySpinner ? 0 : 1 }}
                >
                  {children}
                </span>
              )}

              {rightIcon && (
                <span className="flex shrink-0" style={{ marginLeft: s.gap }}>
                  {iconBox(iconSlot)}
                </span>
              )}

              {overlaySpinner && (
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                  {spinner}
                </span>
              )}
            </span>
          )}
        </button>
      </SmoothCorners>
    </div>
  )
})

Button.displayName = 'Button'
