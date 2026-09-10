'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CheckmarkCircle02Icon, PrescriptionIcon, ShoppingBag02Icon,
} from '@hugeicons/core-free-icons'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Button } from '@/components/stepwise/button'
import { ProductShot } from '@/components/site/product-shot'
import { formatINR } from '@/lib/format'
import { useCart } from '@/lib/use-cart'
import { cn } from '@/lib/utils/cn'
import type { Medicine } from '@/lib/medusa/types'

/**
 * The product card for a medicine.
 *
 * Written rather than vendored. The library's own `product-card` is built for
 * apparel - colour swatches, size pills, a wishlist - and carries no notion of
 * an MRP, a derived discount, a pack size or a prescription requirement, all of
 * which this template's contract requires on the face of the card. Bending it
 * into shape would have been a larger diff than composing `Surface` + `Button`
 * directly, and would have left the vendored copy diverged from the registry.
 *
 * The image is the one place the Riso art direction does not apply: product
 * shots are studio photography. See `product-shot.tsx`.
 */
export function MedicineCard({
  medicine,
  className,
}: {
  medicine : Medicine
  className?: string
}) {
  const { add } = useCart()
  const reduce  = useReducedMotion()
  const [added, setAdded] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  function handleAdd() {
    void add(medicine)
    setAdded(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), 1600)
  }

  return (
    <Surface
      radius={24}
      className={cn('group relative flex h-full w-full flex-col overflow-hidden bg-[var(--surface-raised)]', className)}
      lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
    >
      {/* ── Image ──
          Not a link of its own. The card's single link is the product name,
          stretched over the whole card below - one keyboard stop, one hit area,
          and no duplicate destination announced to a screen reader. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <ProductShot
          handle={medicine.handle}
          className={cn(
            'h-full w-full',
            'transition-transform duration-[--duration-slow] ease-[--ease-smooth-out]',
            'group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
          )}
        />
        {/* A hairline over the image, pure black at 10% in light and pure white
            at 10% in dark. A tinted neutral here picks up the sweep behind it
            and reads as dirt along the edge. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 outline outline-1 -outline-offset-1 outline-[oklch(0_0_0/0.1)] dark:outline-[oklch(1_0_0/0.1)]"
        />

        {medicine.discountPct > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-semibold tabular-nums leading-none text-white">
            {medicine.discountPct}% off
          </span>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-semibold leading-snug tracking-[-0.025em] text-zinc-800 dark:text-zinc-100">
            <Link
              href={`/medicines/${medicine.handle}`}
              className="outline-none transition-colors duration-[--duration-quick] hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:hover:text-sky-300 dark:focus-visible:ring-sky-400"
            >
              {/* Stretches the link's hit area over the card without nesting
                  interactive elements inside the anchor itself. */}
              <span className="absolute inset-0 z-[1]" aria-hidden="true" />
              {medicine.name}
            </Link>
          </h3>
          <p className="text-[13px] leading-snug text-zinc-500 dark:text-zinc-400">
            {medicine.composition} · {medicine.packSize}
          </p>
        </div>

        {medicine.requiresPrescription && (
          <p className="flex items-center gap-1.5 text-[12px] font-medium leading-none text-amber-600 dark:text-amber-400">
            <HugeiconsIcon icon={PrescriptionIcon} size={14} strokeWidth={1.8} color="currentColor" />
            Prescription needed
          </p>
        )}

        {/* Price sits at the bottom of the card whatever the name wraps to, so a
            row of cards keeps one price line. */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[19px] font-semibold tabular-nums tracking-[-0.03em] text-zinc-800 dark:text-zinc-100">
              {formatINR(medicine.price)}
            </span>
            {medicine.mrp > medicine.price && (
              <span className="text-[13px] tabular-nums text-zinc-400 line-through decoration-from-font dark:text-zinc-500">
                {formatINR(medicine.mrp)}
              </span>
            )}
          </div>

          <div className="relative z-[2]">
            <Button
              fullWidth
              onClick={handleAdd}
              aria-live="polite"
              disabled={!medicine.inStock}
              icon={
                /* Icon swap, not a visibility toggle: scale 0.25 → 1, opacity
                   0 → 1, blur 4px → 0, spring with zero bounce. Both states
                   share one slot so nothing reflows underneath. */
                <span className="relative flex h-4 w-4 items-center justify-center">
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
                        size={16}
                        strokeWidth={2}
                        color="currentColor"
                      />
                    </motion.span>
                  </AnimatePresence>
                </span>
              }
            >
              {/* Motion is never the only channel: the label changes too. */}
              {!medicine.inStock ? 'Out of stock' : added ? 'Added to cart' : 'Add to cart'}
            </Button>
          </div>
        </div>
      </div>
    </Surface>
  )
}
