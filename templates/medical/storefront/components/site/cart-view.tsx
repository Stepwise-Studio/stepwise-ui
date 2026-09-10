'use client'

import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Alert02Icon, CheckmarkCircle02Icon, Delete02Icon, Timer02Icon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/components/stepwise/button'
import { QtyInput } from '@/components/stepwise/qty-input'
import { Surface } from '@/components/stepwise/primitives/surface'
import { ProductShot } from '@/components/site/product-shot'
import { formatINR } from '@/lib/format'
import { useCart } from '@/lib/use-cart'
import { cn } from '@/lib/utils/cn'

/**
 * The cart.
 *
 * Two columns: the line items, and a summary that sticks to the top of the
 * viewport on desktop so the total and the checkout button stay reachable
 * however long the list gets.
 *
 * The prescription gate lives in the summary, immediately above the button it
 * disables, with the reason stated rather than implied. A disabled button with
 * no explanation is the single most common way this pattern goes wrong.
 */
export function CartView() {
  const { cart, setQty, remove, needsPrescription, gateCleared } = useCart()

  // `cart` is null until the client has read it. Rendering the empty state
  // during that beat would flash "your cart is empty" at someone who has items.
  if (!cart) return <CartSkeleton />

  if (cart.items.length === 0) {
    return (
      <Surface
        radius={24}
        className="flex flex-col items-start gap-4 bg-[var(--surface-raised)] p-8 sm:p-10"
        lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
      >
        <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-zinc-800 dark:text-zinc-100">
          Nothing in the cart yet
        </h2>
        <p className="max-w-[30rem] text-pretty text-[14.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          Browse the shelf, or send us a prescription and we will put the order
          together for you.
        </p>
        <div className="mt-1 flex flex-wrap gap-3">
          <Button href="/medicines" size="lg">Browse medicines</Button>
          <Button href="/prescriptions" size="lg" variant="outline">Upload a prescription</Button>
        </div>
      </Surface>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
      {/* ── Line items ── */}
      <ul className="flex flex-col">
        {cart.items.map(item => (
          <li
            key={item.id}
            className="flex gap-4 border-b border-[var(--ui-border-subtle)] py-5 first:pt-0"
          >
            {/* Size on the wrapper: lisse's border overlay lives in a
                block-level wrapper that would otherwise stretch. */}
            <div className="h-[84px] w-[84px] shrink-0 sm:h-[104px] sm:w-[104px]">
              <Surface
                radius={16}
                className="h-[84px] w-[84px] overflow-hidden sm:h-[104px] sm:w-[104px]"
                lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border-subtle)' } }}
              >
                <ProductShot handle={item.handle} className="h-full w-full" />
              </Surface>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-[15px] font-semibold tracking-[-0.025em] text-zinc-800 dark:text-zinc-100">
                    <Link href={`/medicines/${item.handle}`} className="hover:text-sky-700 dark:hover:text-sky-300">
                      {item.name}
                    </Link>
                  </h2>
                  <p className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400">{item.packSize}</p>
                  {item.requiresPrescription && (
                    <p className="mt-1.5 text-[12px] font-medium text-amber-600 dark:text-amber-400">
                      Prescription needed
                    </p>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[15px] font-semibold tabular-nums tracking-[-0.03em] text-zinc-800 dark:text-zinc-100">
                    {formatINR(item.unitPrice * item.quantity)}
                  </p>
                  {item.mrp > item.unitPrice && (
                    <p className="text-[12.5px] tabular-nums text-zinc-400 line-through decoration-from-font dark:text-zinc-500">
                      {formatINR(item.mrp * item.quantity)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <QtyInput
                  value={item.quantity}
                  onChange={q => void setQty(item.id, q)}
                  min={1}
                  max={10}
                  ariaLabel={`Quantity of ${item.name}`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  aria-label={`Remove ${item.name}`}
                  onClick={() => void remove(item.id)}
                  icon={<HugeiconsIcon icon={Delete02Icon} size={15} strokeWidth={1.8} color="currentColor" />}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* ── Summary ── */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <Surface
          radius={24}
          className="flex flex-col gap-4 bg-[var(--surface-raised)] p-6"
          lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
        >
          <h2 className="text-[16px] font-semibold tracking-[-0.03em] text-zinc-800 dark:text-zinc-100">
            Order summary
          </h2>

          <dl className="flex flex-col gap-2.5 text-[14px]">
            <Row label="Item total" value={formatINR(cart.mrpTotal)} />
            {cart.savings > 0 && (
              <Row label="Discount" value={`− ${formatINR(cart.savings)}`} tone="positive" />
            )}
            {/* Delivery is the server's number, and there is no delivery
                method on the cart until checkout picks one. Saying so beats
                printing "Free" and then charging for it. */}
            <Row
              label="Delivery"
              value={cart.shipping === 0 ? 'At checkout' : formatINR(cart.shipping)}
            />
            <div className="mt-1 flex items-baseline justify-between border-t border-[var(--ui-border-subtle)] pt-3">
              <dt className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100">Total</dt>
              <dd className="text-[19px] font-semibold tabular-nums tracking-[-0.03em] text-zinc-800 dark:text-zinc-100">
                {formatINR(cart.total)}
              </dd>
            </div>
          </dl>

          {needsPrescription && (
            <GateNotice status={cart.prescriptionStatus} />
          )}

          <Button size="lg" fullWidth href={gateCleared ? '/checkout' : undefined} disabled={!gateCleared}>
            {gateCleared ? 'Checkout' : 'Prescription required'}
          </Button>

          <p className="text-pretty text-[12px] leading-relaxed text-zinc-400 dark:text-zinc-500">
            Prices include all taxes. Delivery is added at checkout.
          </p>
        </Surface>
      </div>
    </div>
  )
}

function Row({
  label, value, tone,
}: { label: string; value: string; tone?: 'positive' }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className={cn(
        'tabular-nums',
        tone === 'positive' ? 'text-green-600 dark:text-green-500' : 'text-zinc-700 dark:text-zinc-200',
      )}>
        {value}
      </dd>
    </div>
  )
}

/** The prescription gate, explained. Three states, each saying what to do next
 *  rather than only what is wrong. */
function GateNotice({ status }: { status: 'pending' | 'approved' | 'rejected' | null }) {
  const state = {
    none: {
      icon: Alert02Icon,
      fill: 'bg-amber-50 dark:bg-amber-500/10',
      edge: 'oklch(0.680 0.166 45 / 0.35)',
      tint: 'text-amber-700 dark:text-amber-300',
      body: <>Something in this cart needs a prescription. <Link href="/prescriptions" className="font-medium underline decoration-from-font underline-offset-[3px]">Upload one</Link> and a pharmacist will approve it.</>,
    },
    pending: {
      icon: Timer02Icon,
      fill: 'bg-sky-50 dark:bg-sky-500/10',
      edge: 'oklch(0.520 0.180 262 / 0.35)',
      tint: 'text-sky-700 dark:text-sky-300',
      body: <>Your prescription is with the pharmacist. Checkout opens as soon as it is approved. <Link href="/prescriptions" className="font-medium underline decoration-from-font underline-offset-[3px]">Check the status</Link>.</>,
    },
    approved: {
      icon: CheckmarkCircle02Icon,
      fill: 'bg-green-50 dark:bg-green-500/10',
      edge: 'oklch(0.455 0.092 156 / 0.35)',
      tint: 'text-green-700 dark:text-green-400',
      body: <>Prescription approved. You are clear to check out.</>,
    },
    rejected: {
      icon: Alert02Icon,
      fill: 'bg-red-50 dark:bg-red-500/10',
      edge: 'oklch(0.577 0.203 27 / 0.35)',
      tint: 'text-red-700 dark:text-red-400',
      body: <>The pharmacist could not accept that prescription. <Link href="/prescriptions" className="font-medium underline decoration-from-font underline-offset-[3px]">Upload another</Link>.</>,
    },
  }[status ?? 'none']

  return (
    <Surface
      radius={16}
      className={cn('flex gap-3 p-3.5', state.fill)}
      lisse={{ middleBorder: { width: 1, opacity: 1, color: state.edge } }}
    >
      <HugeiconsIcon
        icon={state.icon}
        size={17}
        strokeWidth={1.8}
        color="currentColor"
        className={cn('mt-px shrink-0', state.tint)}
      />
      <p className={cn('text-pretty text-[13px] leading-relaxed', state.tint)}>{state.body}</p>
    </Surface>
  )
}

/** Matches the real layout's rhythm so the swap to content does not jump. */
function CartSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
      <div className="flex flex-col">
        {[0, 1].map(i => (
          <div key={i} className="flex gap-4 border-b border-[var(--ui-border-subtle)] py-5 first:pt-0">
            <div className="h-[84px] w-[84px] shrink-0 animate-pulse bg-zinc-200/70 dark:bg-zinc-800 sm:h-[104px] sm:w-[104px]" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-1/2 animate-pulse bg-zinc-200/70 dark:bg-zinc-800" />
              <div className="h-3 w-1/3 animate-pulse bg-zinc-200/70 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-[280px] animate-pulse bg-zinc-200/50 dark:bg-zinc-900" />
    </div>
  )
}
