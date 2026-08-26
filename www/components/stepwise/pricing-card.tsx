'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils/cn'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Button } from '@/components/stepwise/button'
import { Chip } from '@/components/stepwise/chip'

export interface PricingFeature {
  label     : string
  /** Struck-through and muted when false. Default true. */
  included? : boolean
}

export interface PricingCardProps {
  planName    : string
  price       : number | string
  /** Shown right after the price, e.g. "/month". */
  period?     : string
  currency?   : string
  description?: string
  features    : PricingFeature[]
  ctaLabel?   : string
  onCta?      : () => void
  /** The recommended-tier treatment — the card inverts to the opposite polarity of the page, with a rainbow border glow. */
  highlighted?: boolean
  /** Dot chip next to the plan name, e.g. "Most popular". */
  badge?      : string
  className?  : string
}

function CheckIcon({ included = true }: { included?: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className={cn('shrink-0', included ? 'opacity-90' : 'opacity-25')}>
      <path d="M2.5 7.2 5.4 10 11.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function PricingCard({
  planName,
  price,
  period = '/month',
  currency = '$',
  description,
  features,
  ctaLabel = 'Get started',
  onCta,
  highlighted = false,
  badge,
  className,
}: PricingCardProps) {
  // Every tone is written as the (light, dark) pair a plain card would use,
  // then swapped for a highlighted card — its surface is always the plain
  // card's opposite polarity, regardless of the site's actual theme.
  const muted    = highlighted ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500 dark:text-zinc-400'
  const hairline = highlighted ? 'bg-white/10 dark:bg-zinc-900/10' : 'bg-zinc-200/70 dark:bg-white/8'
  const excluded = highlighted ? 'text-zinc-600 dark:text-zinc-300' : 'text-zinc-300 dark:text-zinc-700'
  const arrow    = <HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2.5} color="currentColor" />

  return (
    <div className={cn('relative w-[300px]', className)}>
      <Surface
        radius={18}
        lisse={{ middleBorder: { width: 1, opacity: 1, color: highlighted ? 'rgb(255 255 255 / 10%)' : 'var(--ui-border)' } }}
        className={cn(
          'relative w-full',
          highlighted
            ? 'bg-zinc-900 text-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.4)] dark:bg-white dark:text-zinc-900'
            : 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white',
        )}
      >
        {highlighted && (
          // Reuses GlowButton's own moving-rainbow layer (`.stepwise-glow-color`,
          // already reduced-motion-aware) as a ring traced just inside the card's
          // edge — a child of the Surface so its clip-path keeps the glow inside
          // the squircle. The ring itself is a full-bleed color layer with a hole
          // punched over it in the card's own exact background color, rather than
          // a CSS mask — the two-layer mask/composite trick is real but fragile
          // (it silently no-ops or inverts on box-model edge cases); painting over
          // the center is the same visual result with none of that risk.
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="stepwise-glow-color absolute inset-0" />
            <div className={cn(
              'absolute inset-[2px] rounded-[16px]',
              'bg-zinc-900 dark:bg-white',
            )} />
          </div>
        )}

        <div className="relative flex w-full flex-col gap-6 p-7">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[15px] font-medium tracking-[-0.01em]">
                {planName}
              </h3>
              {badge && (
                <Chip
                  dot
                  size="sm"
                  color="info"
                  variant="soft"
                  className={highlighted ? 'bg-white/10 text-white border-white/10 dark:bg-zinc-900/8 dark:text-zinc-900 dark:border-zinc-900/8' : undefined}
                >
                  {badge}
                </Chip>
              )}
            </div>
            {description && (
              <p className={cn('-mt-2 text-[13px] leading-relaxed [text-wrap:pretty]', muted)}>
                {description}
              </p>
            )}

            <div className="flex items-baseline gap-1">
              <span className={cn('text-[14px] font-medium', muted)}>{currency}</span>
              <span className="text-[36px] font-medium leading-none tracking-[-0.03em] tabular-nums">
                {price}
              </span>
              {period && <span className={cn('text-[13px]', muted)}>{period}</span>}
            </div>

            <Button
              fullWidth
              variant={highlighted ? 'solid' : 'outline'}
              slideIcon
              iconPosition="right"
              icon={arrow}
              className={cn(highlighted && 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white')}
              onClick={onCta}
            >
              {ctaLabel}
            </Button>
          </div>

          <div className={cn('h-px w-full', hairline)} />

          <ul className="flex flex-col gap-3">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-[3px]"><CheckIcon included={f.included !== false} /></span>
                <span className={cn(
                  'text-[13px] leading-snug tracking-[-0.01em]',
                  f.included === false ? cn('line-through', excluded) : undefined,
                )}>
                  {f.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Surface>
    </div>
  )
}
