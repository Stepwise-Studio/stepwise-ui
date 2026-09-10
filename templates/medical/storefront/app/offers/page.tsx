import type { Metadata } from 'next'
import { OfferCard } from '@/components/site/offer-card'
import { Container } from '@/components/site/section'
import { OFFERS } from '@/lib/offers'

export const metadata: Metadata = {
  title      : 'Offers',
  description: 'Standing offers on medicines, vitamins and delivery.',
}

/**
 * Offers.
 *
 * PLACEHOLDER COPY — see COPY-TODO.md.
 *
 * The feature coupon runs full width and the rest sit in a two-column grid
 * below it, so the page has a clear first thing to read rather than a wall of
 * equal tiles.
 */
export default function OffersPage() {
  const [feature, ...rest] = OFFERS

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <header className="max-w-[34rem]">
          <h1 className="text-balance text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] text-zinc-800 dark:text-zinc-100 sm:text-[38px]">
            Offers
          </h1>
          <p className="mt-3 text-pretty text-[15px] leading-[1.6] text-zinc-500 dark:text-zinc-400">
            Standing offers, with the conditions written out. Nothing expires in
            the next four minutes.
          </p>
        </header>

        <div className="squircle-fill mt-9 grid gap-4 lg:gap-5">
          <OfferCard offer={feature} />
          <div className="squircle-fill grid gap-4 sm:grid-cols-2 lg:gap-5">
            {rest.map(o => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
