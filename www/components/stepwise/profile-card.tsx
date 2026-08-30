'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Frame } from '@/components/stepwise/frame'
import { Button } from '@/components/stepwise/button'
import { Avatar } from '@/components/stepwise/avatar'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'

// The verified badge trails the name as literal inline content (not a flex
// sibling — see VerifiedBadge below), so plain CSS line-clamp will clip it
// away along with the name once the name alone needs a 3rd line. This measures
// against a hidden probe and, only when necessary, trims the name at a word
// boundary so the truncated name + badge always fit within 2 lines together.
const BADGE_RESERVE_PX = 26 // ~18px icon + 4px gap + slack

function useTwoLineNameWithBadge(name: string, hasBadge: boolean) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(name)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      const width = el.clientWidth
      if (!width) return
      const cs = getComputedStyle(el)
      const maxHeight = (parseFloat(cs.lineHeight) || 20) * 2 + 1

      const probe = document.createElement('span')
      probe.style.cssText =
        `position:absolute;visibility:hidden;left:-9999px;top:-9999px;display:block;` +
        `font:${cs.font};letter-spacing:${cs.letterSpacing};line-height:${cs.lineHeight};`
      document.body.appendChild(probe)

      const fits = (text: string, reserve: number) => {
        probe.style.width = `${width - reserve}px`
        probe.textContent = text
        return probe.scrollHeight <= maxHeight
      }

      if (fits(name, 0)) {
        setDisplay(name)
      } else {
        const reserve = hasBadge ? BADGE_RESERVE_PX : 0
        let lo = 0, hi = name.length
        while (lo < hi) {
          const mid = Math.ceil((lo + hi) / 2)
          if (fits(name.slice(0, mid).trimEnd() + '…', reserve)) lo = mid
          else hi = mid - 1
        }
        let cut = name.slice(0, lo).trimEnd()
        const boundary = Math.max(cut.lastIndexOf(' '), cut.lastIndexOf('-'))
        if (boundary > cut.length - 15) cut = cut.slice(0, boundary)
        setDisplay(cut + '…')
      }

      document.body.removeChild(probe)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [name, hasBadge])

  return { ref, display }
}

export interface ProfileStat {
  label : string
  value : string | number
}

export interface ProfileCardProps {
  variant?   : 'default' | 'compact'
  /** Banner image URL (default variant only) */
  bannerSrc? : string
  avatarSrc? : string
  /** object-position for the avatar photo, e.g. "top". Default "center". */
  avatarImagePosition?: string
  /** Scales the avatar photo within its cover fit — under 1 zooms out a touch. Default 1. */
  avatarImageScale?: number
  name       : string
  verified?  : boolean
  role?      : string
  bio?       : string
  stats?     : ProfileStat[]
  ctaLabel?  : string
  onCta?     : () => void
  className? : string
}

export function ProfileCard({
  variant   = 'default',
  bannerSrc,
  avatarSrc,
  avatarImagePosition = 'center',
  avatarImageScale = 1,
  name,
  verified  = false,
  role,
  bio,
  stats,
  ctaLabel  = 'Get in touch',
  onCta,
  className,
}: ProfileCardProps) {
  const isCompact = variant === 'compact'
  const { ref: nameRef, display: displayName } = useTwoLineNameWithBadge(name, verified)

  return (
    <Frame radius={24} className={cn('w-full max-w-[350px] overflow-hidden', className)}>
      {/* ── Banner (default only) ── */}
      {!isCompact && (
        <div className="relative h-[120px] w-full overflow-hidden bg-gradient-to-br from-sky-200 via-indigo-200 to-violet-300 dark:from-sky-950 dark:via-indigo-950 dark:to-violet-950">
          {bannerSrc && (
            <img src={bannerSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
        </div>
      )}

      {/* ── Body ── */}
      <div className="flex flex-col gap-4 p-3">
        {/* Avatar + name row */}
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            src={avatarSrc}
            name={name}
            size="lg"
            letters={2}
            showTooltip={false}
            imagePosition={avatarImagePosition}
            imageScale={avatarImageScale}
          />
          <div className="flex min-w-0 flex-col">
            <span
              ref={nameRef}
              title={displayName !== name ? name : undefined}
              className="line-clamp-2 min-w-0 text-[16px] font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white"
            >
              {displayName}
              {verified && <VerifiedBadge />}
            </span>
            {role && (
              <span className="text-[13px] text-zinc-500 dark:text-zinc-400 tracking-[-0.02em]">
                {role}
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-[13px] text-zinc-500/80 dark:text-zinc-400/80 tracking-[-0.01em]">
            {bio}
          </p>
        )}

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="flex flex-col gap-2.5 -mt-1">
            <span className="text-center text-[14px] font-semibold text-zinc-800 dark:text-zinc-200 tracking-[-0.01em]">
              Work Experience
            </span>
            <div className="flex min-w-0 items-center justify-center gap-2 sm:gap-5">
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex min-w-0 items-center gap-2 sm:gap-5">
                  {i > 0 && <div className="h-4 w-[2px] shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700" />}
                  <div className="flex min-w-0 flex-col items-center">
                    <span className="text-[14px] font-semibold tabular-nums text-sky-500 tracking-[-0.02em]">
                      {stat.value}
                    </span>
                    <span className="text-center text-[11.5px] whitespace-nowrap text-zinc-600/80 dark:text-zinc-300/80 tracking-[-0.01em]">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={onCta}
          fullWidth
          slideIcon
          iconPosition="right"
          icon={<HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2.5} color="currentColor" />}
        >
          {ctaLabel}
        </Button>
      </div>
    </Frame>
  )
}

function VerifiedBadge() {
  // iconsax's <Verify variant="Bold"> (what Toast's success state uses) only
  // takes one `color` — the tick is cut through the badge as a same-fill
  // hole, not an independent layer, so it can never be its own white. Both
  // paths below are lifted from Verify's own Bulk/Outline variants instead —
  // same icon, but there the badge outline and the tick are already two
  // separate absolute-coordinate paths, so each can take its own color.
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="ml-1 inline-block shrink-0 align-[-3px]"
      role="img"
      aria-label="Verified"
    >
      <path
        d="M10.75 2.45c.69-.59 1.82-.59 2.52 0l1.58 1.36c.3.26.86.47 1.26.47h1.7c1.06 0 1.93.87 1.93 1.93v1.7c0 .39.21.96.47 1.26l1.36 1.58c.59.69.59 1.82 0 2.52l-1.36 1.58c-.26.3-.47.86-.47 1.26v1.7c0 1.06-.87 1.93-1.93 1.93h-1.7c-.39 0-.96.21-1.26.47l-1.58 1.36c-.69.59-1.82.59-2.52 0l-1.58-1.36c-.3-.26-.86-.47-1.26-.47H6.18c-1.06 0-1.93-.87-1.93-1.93V16.1c0-.39-.21-.95-.46-1.25l-1.35-1.59c-.58-.69-.58-1.81 0-2.5l1.35-1.59c.25-.3.46-.86.46-1.25V6.2c0-1.06.87-1.93 1.93-1.93h1.73c.39 0 .96-.21 1.26-.47l1.58-1.35Z"
        fill="#00a6f4"
      />
      <path
        d="M10.79 15.171a.75.75 0 0 1-.53-.22l-2.42-2.42a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l1.89 1.89 4.3-4.3c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-4.83 4.83a.75.75 0 0 1-.53.22Z"
        fill="white"
        stroke="white"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
