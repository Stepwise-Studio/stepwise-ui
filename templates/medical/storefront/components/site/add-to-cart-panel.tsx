'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon, ShoppingBag02Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/stepwise/button'
import { QtyInput } from '@/components/stepwise/qty-input'
import { useCart } from '@/lib/use-cart'
import type { Medicine } from '@/lib/medusa/types'

/**
 * Quantity + Add to cart, on the product detail page.
 *
 * The whole client boundary for the detail route: everything else on that page
 * is server-rendered. After a successful add it offers a route to the cart
 * rather than navigating there itself — someone buying three things should not
 * be thrown out of the catalogue after the first.
 */
export function AddToCartPanel({ medicine }: { medicine: Medicine }) {
  const { add } = useCart()
  const reduce  = useReducedMotion()
  const [qty, setQty]     = useState(1)
  const [added, setAdded] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  function handleAdd() {
    void add(medicine, qty)
    setAdded(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), 4000)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <QtyInput
          value={qty}
          onChange={setQty}
          min={1}
          max={10}
          ariaLabel={`Quantity of ${medicine.name}`}
        />
        <Button
          size="lg"
          onClick={handleAdd}
          disabled={!medicine.inStock}
          className="flex-1"
          fullWidth
          icon={
            <span className="relative flex h-[18px] w-[18px] items-center justify-center">
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={added ? 'done' : 'add'}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1,    filter: 'blur(0px)' }}
                  exit={reduce    ? { opacity: 0 } : { opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
                  transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <HugeiconsIcon
                    icon={added ? CheckmarkCircle02Icon : ShoppingBag02Icon}
                    size={18}
                    strokeWidth={2}
                    color="currentColor"
                  />
                </motion.span>
              </AnimatePresence>
            </span>
          }
        >
          {!medicine.inStock ? 'Out of stock' : added ? 'Added to cart' : 'Add to cart'}
        </Button>
      </div>

      {/* The confirmation is a live region so it is announced, not just seen.
          It reserves no height when empty - it sits below the last control. */}
      <AnimatePresence initial={false}>
        {added && (
          <motion.p
            role="status"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce    ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-[13.5px] text-zinc-500 dark:text-zinc-400"
          >
            {qty} × {medicine.packSize} added.{' '}
            <Link
              href="/cart"
              className="font-medium text-sky-600 underline decoration-sky-600/30 underline-offset-[4px] hover:decoration-sky-600/70 dark:text-sky-400 dark:decoration-sky-400/30"
            >
              Go to cart
            </Link>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
