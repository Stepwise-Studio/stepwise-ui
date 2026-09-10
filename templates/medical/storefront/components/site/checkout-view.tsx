'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Alert02Icon, CheckmarkCircle02Icon, CreditCardIcon, RupeeCircleIcon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/components/stepwise/button'
import { Input } from '@/components/stepwise/input'
import { Surface } from '@/components/stepwise/primitives/surface'
import { formatINR } from '@/lib/format'
import { useCart } from '@/lib/use-cart'
import { cn } from '@/lib/utils/cn'
import {
  getPaymentProviders, placeOrder, readableError,
  type PaymentProvider,
} from '@/lib/medusa/client'

/**
 * Checkout — up to the handoff, and no further.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  Submit runs `placeOrder` in `lib/medusa/client.ts`: address → shipping
 *  method → payment session → `POST /store/carts/:id/complete`.
 *
 *  The prescription gate is enforced in that last call, server-side. This
 *  screen mirrors it (the button is disabled with the reason stated), but a
 *  400 `{ code: 'prescription_required' }` can still come back - a race, or a
 *  prescription rejected between two steps - and is shown as its own message.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Payment providers come from the region. Only the icon is decided here. */
const PROVIDER_ICON: Record<string, typeof CreditCardIcon> = {
  pp_stripe_stripe: CreditCardIcon,
}

