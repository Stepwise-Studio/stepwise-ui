import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { Surface } from '@/components/stepwise/primitives/surface'
import { cn } from '@/lib/utils/cn'
import type { Offer } from '@/lib/offers'

/**
 * An offer, as a printed coupon.
 *
 * Two footprints: `feature` fills the tone with flat ink and sets the headline
 * large, `standard` stays on paper with the tone as a hairline and an accent.
 * A page of coupons that all look the same is the thing to avoid, so the two
 * are genuinely different objects rather than one card at two sizes.
 *
 * The code is set in tabular figures with letter-spacing - it exists to be read
 * out loud and typed, which is a different job from the rest of the type here.
 */

/**
 * A filled coupon prints ink on the flat colour, not white on it.
 *
 * That is what a riso does, and it is also what the contrast maths wants:
 * white on `amber-500` is about 2.6:1, which fails at every text size. Deep
 * navy on the same coral is 5.8:1 and passes for body copy. Cobalt and
 * botanical are dark enough to carry white, so they keep it. `ink` names which
 * way round each tone runs; `inkSoft` and `inkFaint` are tints of that same ink
 * for the supporting lines, so a filled card never mixes two text colours.
 *
 * These are fixed against the fill, not the theme: the coral stays coral in
 * dark mode, so its ink has to stay navy there too.
 *
 * The tint floor is not a taste call. Measured against each rendered fill, the
 * minimum ink opacity that still clears 4.5:1 is:
 *
 *     coral      rgb(233,113,51)   zinc-900   5.80:1 at full   floor 82%
 *     cobalt     rgb(27,75,169)    white      8.00:1 at full   floor 67%
 *     botanical  rgb(33,102,64)    white      6.91:1 at full   floor 73%
 *
 * So every tone uses the same two tints - 90% and 85% - which sit above the
 * worst case (coral) and therefore pass on all three. Hierarchy between the
 * body line and the terms line is carried by size and position, not by fading
 * the ink further: on a mid-luminance fill a third, fainter tint cannot exist
 * without failing. Do not reintroduce one.
 */
const TONE = {
  coral: {
    fill    : 'bg-amber-500',
    ink     : 'text-zinc-900',
    inkSoft : 'text-zinc-900/90',
    inkFaint: 'text-zinc-900/85',
    pill    : 'bg-zinc-900/12 text-zinc-900',
    ring    : 'focus-visible:ring-zinc-900',
    quiet   : 'text-amber-600 dark:text-amber-400',
    edge    : 'oklch(0.680 0.166 45 / 0.4)',
  },
  cobalt: {
    fill    : 'bg-sky-700',
    ink     : 'text-white',
    inkSoft : 'text-white/90',
    inkFaint: 'text-white/85',
    pill    : 'bg-white/20 text-white',
    ring    : 'focus-visible:ring-white',
    quiet   : 'text-sky-600 dark:text-sky-400',
    edge    : 'oklch(0.520 0.180 262 / 0.4)',
  },
  botanical: {
    fill    : 'bg-green-600',
    ink     : 'text-white',
    inkSoft : 'text-white/90',
    inkFaint: 'text-white/85',
    pill    : 'bg-white/20 text-white',
    ring    : 'focus-visible:ring-white',
    quiet   : 'text-green-600 dark:text-green-500',
    edge    : 'oklch(0.455 0.092 156 / 0.4)',
  },
} as const

export function OfferCard({ offer, className }: { offer: Offer; className?: string }) {
  const tone = TONE[offer.tone]
  const featured = offer.size === 'feature'

  return (
    <Surface
      radius={22}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden',
        featured ? [tone.fill, tone.ink] : 'bg-[var(--surface-raised)]',
        featured ? 'p-7 sm:p-9' : 'p-6',
        className,
      )}
      lisse={{
        middleBorder: {
          width  : 1,
          opacity: 1,
          color  : featured ? 'oklch(0 0 0 / 0.16)' : tone.edge,
        },
      }}
    >
      <h3
        className={cn(
          'text-balance font-semibold tracking-[-0.035em]',
          featured
            ? 'max-w-[16rem] text-[28px] leading-[1.1] sm:text-[36px]'
            : 'text-[19px] leading-[1.15] text-zinc-800 dark:text-zinc-100',
        )}
      >
        {offer.title}
      </h3>

      <p
        className={cn(
          'mt-2.5 max-w-[26rem] text-pretty text-[14px] leading-relaxed',
          featured ? tone.inkSoft : 'text-zinc-500 dark:text-zinc-400',
        )}
      >
        {offer.body}
      </p>

      <div className="mt-auto pt-6">
        <div className="flex flex-wrap items-center gap-3">
          {offer.code !== 'AUTOMATIC' ? (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-semibold tabular-nums tracking-[0.08em]',
                featured
                  ? tone.pill
                  : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200',
              )}
            >
              {offer.code}
            </span>
          ) : (
            /* Not a link, and must not read as one - this offer has no code
               to copy, so it gets the card's own muted ink, never the accent. */
            <span className={cn('text-[12px] font-medium', featured ? tone.inkSoft : 'text-zinc-500 dark:text-zinc-400')}>
              Applied automatically
            </span>
          )}

          <Link
            href={offer.href}
            className={cn(
              'inline-flex items-center gap-1.5 text-[14px] font-medium outline-none',
              'transition-colors duration-[--duration-quick] ease-[--ease-out]',
              featured ? cn(tone.ink, 'hover:opacity-80') : tone.quiet,
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
              featured ? tone.ring : 'focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400',
            )}
          >
            <span className="absolute inset-0" aria-hidden="true" />
            Shop this offer
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={15}
              strokeWidth={2}
              color="currentColor"
              className="transition-transform duration-[--duration-fast] ease-[--ease-smooth-out] group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
          </Link>
        </div>

        <p
          className={cn(
            'mt-4 max-w-[28rem] text-pretty text-[12px] leading-relaxed',
            featured ? tone.inkFaint : 'text-zinc-400 dark:text-zinc-500',
          )}
        >
          {offer.terms}
        </p>
      </div>
    </Surface>
  )
}
