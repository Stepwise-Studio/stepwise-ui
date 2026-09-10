import type { Metadata } from 'next'
import { CheckoutView } from '@/components/site/checkout-view'
import { Container } from '@/components/site/section'

export const metadata: Metadata = {
  title      : 'Checkout',
  description: 'Delivery details and payment.',
}

export default function CheckoutPage() {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        <h1 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] text-zinc-800 dark:text-zinc-100 sm:text-[38px]">
          Checkout
        </h1>
        <p className="mt-3 max-w-[34rem] text-pretty text-[15px] leading-[1.6] text-zinc-500 dark:text-zinc-400">
          Two things and you are done. We do not store card details; payment
          happens with the provider.
        </p>
        <div className="mt-9">
          <CheckoutView />
        </div>
      </Container>
    </div>
  )
}
