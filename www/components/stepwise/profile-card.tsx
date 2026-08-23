'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { Frame } from '@/components/stepwise/frame'
import { Button } from '@/components/stepwise/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'

export interface ProfileStat {
  label : string
  value : string | number
}

export interface ProfileCardProps {
  variant?   : 'default' | 'compact'
  /** Banner image URL (default variant only) */
  bannerSrc? : string
  avatarSrc? : string
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

  return (
    <Frame radius={24} className={cn('w-full max-w-[350px] overflow-hidden', className)}>
      {/* ── Banner (default only) ── */}
      {!isCompact && (
        <div className="relative h-[120px] w-full overflow-hidden bg-gradient-to-br from-sky-200 via-indigo-200 to-violet-300 dark:from-sky-950 dark:via-indigo-950 dark:to-violet-950">
          {bannerSrc && (
            <Image src={bannerSrc} alt="" fill className="object-cover" unoptimized />
          )}
        </div>
      )}

      {/* ── Body ── */}
      <div className="flex flex-col gap-4 p-3">
        {/* Avatar + name row */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0 size-[55px] rounded-full border border-zinc-300 dark:border-zinc-600 overflow-hidden bg-zinc-200 dark:bg-zinc-800">
            {avatarSrc && (
              <Image src={avatarSrc} alt={name} fill className="object-cover" unoptimized />
            )}
            {!avatarSrc && (
              <div className="absolute inset-0 flex items-center justify-center text-[18px] font-semibold text-zinc-500 dark:text-zinc-400">
                {name.split(' ').map(w => w[0]).slice(0, 2).join('')}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-[16px] font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white">
                {name}
              </span>
              {verified && <VerifiedBadge />}
            </div>
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
            <div className="flex min-w-0 items-center justify-center gap-3 sm:gap-5">
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex min-w-0 items-center gap-3 sm:gap-5">
                  {i > 0 && <div className="h-4 w-[2px] shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700" />}
                  <div className="flex min-w-0 flex-col items-center">
                    <span className="text-[14px] font-semibold tabular-nums text-sky-500 tracking-[-0.02em]">
                      {stat.value}
                    </span>
                    <span className="text-center text-[12.5px] text-zinc-600/80 dark:text-zinc-300/80 tracking-[-0.01em]">
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
