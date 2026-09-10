import { AbstractPaymentProvider, MedusaError, BigNumber } from '@medusajs/framework/utils'
import type { Logger } from '@medusajs/framework/types'
import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from '@medusajs/framework/types'

import { fromMinorUnit, mapStatus, toMinorUnit, verifyWebhookSignature } from './lib'

export type RazorpayOptions = {
  keyId?: string
  keySecret?: string
  webhookSecret?: string
  /** Razorpay API base. Overridable so tests can point at a stub. */
  apiBase?: string
}

const API_BASE = 'https://api.razorpay.com/v1'

/**
 * Razorpay payment provider.
 *
 * Written in-house rather than pulled from a plugin: every published Razorpay
 * plugin for Medusa v2 is either a beta pinned to an older core or unmaintained
 * (see CONTRACT.md). This talks to Razorpay's REST API directly — no SDK
 * dependency, no version skew.
 *
 * Boots without keys. Every call that needs the API asserts configuration first,
 * so a keyless dev environment starts fine and fails loudly only if used.
 */
export default class RazorpayProviderService extends AbstractPaymentProvider<RazorpayOptions> {
  static identifier = 'razorpay'

  /** Deliberately permissive: a keyless dev/CI boot must not crash. */
  static validateOptions(_options: Record<string, unknown>): void {
    // no-op
  }

  protected options_: RazorpayOptions
  protected logger_: Logger

  constructor(container: { logger: Logger }, options: RazorpayOptions) {
    super(container, options)
    this.options_ = options ?? {}
    this.logger_ = container.logger

    if (!this.options_.keyId || !this.options_.keySecret) {
      this.logger_?.warn(
        '[razorpay] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set — provider is registered but will refuse to transact.'
      )
    }
  }

  private get configured(): boolean {
    return Boolean(this.options_.keyId && this.options_.keySecret)
  }

