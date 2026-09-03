'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { Tick02Icon, MinusSignIcon, ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils/cn'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Chip } from '@/components/stepwise/chip'
import { Button } from '@/components/stepwise/button'
import { GlowButton } from '@/components/stepwise/glow-button'

export interface PricingFeature {
  label     : string
  /** Dashed and muted when false. Default true. */
  included? : boolean
}

export interface PricingCardProps {
  planName    : string
  price       : number | string
  /** Shown right after the price, e.g. "/month" or "/month/seat". */
  period?     : string
  currency?   : string
  description?: string
  features    : PricingFeature[]
  ctaLabel?   : string
  onCta?      : () => void
  /** The recommended-tier treatment - the header goes dark (inverting with the page's own theme). */
  highlighted?: boolean
  /**
   * "flat" gives header and feature list one shared background (default).
   * "framed" puts the header in its own inset panel with a margin around it,
   * and the feature list on a separate surface below.
   */
  surface?    : 'flat' | 'framed'
  /** Dot chip next to the plan name, e.g. "Most popular". */
  badge?      : string
  className?  : string
}

function FeatureRow({ feature, invert }: { feature: PricingFeature; invert: boolean }) {
  const included = feature.included !== false
  // `invert` applies only to a flat highlighted card, whose surface is dark.
  // Every other combination uses the normal light-surface pair.
  const includedText = invert ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-600 dark:text-zinc-300'
  const excludedText  = invert ? 'text-zinc-600 dark:text-zinc-300' : 'text-zinc-400 dark:text-zinc-600'
  return (
    <li className="flex items-center gap-1.5">
      <span className={cn(
        'flex shrink-0 items-center justify-center',
        included ? 'size-5 text-green-500 dark:text-green-400' : 'size-[18px] text-zinc-400 dark:text-zinc-600',
      )}>
        <HugeiconsIcon icon={included ? Tick02Icon : MinusSignIcon} size={included ? 15 : 13} strokeWidth={3} color="currentColor" />
      </span>
      <span className={cn('text-[13px] tracking-[-0.01em]', included ? includedText : excludedText)}>
        {feature.label}
      </span>
    </li>
  )
}

export function PricingCard({
  planName,
  price,
  period = '/month',
  currency = '$',
  description,
  features,
  ctaLabel = 'Upgrade now',
  onCta,
  highlighted = false,
  surface = 'flat',
  badge,
  className,
}: PricingCardProps) {
  const isFramed = surface === 'framed'

  // The header goes dark when highlighted, inverting with the page theme.
  const headerBg   = highlighted ? 'bg-zinc-800 dark:bg-zinc-100' : isFramed ? 'bg-zinc-100 dark:bg-zinc-900' : 'bg-zinc-50 dark:bg-zinc-950'
  const headerText = highlighted ? 'text-zinc-100 dark:text-zinc-800' : 'text-zinc-800 dark:text-zinc-100'
  const descText   = highlighted ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-600 dark:text-zinc-400'
  const unitText   = highlighted ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-500 dark:text-zinc-400'

  // Concentric radii - the outer card is 28px; a "framed" header sits
  // inset by the outer surface's own p-1 (4px), so its own corner must be
  // 28 − 4 = 24px to read as one continuous curve, not a pinched inset.
  const header = (
    <div className={cn('flex w-full flex-col gap-6', headerBg, isFramed ? 'rounded-[24px] p-4' : 'p-5')}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          {/* `min-w-0` - a flex child's default min-width is its own
              min-content size, not 0, so a long `planName` next to a
              `badge` on a narrow card would push the row wider than the
              card instead of wrapping. */}
          <h3 className={cn('min-w-0 text-[26px] font-medium tracking-[-0.02em]', headerText)}>
            {planName}
          </h3>
          {badge && (
            <Chip dot size="sm" color="success" variant="soft" className="shrink-0">
              {badge}
            </Chip>
          )}
        </div>

        <div className="flex items-end gap-1">
          <span
            className="bg-clip-text text-[40px] font-semibold leading-none tracking-[-0.03em] text-transparent tabular-nums"
            style={{ backgroundImage: 'linear-gradient(150deg, var(--color-sky-400) 20%, var(--color-blue-600) 100%)' }}
          >
            {currency}{price}
          </span>
          {period && <span className={cn('text-[14px]', unitText)}>{period}</span>}
        </div>

        {description && (
          <p className={cn('text-[13.5px] leading-relaxed text-pretty', descText)}>
            {description}
          </p>
        )}
      </div>

      {highlighted ? (
        <GlowButton
          fullWidth
          size="lg"
          slideIcon
          iconPosition="right"
          icon={<HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2.5} color="currentColor" />}
          onClick={onCta}
        >
          {ctaLabel}
        </GlowButton>
      ) : (
        <Button
          fullWidth
          size="lg"
          variant="soft"
          slideIcon
          iconPosition="right"
          icon={<HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2.5} color="currentColor" />}
          onClick={onCta}
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  )

  const featureList = (
    <ul className={cn('flex w-full flex-col gap-2.5', isFramed ? 'p-4' : 'px-5 pb-5')}>
      {features.map((f, i) => <FeatureRow key={i} feature={f} invert={!isFramed && highlighted} />)}
    </ul>
  )

  // Layered transparent shadow for elevation (not the border) - the border
  // stays purely structural, tracing the card's edge.
  const elevation = 'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_-8px_rgba(0,0,0,0.10)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-8px_rgba(0,0,0,0.5)]'

  if (isFramed) {
    return (
      <Surface
        radius={28}
        smoothing={0.6}
        lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border, rgb(138 138 141 / 0.23))' } }}
        // An explicit pixel width, not `w-full max-w-[…]`. The squircle
        // clip-path measures the box before a relative width has resolved in
        // this flex-centred layout, so cards with different CTA labels end up
        // different widths. `max-w-full` keeps it responsive on narrow screens.
        className={cn('flex w-[280px] max-w-full flex-col gap-0 bg-zinc-50 p-1 dark:bg-zinc-950', elevation, className)}
      >
        {header}
        {featureList}
      </Surface>
    )
  }

  return (
    <Surface
      radius={28}
      smoothing={0.6}
      lisse={{ middleBorder: { width: 1, opacity: 1, color: highlighted ? 'rgb(0 0 0 / 40%)' : 'var(--ui-border, rgb(138 138 141 / 0.23))' } }}
      // Same explicit width as the "framed" branch above, for the same reason.
      className={cn('flex w-[280px] max-w-full flex-col gap-0 overflow-hidden', headerBg, elevation, className)}
    >
      {header}
      {featureList}
    </Surface>
  )
}