export function CheckoutView() {
  const { cart, needsPrescription, gateCleared, refresh } = useCart()
  const router = useRouter()

  const [providers, setProviders] = useState<PaymentProvider[]>([])
  const [payment, setPayment]     = useState<string>('')
  const [placing, setPlacing]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [orderId, setOrderId]     = useState<string | null>(null)

  useEffect(() => {
    let live = true
    void getPaymentProviders()
      .then(list => {
        if (!live) return
        setProviders(list)
        setPayment(p => p || list[0]?.id || '')
      })
      .catch(() => { if (live) setError('We could not load the payment options. Reload and try again.') })
    return () => { live = false }
  }, [])

  async function submit(form: HTMLFormElement) {
    const f = new FormData(form)
    setPlacing(true)
    setError(null)
    try {
      const { orderId } = await placeOrder({
        name      : String(f.get('name') ?? ''),
        email     : String(f.get('email') ?? ''),
        phone     : String(f.get('phone') ?? ''),
        address   : String(f.get('address') ?? ''),
        city      : String(f.get('city') ?? ''),
        pin       : String(f.get('pin') ?? ''),
        providerId: payment,
      })
      setOrderId(orderId)
      refresh()
      router.refresh()
    } catch (err) {
      // Includes the prescription gate: the server's own sentence is the one
      // worth reading, so it is shown verbatim rather than replaced.
      setError(readableError(err))
    } finally {
      setPlacing(false)
    }
  }

  if (orderId) return <Placed orderId={orderId} />

  if (!cart) {
    return <div aria-hidden="true" className="h-[420px] animate-pulse bg-zinc-200/50 dark:bg-zinc-900" />
  }

  if (cart.items.length === 0) {
    return (
      <Surface
        radius={24}
        className="flex flex-col items-start gap-4 bg-[var(--surface-raised)] p-8"
        lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
      >
        <h2 className="text-[19px] font-semibold tracking-[-0.03em] text-zinc-800 dark:text-zinc-100">
          There is nothing to check out
        </h2>
        <p className="text-[14.5px] text-zinc-500 dark:text-zinc-400">
          Your cart is empty.
        </p>
        <Button href="/medicines" size="lg">Browse medicines</Button>
      </Surface>
    )
  }

  return (
    <form
      className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12"
      onSubmit={e => {
        e.preventDefault()
        void submit(e.currentTarget)
      }}
    >
      <div className="flex max-w-[34rem] flex-col gap-10">
        <fieldset>
          <legend className="text-[17px] font-semibold tracking-[-0.03em] text-zinc-800 dark:text-zinc-100">
            Where should it go?
          </legend>
          <div className="mt-5 flex flex-col gap-4">
            <Input name="name" variant="name" label="Full name" placeholder="Name for the delivery" required autoComplete="name" />
            <Input name="email" variant="email" label="Email" required autoComplete="email" />
            <Input name="phone" label="Phone" placeholder="10-digit mobile number" required inputMode="numeric" autoComplete="tel" />
            <Input name="address" label="Address" placeholder="Flat, building, street" required autoComplete="street-address" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="city" label="City" required autoComplete="address-level2" />
              <Input name="pin" label="PIN code" placeholder="6 digits" required inputMode="numeric" autoComplete="postal-code" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-[17px] font-semibold tracking-[-0.03em] text-zinc-800 dark:text-zinc-100">
            How would you like to pay?
          </legend>
          {/* A real radio group: arrow keys move between options, and the
              selected one is announced. The Surface is the visual; the input
              underneath it is the control. */}
          <div role="radiogroup" aria-label="Payment method" className="mt-5 flex flex-col gap-3">
            {providers.map(p => {
              const active = payment === p.id
              const Icon = PROVIDER_ICON[p.id] ?? RupeeCircleIcon
              return (
                <Surface
                  key={p.id}
                  radius={18}
                  className={cn(
                    'transition-colors duration-[--duration-quick] ease-[--ease-out]',
                    active ? 'bg-sky-50 dark:bg-sky-500/10' : 'bg-[var(--surface-raised)]',
                  )}
                  lisse={{
                    middleBorder: {
                      width  : active ? 1.5 : 1,
                      opacity: 1,
                      color  : active ? 'var(--ui-border-focus)' : 'var(--ui-border)',
                    },
                  }}
                >
                  <label className="flex cursor-pointer items-center gap-3.5 p-4">
                    <input
                      type="radio"
                      name="payment"
                      value={p.id}
                      checked={active}
                      onChange={() => setPayment(p.id)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full',
                        'ring-1 ring-inset transition-colors duration-[--duration-quick]',
                        active ? 'bg-sky-600 ring-sky-600 dark:bg-sky-500 dark:ring-sky-500' : 'ring-zinc-300 dark:ring-zinc-600',
                        'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-transparent',
                      )}
                    >
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    <HugeiconsIcon
                      icon={Icon}
                      size={20}
                      strokeWidth={1.8}
                      color="currentColor"
                      className={active ? 'text-sky-600 dark:text-sky-400' : 'text-zinc-400 dark:text-zinc-500'}
                    />
                    <span className="flex flex-col">
                      <span className="text-[14.5px] font-medium tracking-[-0.02em] text-zinc-800 dark:text-zinc-100">
                        {p.label}
                      </span>
                      <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400">{p.detail}</span>
                    </span>
                  </label>
                </Surface>
              )
            })}
          </div>
        </fieldset>
      </div>

      {/* ── Summary ── */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <Surface
          radius={24}
          className="flex flex-col gap-4 bg-[var(--surface-raised)] p-6"
          lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
        >
          <h2 className="text-[16px] font-semibold tracking-[-0.03em] text-zinc-800 dark:text-zinc-100">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
          </h2>

          <ul className="flex flex-col gap-2.5 border-b border-[var(--ui-border-subtle)] pb-4 text-[13.5px]">
            {cart.items.map(i => (
              <li key={i.id} className="flex justify-between gap-3">
                <span className="min-w-0 truncate text-zinc-600 dark:text-zinc-300">
                  {i.name} <span className="tabular-nums text-zinc-400 dark:text-zinc-500">× {i.quantity}</span>
                </span>
                <span className="shrink-0 tabular-nums text-zinc-700 dark:text-zinc-200">
                  {formatINR(i.unitPrice * i.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-baseline justify-between">
            <span className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100">Total</span>
            <span className="text-[19px] font-semibold tabular-nums tracking-[-0.03em] text-zinc-800 dark:text-zinc-100">
              {formatINR(cart.total)}
            </span>
          </div>

          {needsPrescription && !gateCleared && (
            <Surface
              radius={16}
              className="flex gap-3 bg-amber-50 p-3.5 dark:bg-amber-500/10"
              lisse={{ middleBorder: { width: 1, opacity: 1, color: 'oklch(0.680 0.166 45 / 0.35)' } }}
            >
              <HugeiconsIcon icon={Alert02Icon} size={17} strokeWidth={1.8} color="currentColor" className="mt-px shrink-0 text-amber-700 dark:text-amber-300" />
              <p className="text-pretty text-[13px] leading-relaxed text-amber-700 dark:text-amber-300">
                This order needs an approved prescription before it can be
                placed.{' '}
                <Link href="/prescriptions" className="font-medium underline decoration-from-font underline-offset-[3px]">
                  Upload one
                </Link>.
              </p>
            </Surface>
          )}

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={placing}
            disabled={!gateCleared || !payment}
          >
            {gateCleared ? `Pay ${formatINR(cart.total)}` : 'Prescription required'}
          </Button>

          {/* Anything the server refused, in its own words. The prescription
              gate lands here when it fires between the button and the call. */}
          {error && (
            <Surface
              radius={16}
              role="alert"
              className="flex gap-3 bg-red-50 p-3.5 dark:bg-red-500/10"
              lisse={{ middleBorder: { width: 1, opacity: 1, color: 'oklch(0.577 0.203 27 / 0.35)' } }}
            >
              <HugeiconsIcon icon={Alert02Icon} size={17} strokeWidth={1.8} color="currentColor" className="mt-px shrink-0 text-red-700 dark:text-red-400" />
              <p className="text-pretty text-[13px] leading-relaxed text-red-700 dark:text-red-400">
                {error}
              </p>
            </Surface>
          )}
        </Surface>
      </div>
    </form>
  )
}

/** Order placed. Rendered in place of the form so the page does not flash an
 *  empty cart on its way to somewhere else — this template has no order
 *  history route to redirect to, and inventing one would be a bigger lie than
 *  showing the id. */
function Placed({ orderId }: { orderId: string }) {
  return (
    <Surface
      radius={24}
      role="status"
      className="flex flex-col items-start gap-4 bg-[var(--surface-raised)] p-8"
      lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
    >
      <HugeiconsIcon
        icon={CheckmarkCircle02Icon}
        size={26}
        strokeWidth={1.8}
        color="currentColor"
        className="text-green-600 dark:text-green-500"
      />
      <h2 className="text-[19px] font-semibold tracking-[-0.03em] text-zinc-800 dark:text-zinc-100">
        Your order is placed
      </h2>
      <p className="max-w-[32rem] text-pretty text-[14.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        We have emailed the confirmation. Your reference is{' '}
        <span className="font-medium tabular-nums text-zinc-700 dark:text-zinc-200">{orderId}</span>.
      </p>
      <Button href="/medicines" size="lg">Keep shopping</Button>
    </Surface>
  )
}