  /**
   * The message on this error reaches the shopper's screen, so it says what a
   * shopper can act on and nothing else. The part an operator needs - which two
   * environment variables are missing - goes to the log, where it belongs: a
   * customer cannot set an API key, and naming internal config in a checkout
   * error only tells a stranger what this server is missing.
   */
  private assertConfigured(): void {
    if (!this.configured) {
      this.logger_?.error(
        '[razorpay] Refused a payment call: RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set.'
      )
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Card and UPI payments are unavailable right now. Please choose another payment method or try again shortly.',
        'razorpay_not_configured'
      )
    }
  }

  private async request<T = any>(
    path: string,
    init: { method?: string; body?: Record<string, unknown> } = {}
  ): Promise<T> {
    this.assertConfigured()
    const auth = Buffer.from(
      `${this.options_.keyId}:${this.options_.keySecret}`
    ).toString('base64')

    const res = await fetch(`${this.options_.apiBase ?? API_BASE}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
    })

    const payload = await res.json().catch(() => ({}))
    if (!res.ok) {
      const description =
        (payload as any)?.error?.description ?? `Razorpay request failed (${res.status})`
      throw new MedusaError(MedusaError.Types.INVALID_DATA, description, 'razorpay_error')
    }
    return payload as T
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, context } = input

    const order = await this.request('/orders', {
      method: 'POST',
      body: {
        amount: toMinorUnit(amount as any, currency_code),
        currency: currency_code.toUpperCase(),
        // Razorpay dedupes on receipt; the session id keeps retries idempotent.
        receipt: (context as any)?.idempotency_key ?? undefined,
        notes: {
          customer_id: (context as any)?.customer?.id ?? '',
          email: (context as any)?.customer?.email ?? '',
        },
      },
    })

    return {
      id: order.id,
      data: {
        // `data` is public to the storefront — key_id is the publishable half only.
        razorpay_order_id: order.id,
        key_id: this.options_.keyId,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
      },
    }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    // Razorpay orders are immutable once created, so an amount change means a
    // fresh order. Same shape as initiate.
    return this.initiatePayment(input as unknown as InitiatePaymentInput)
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    const data = (input.data ?? {}) as Record<string, any>
    const paymentId = data.razorpay_payment_id

    if (!paymentId) {
      // Customer hasn't completed Razorpay checkout yet.
      return { status: 'pending', data }
    }

    const payment = await this.request(`/payments/${paymentId}`)
    return {
      status: mapStatus(payment.status),
      data: { ...data, ...payment },
    }
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    const data = (input.data ?? {}) as Record<string, any>
    const paymentId = data.razorpay_payment_id ?? data.id

    if (!paymentId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Cannot capture: no razorpay_payment_id on the payment.',
        'razorpay_error'
      )
    }

    // Already captured — Razorpay errors on a double capture, so short-circuit.
    if (data.status === 'captured') {
      return { data }
    }

    const currency = (data.currency ?? 'INR') as string
    const payment = await this.request(`/payments/${paymentId}/capture`, {
      method: 'POST',
      body: {
        amount: data.amount ?? toMinorUnit(data.amount_major ?? 0, currency),
        currency: currency.toUpperCase(),
      },
    })

    return { data: { ...data, ...payment } }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const data = (input.data ?? {}) as Record<string, any>
    const paymentId = data.razorpay_payment_id ?? data.id
    const currency = (data.currency ?? 'INR') as string

    if (!paymentId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Cannot refund: no razorpay_payment_id on the payment.',
        'razorpay_error'
      )
    }

    const refund = await this.request(`/payments/${paymentId}/refunds`, {
      method: 'POST',
      body: { amount: toMinorUnit(input.amount as any, currency) },
    })

    return { data: { ...data, refund } }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    // Razorpay has no "cancel order" API — an unpaid order simply expires.
    // An already-authorized-but-uncaptured payment is voided by refunding it.
    const data = (input.data ?? {}) as Record<string, any>
    if (data.razorpay_payment_id && data.status === 'authorized') {
      await this.request(`/payments/${data.razorpay_payment_id}/refunds`, {
        method: 'POST',
        body: {},
      })
    }
    return { data }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return this.cancelPayment(input as unknown as CancelPaymentInput)
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    const data = (input.data ?? {}) as Record<string, any>
    const paymentId = data.razorpay_payment_id
    const orderId = data.razorpay_order_id

    if (paymentId) {
      return (await this.request(`/payments/${paymentId}`)) as RetrievePaymentOutput
    }
    if (orderId) {
      return (await this.request(`/orders/${orderId}`)) as RetrievePaymentOutput
    }
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      'No Razorpay order or payment id on the session.',
      'razorpay_error'
    )
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    const data = (input.data ?? {}) as Record<string, any>
    const paymentId = data.razorpay_payment_id
    const orderId = data.razorpay_order_id

    if (!paymentId && !orderId) {
      return { status: 'pending', data }
    }

    const remote = paymentId
      ? await this.request(`/payments/${paymentId}`)
      : await this.request(`/orders/${orderId}`)

    return { status: mapStatus(remote.status), data: { ...data, ...remote } }
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload['payload']
  ): Promise<WebhookActionResult> {
    const signature = (payload.headers?.['x-razorpay-signature'] ??
      payload.headers?.['X-Razorpay-Signature']) as string | undefined

    if (
      !verifyWebhookSignature(
        payload.rawData as Buffer,
        signature,
        this.options_.webhookSecret ?? ''
      )
    ) {
      // Unsigned or forged. Never act on it.
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        'Invalid Razorpay webhook signature.',
        'razorpay_invalid_signature'
      )
    }

    const body = payload.data as Record<string, any>
    const entity = body?.payload?.payment?.entity ?? {}
    const sessionId = entity.order_id
    const currency = (entity.currency ?? 'INR') as string
    const amount = new BigNumber(fromMinorUnit(Number(entity.amount ?? 0), currency))

    switch (body?.event) {
      case 'payment.authorized':
        return { action: 'authorized', data: { session_id: sessionId, amount } }
      case 'payment.captured':
      case 'order.paid':
        return { action: 'captured', data: { session_id: sessionId, amount } }
      case 'payment.failed':
        return { action: 'failed', data: { session_id: sessionId, amount } }
      default:
        return { action: 'not_supported', data: { session_id: sessionId ?? '', amount } }
    }
  }
}
