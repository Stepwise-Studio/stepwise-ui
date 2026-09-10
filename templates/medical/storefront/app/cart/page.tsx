import type { Metadata } from 'next'
import { CartView } from '@/components/site/cart-view'
import { Container } from '@/components/site/section'

export const metadata: Metadata = {
  title      : 'Your cart',
  description: 'Review your order before checkout.',
}

export default function CartPage() {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        <h1 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] text-zinc-800 dark:text-zinc-100 sm:text-[38px]">
          Your cart
        </h1>
        <div className="mt-8">
          <CartView />
        </div>
      </Container>
    </div>
  )
}
