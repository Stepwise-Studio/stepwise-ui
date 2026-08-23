'use client'

import { cn } from '@/lib/utils/cn'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Button } from '@/components/stepwise/button'

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
  /** "Most popular" treatment — accent border, glow, solid CTA. */
  highlighted?: boolean
  /** Small chip above the plan name, e.g. "Most popular". Implies highlighted styling on the chip itself either way. */
  badge?      : string
  className?  : string
}

function CheckIcon({ muted }: { muted?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={cn('shrink-0', muted ? 'text-zinc-300 dark:text-zinc-700' : 'text-emerald-500')}>
      <path d="M2.5 7.2 5.4 10 11.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
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
  return (
    <div className={cn('relative w-[300px]', className)}>
      {highlighted && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 left-1/2 h-32 w-56 -translate-x-1/2 rounded-full bg-sky-400/25 blur-3xl dark:bg-sky-500/20"
        />
      )}
      <Surface
        radius={24}
        lisse={{ middleBorder: { width: highlighted ? 1.5 : 1, opacity: 1, color: highlighted ? 'rgb(2 132 199 / 50%)' : 'var(--ui-border)' } }}
        className={cn(
          'relative w-full overflow-hidden bg-white p-6 dark:bg-zinc-900',
          highlighted && 'shadow-[0_8px_32px_-12px_rgba(2,132,199,0.35)]',
        )}
      >
        {badge && (
          <span className="mb-3 inline-flex w-fit items-center rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold tracking-[-0.01em] text-sky-600 dark:bg-sky-400/10 dark:text-sky-400">
            {badge}
          </span>
        )}

        <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-white">
          {planName}
        </h3>
        {description && (
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400 [text-wrap:pretty]">
            {description}
          </p>
        )}

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-[15px] font-semibold text-zinc-400 dark:text-zinc-500">{currency}</span>
          <span className="text-[38px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-zinc-900 dark:text-white">
            {price}
          </span>
          {period && <span className="text-[13px] text-zinc-400 dark:text-zinc-500">{period}</span>}
        </div>

        <Button
          fullWidth
          variant={highlighted ? 'solid' : 'soft'}
          className="mt-5"
          onClick={onCta}
        >
          {ctaLabel}
        </Button>

        <ul className="mt-6 flex flex-col gap-3">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-[3px]"><CheckIcon muted={f.included === false} /></span>
              <span className={cn(
                'text-[13px] leading-snug tracking-[-0.01em]',
                f.included === false
                  ? 'text-zinc-300 line-through dark:text-zinc-700'
                  : 'text-zinc-600 dark:text-zinc-300',
              )}>
                {f.label}
              </span>
            </li>
          ))}
        </ul>
      </Surface>
    </div>
  )
}
