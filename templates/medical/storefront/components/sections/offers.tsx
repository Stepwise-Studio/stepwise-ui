import { OfferCard } from '@/components/site/offer-card'
import { Container, Section, SectionHeading } from '@/components/site/section'
import { OFFERS } from '@/lib/offers'

/**
 * Offers / Deals — Section 08.
 *
 * PLACEHOLDER COPY — see COPY-TODO.md.
 *
 * One feature coupon and two standard ones, on an asymmetric grid. Three equal
 * tiles is the shape this section takes on every pharmacy site on the internet;
 * the feature carries the offer worth arriving for and the other two sit beside
 * it as a stack.
 */
export function Offers() {
  const [feature, ...rest] = OFFERS

  return (
    <Section id="offers">
      <Container>
        <SectionHeading
          title="Worth knowing about"
          support="A few standing offers. No countdown timers, no fake urgency."
          action={{ label: 'See all offers', href: '/offers' }}
        />

        <div className="squircle-fill mt-10 grid gap-4 lg:mt-12 lg:grid-cols-[1.15fr_1fr] lg:gap-5">
          <OfferCard offer={feature} />
          <div className="squircle-fill grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
            {rest.slice(0, 2).map(o => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
