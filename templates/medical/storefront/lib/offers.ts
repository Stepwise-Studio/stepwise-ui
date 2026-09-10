/**
 * Offers.
 *
 * PLACEHOLDER CONTENT — every code, headline and condition here is invented for
 * the template and is listed in COPY-TODO.md.
 *
 * Offers are static template data rather than a data-layer call, because the
 * contract does not model promotions: Medusa promotions are a stock feature and
 * the backend agent is not building a custom route for them. When promotions
 * are wired up, this file becomes a `getOffers()` in `lib/medusa/client.ts`
 * reading `sdk.store.*`, and the two consumers below stop importing it
 * directly.
 */

export type Offer = {
  id       : string
  /** 'feature' gets the large cell on the homepage and the wide card on /offers. */
  size     : 'feature' | 'standard'
  tone     : 'coral' | 'cobalt' | 'botanical'
  title    : string
  body     : string
  code     : string
  terms    : string
  href     : string
}

export const OFFERS: Offer[] = [
  {
    id   : 'offer_first_order',
    size : 'feature',
    tone : 'coral',
    title: '15% off your first order',
    body : 'New here? Take 15% off anything in the catalogue, prescription medicines included.',
    code : 'FIRST15',
    terms: 'One use per customer. Maximum discount ₹300. Cannot be combined with other offers.',
    href : '/medicines',
  },
  {
    id   : 'offer_free_delivery',
    size : 'standard',
    tone : 'cobalt',
    title: 'Free delivery over ₹499',
    body : 'Applied automatically at checkout. No code needed.',
    code : 'AUTOMATIC',
    terms: 'Standard delivery only. Cold-chain items are excluded.',
    href : '/medicines',
  },
  {
    id   : 'offer_repeat',
    size : 'standard',
    tone : 'botanical',
    title: '10% off repeat medicines',
    body : 'Set a monthly refill on anything you take regularly and the price drops.',
    code : 'REFILL10',
    terms: 'Applies from the second delivery onwards. Cancel a refill at any time.',
    href : '/medicines',
  },
  {
    id   : 'offer_vitamins',
    size : 'standard',
    tone : 'coral',
    title: 'Buy two vitamins, get the third free',
    body : 'Across the whole Vitamins & Supplements range, cheapest item free.',
    code : 'VITA3',
    terms: 'Applies to ACME vitamins only. While stocks last.',
    href : '/medicines?category=vitamins-supplements',
  },
]
