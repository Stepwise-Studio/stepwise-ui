'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Surface } from '@/components/stepwise/primitives/surface'

export type AvatarSize    = 'xs' | 'sm' | 'default' | 'lg' | 'xl'
export type AvatarVariant = 'gradient' | 'letter' | 'image'

export interface AvatarProps {
  src?       : string
  name?      : string
  /**
   * "gradient" — initials over a soft white-topped gradient (default).
   * "letter"   — just the first letter on a tinted fill.
   * "image"    — the photo; falls back to gradient if it fails to load.
   */
  variant?   : AvatarVariant
  size?      : AvatarSize
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

const SIZE: Record<AvatarSize, { px: number; text: string; r: number }> = {
  xs:      { px: 24, text: 'text-[9px]',  r: 12 },
  sm:      { px: 32, text: 'text-[12px]', r: 16 },
  default: { px: 40, text: 'text-[14px]', r: 20 },
  lg:      { px: 56, text: 'text-[19px]', r: 28 },
  xl:      { px: 72, text: 'text-[24px]', r: 36 },
}

function nameHue(name: string) {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360
  return h
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({ src, name = '', variant, size = 'default', className }: AvatarProps) {
  const { px, text, r } = SIZE[size]
  const [imgError, setImgError] = useState(false)
  const hue = nameHue(name)

  const resolved: AvatarVariant =
    variant ?? (src ? 'image' : 'gradient')
  const showImage = resolved === 'image' && src && !imgError

  return (
    <Surface
      radius={r}
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden select-none',
        className,
      )}
      style={{ width: px, height: px }}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          width={px}
          height={px}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : resolved === 'letter' ? (
        // single first letter on a soft tint
        <span
          className={cn('flex h-full w-full items-center justify-center font-semibold leading-none', text)}
          style={{
            background: `hsl(${hue}, 65%, 91%)`,
            color: `hsl(${hue}, 55%, 38%)`,
          }}
          aria-label={name}
        >
          {name ? name.trim()[0].toUpperCase() : '?'}
        </span>
      ) : (
        // gradient — mostly white at the top, colour blooming in from below
        <span
          className={cn('flex h-full w-full items-center justify-center font-semibold leading-none', text)}
          style={{
            background: `linear-gradient(180deg, #ffffff 0%, hsl(${hue}, 75%, 88%) 45%, hsl(${hue}, 68%, 64%) 100%)`,
            color: `hsl(${hue}, 55%, 34%)`,
          }}
          aria-label={name}
        >
          {name ? initials(name) : '?'}
        </span>
      )}
    </Surface>
  )
}

/**
 * Overlapping stack with a little theatre: hovering an avatar lifts it out of
 * the pile directly, and it drops back with a bouncy settle. The optional +
 * button at the end is the invite entry point.
 */
export function AvatarGroup({ avatars, max = 5, size = 'default', onAdd, className }: AvatarGroupProps) {
  const { px, text, r } = SIZE[size]
  const shown   = avatars.slice(0, max)
  const excess  = avatars.length - shown.length
  const overlap = Math.round(px * 0.3)

  // quick, direct lift on hover-in; bouncy spring back on hover-out
  // (transition-timing swaps between the two states — the transitions.dev
  // avatar-group-hover trick, no JS needed)
  const itemCls =
    'relative transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,3.85,0.64,1)] ' +
    'hover:-translate-y-1.5 hover:scale-110 hover:duration-200 hover:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:z-30'

  return (
    <div className={cn('flex items-center', className)} style={{ gap: 0 }}>
      {shown.map((a, i) => (
        <div
          key={i}
          className={itemCls}
          style={{ marginLeft: i === 0 ? 0 : -overlap, zIndex: shown.length - i }}
        >
          <Surface
            radius={r}
            className="overflow-hidden ring-2 ring-white dark:ring-zinc-950"
            style={{ width: px, height: px }}
          >
            <Avatar src={a.src} name={a.name} variant={a.variant} size={size} />
          </Surface>
        </div>
      ))}

      {excess > 0 && (
        <div className={itemCls} style={{ marginLeft: -overlap, zIndex: 0 }}>
          <Surface
            radius={r}
            className={cn(
              'flex items-center justify-center ring-2 ring-white dark:ring-zinc-950',
              'bg-zinc-100 dark:bg-zinc-800',
              text,
            )}
            style={{ width: px, height: px }}
          >
            <span className="font-semibold leading-none text-zinc-600 dark:text-zinc-400">
              +{excess}
            </span>
          </Surface>
        </div>
      )}

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          aria-label="Add member"
          className={cn(
            itemCls,
            'group flex items-center justify-center rounded-full border-[1.5px] border-dashed',
            'border-zinc-300 text-zinc-400 dark:border-zinc-600 dark:text-zinc-500',
            'hover:border-sky-400 hover:text-sky-500 hover:border-solid',
            'transition-[transform,border-color,color] cursor-pointer bg-white dark:bg-zinc-950',
          )}
          style={{ width: px, height: px, marginLeft: 8 }}
        >
          <svg width={px * 0.4} height={px * 0.4} viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
