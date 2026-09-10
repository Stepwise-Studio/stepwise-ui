import crypto from 'crypto'

import { fromMinorUnit, mapStatus, toMinorUnit, verifyWebhookSignature } from '../lib'
import RazorpayProviderService from '../service'

describe('razorpay minor units', () => {
  // The money assumption this whole provider rests on: Medusa hands providers a
  // DECIMAL major-unit amount (₹149.50 arrives as 149.5), Razorpay wants paise.
  it('converts rupees to paise', () => {
    expect(toMinorUnit(149.5, 'inr')).toBe(14950)
    expect(toMinorUnit(32, 'INR')).toBe(3200)
    expect(toMinorUnit(85.5, 'inr')).toBe(8550)
    expect(toMinorUnit('299.00', 'inr')).toBe(29900)
  })

  it('does not lose a paisa to float noise', () => {
    // 0.1 + 0.2 === 0.30000000000000004
    expect(toMinorUnit(0.1 + 0.2, 'inr')).toBe(30)
    expect(toMinorUnit(1.005, 'inr')).toBe(101)
    expect(toMinorUnit(19.99, 'inr')).toBe(1999)
  })

  it('round-trips', () => {
    for (const amount of [0, 1, 18, 32, 85.5, 299, 12345.67]) {
      expect(fromMinorUnit(toMinorUnit(amount, 'inr'), 'inr')).toBeCloseTo(amount, 2)
    }
  })

  it('respects zero-decimal currencies', () => {
    expect(toMinorUnit(1500, 'JPY')).toBe(1500)
    expect(fromMinorUnit(1500, 'jpy')).toBe(1500)
  })
})

describe('razorpay webhook signature', () => {
  const secret = 'whsec_test'
  const body = JSON.stringify({
    event: 'payment.captured',
    payload: { payment: { entity: { order_id: 'order_x', amount: 3200, currency: 'INR' } } },
  })
  const sign = (b: string, s: string) =>
    crypto.createHmac('sha256', s).update(Buffer.from(b, 'utf-8')).digest('hex')

  it('accepts a correctly signed body', () => {
    expect(verifyWebhookSignature(body, sign(body, secret), secret)).toBe(true)
  })

  it('rejects a tampered body', () => {
    const signature = sign(body, secret)
    expect(verifyWebhookSignature(body.replace('3200', '1'), signature, secret)).toBe(false)
  })

  it('rejects a signature from the wrong secret', () => {
    expect(verifyWebhookSignature(body, sign(body, 'other'), secret)).toBe(false)
  })

  it('rejects a missing signature or missing secret', () => {
    expect(verifyWebhookSignature(body, undefined, secret)).toBe(false)
    expect(verifyWebhookSignature(body, sign(body, secret), '')).toBe(false)
  })
})

describe('razorpay status mapping', () => {
  it('maps razorpay statuses onto Medusa session statuses', () => {
    expect(mapStatus('authorized')).toBe('authorized')
    expect(mapStatus('captured')).toBe('captured')
    expect(mapStatus('paid')).toBe('captured')
    expect(mapStatus('failed')).toBe('error')
    expect(mapStatus('created')).toBe('pending')
    expect(mapStatus(undefined)).toBe('pending')
  })
})

describe('razorpay provider without keys', () => {
  const make = (options: Record<string, any> = {}) =>
    new (RazorpayProviderService as any)(
      { logger: { warn: jest.fn(), info: jest.fn(), error: jest.fn() } },
      options
    ) as RazorpayProviderService

  it('constructs and validates options with no keys — the app must still boot', () => {
    expect(() => RazorpayProviderService.validateOptions({})).not.toThrow()
    expect(() => make()).not.toThrow()
  })

  it('refuses to transact rather than calling Razorpay unauthenticated', async () => {
    const provider = make()
    await expect(
      provider.initiatePayment({ amount: 32, currency_code: 'inr', data: {} } as any)
    ).rejects.toMatchObject({ code: 'razorpay_not_configured' })
  })

  it('throws on an unsigned webhook instead of trusting it', async () => {
    const provider = make({ webhookSecret: 'whsec_test' })
    await expect(
      provider.getWebhookActionAndData({
        data: { event: 'payment.captured' },
        rawData: Buffer.from('{}'),
        headers: {},
      } as any)
    ).rejects.toMatchObject({ code: 'razorpay_invalid_signature' })
  })

  it('reads a signed webhook back in major units', async () => {
    const provider = make({ webhookSecret: 'whsec_test' })
    const raw = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: { entity: { order_id: 'order_x', amount: 3200, currency: 'INR' } },
      },
    })
    const signature = crypto
      .createHmac('sha256', 'whsec_test')
      .update(Buffer.from(raw, 'utf-8'))
      .digest('hex')

    const result = await provider.getWebhookActionAndData({
      data: JSON.parse(raw),
      rawData: Buffer.from(raw, 'utf-8'),
      headers: { 'x-razorpay-signature': signature },
    } as any)

    expect(result.action).toBe('captured')
    expect(result.data!.session_id).toBe('order_x')
    // 3200 paise back to ₹32 — Medusa's own unit.
    expect(Number(result.data!.amount)).toBe(32)
  })
})
