/**
 * The only place a number becomes currency.
 *
 * Amounts travel as minor units (paise) everywhere else - see the note at the
 * top of `lib/medusa/types.ts`. `Intl` is pinned to `en-IN` so grouping follows
 * the Indian system (₹1,23,456, not ₹123,456) regardless of the visitor's
 * locale, because the price on the label is an Indian rupee price.
 */

/* Indian retail prices whole rupees, so a round amount must not print "₹32.00".
 * But rounding is the wrong way to get there: ₹85.50 rendered as "₹86" puts a
 * price on the label that is not the price at the till, and the cart totals the
 * real paise, so the two visibly disagree. Whole amounts drop the decimals,
 * anything carrying paise shows them. */
const whole = new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR',
  minimumFractionDigits: 0, maximumFractionDigits: 0,
})
const exact = new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR',
  minimumFractionDigits: 2, maximumFractionDigits: 2,
})

/** 3200 → "₹32"; 8550 → "₹85.50". Never rounds a price away from what is charged. */
export function formatINR(minorUnits: number) {
  const paise = Math.round(minorUnits)
  return paise % 100 === 0
    ? whole.format(paise / 100)
    : exact.format(paise / 100)
}
