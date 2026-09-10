import crypto from 'crypto'

/**
 * Medusa hands payment providers a *decimal, major-unit* amount (149.5 = ₹149.50),
 * the same convention `@medusajs/payment-stripe` converts from. Razorpay wants
 * an integer in the currency's minor unit (paise for INR).
 *
 * Zero-decimal currencies are the exception Razorpay shares with Stripe.
 */
const ZERO_DECIMAL = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
  'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF',
])

export function toMinorUnit(amount: number | string, currencyCode: string): number {
  const multiplier = ZERO_DECIMAL.has(currencyCode.toUpperCase()) ? 1 : 100
  // `1.005 * 100` is 100.49999999999999 in IEEE-754, so a bare Math.round
  // silently drops a paisa. toFixed collapses the representation error first.
  // (Medusa's own Stripe provider does not do this; on a money path we do.)
  return Math.round(Number((Number(amount) * multiplier).toFixed(6)))
}

export function fromMinorUnit(minor: number, currencyCode: string): number {
  const multiplier = ZERO_DECIMAL.has(currencyCode.toUpperCase()) ? 1 : 100
  return minor / multiplier
}

/**
 * Razorpay signs webhooks with HMAC-SHA256 over the *raw* request body.
 * Constant-time compare — a fast `===` here leaks the signature byte by byte.
 */
export function verifyWebhookSignature(
  rawBody: Buffer | string,
  signature: string | undefined,
  secret: string
): boolean {
  if (!signature || !secret) {
    return false
  }
  const expected = crypto
    .createHmac('sha256', secret)
    .update(Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody, 'utf-8'))
    .digest('hex')

  const a = Buffer.from(expected, 'utf-8')
  const b = Buffer.from(signature, 'utf-8')
  if (a.length !== b.length) {
    return false
  }
  return crypto.timingSafeEqual(a, b)
}

/** Razorpay payment/order status -> Medusa PaymentSessionStatus */
export function mapStatus(
  razorpayStatus: string | undefined
): 'pending' | 'authorized' | 'captured' | 'canceled' | 'error' {
  switch (razorpayStatus) {
    case 'authorized':
      return 'authorized'
    case 'captured':
    case 'paid':
      return 'captured'
    case 'failed':
      return 'error'
    case 'refunded':
      return 'canceled'
    case 'created':
    case 'attempted':
    default:
      return 'pending'
  }
}
