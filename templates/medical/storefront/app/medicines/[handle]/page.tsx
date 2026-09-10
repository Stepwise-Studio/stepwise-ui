import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft02Icon, DeliveryTruck01Icon, PrescriptionIcon, StoreVerified01Icon,
} from '@hugeicons/core-free-icons'
import { Surface } from '@/components/stepwise/primitives/surface'
import { AddToCartPanel } from '@/components/site/add-to-cart-panel'
import { MedicineCard } from '@/components/site/medicine-card'
import { ProductShot } from '@/components/site/product-shot'
import { Container } from '@/components/site/section'
import { CATEGORY_NAMES } from '@/lib/categories'
import { formatINR } from '@/lib/format'
import { getMedicine, getMedicines } from '@/lib/medusa/client'

/** Prebuilds a page per product. Today it reads the mock catalogue; once the
 *  SDK is in, the same call lists real handles and the route keeps working. */
export async function generateStaticParams() {
  const medicines = await getMedicines()
  return medicines.map(m => ({ handle: m.handle }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ handle: string }> },
): Promise<Metadata> {
  const { handle } = await params
  const medicine = await getMedicine(handle)
  if (!medicine) return { title: 'Not found' }
  return {
    title      : `${medicine.name} — ${medicine.packSize}`,
    description: medicine.description,
  }
}

/**
 * Product detail.
 *
 * Two columns: the photograph on the left, everything you decide with on the
 * right. The prescription notice sits directly above the buy controls rather
 * than in the description, because it changes what happens when you press the
 * button.
 */
export default async function MedicinePage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const medicine = await getMedicine(handle)
  if (!medicine) notFound()

  const related = (await getMedicines({ limit: 5 }))
    .filter(m => m.handle !== medicine.handle)
    .slice(0, 4)

  const specs = [
    { label: 'Composition', value: medicine.composition },
    { label: 'Dosage',      value: medicine.dosage },
    { label: 'Pack size',   value: medicine.packSize },
    { label: 'Brand',       value: medicine.brand },
    { label: 'Category',    value: CATEGORY_NAMES[medicine.category] },
  ]

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Link
          href="/medicines"
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-zinc-500 transition-colors duration-[--duration-quick] hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={15} strokeWidth={2} color="currentColor" />
          All medicines
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <Surface
            radius={26}
            className="relative aspect-square w-full overflow-hidden"
            lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
          >
            <ProductShot handle={medicine.handle} className="h-full w-full" />
            {medicine.discountPct > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-amber-500 px-3 py-1.5 text-[12px] font-semibold tabular-nums leading-none text-white">
                {medicine.discountPct}% off
              </span>
            )}
          </Surface>

          <div className="max-w-[32rem]">
            <p className="text-[13px] font-medium text-sky-600 dark:text-sky-400">
              {medicine.brand}
            </p>
            <h1 className="mt-1.5 text-balance text-[28px] font-semibold leading-[1.1] tracking-[-0.04em] text-zinc-800 dark:text-zinc-100 sm:text-[36px]">
              {medicine.name}
            </h1>
            <p className="mt-2 text-[15px] text-zinc-500 dark:text-zinc-400">
              {medicine.composition} · {medicine.packSize}
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-[30px] font-semibold tabular-nums tracking-[-0.04em] text-zinc-800 dark:text-zinc-100">
                {formatINR(medicine.price)}
              </span>
              {medicine.mrp > medicine.price && (
                <>
                  <span className="text-[16px] tabular-nums text-zinc-400 line-through decoration-from-font dark:text-zinc-500">
                    {formatINR(medicine.mrp)}
                  </span>
                  <span className="text-[14px] font-medium tabular-nums text-green-600 dark:text-green-500">
                    You save {formatINR(medicine.mrp - medicine.price)}
                  </span>
                </>
              )}
            </div>
            <p className="mt-1.5 text-[12.5px] text-zinc-400 dark:text-zinc-500">
              Inclusive of all taxes
            </p>

            {medicine.requiresPrescription && (
              <Surface
                radius={16}
                className="mt-6 flex gap-3 bg-amber-50 p-4 dark:bg-amber-500/10"
                lisse={{ middleBorder: { width: 1, opacity: 1, color: 'oklch(0.680 0.166 45 / 0.35)' } }}
              >
                <HugeiconsIcon
                  icon={PrescriptionIcon}
                  size={18}
                  strokeWidth={1.8}
                  color="currentColor"
                  className="mt-px shrink-0 text-amber-600 dark:text-amber-400"
                />
                <div>
                  <p className="text-[14px] font-semibold tracking-[-0.02em] text-amber-700 dark:text-amber-300">
                    This medicine needs a prescription
                  </p>
                  <p className="mt-1 text-pretty text-[13.5px] leading-relaxed text-amber-700/85 dark:text-amber-200/80">
                    You can add it to your cart now.{' '}
                    <Link href="/prescriptions" className="font-medium underline decoration-from-font underline-offset-[4px]">
                      Upload your prescription
                    </Link>{' '}
                    before checkout and a pharmacist will approve it.
                  </p>
                </div>
              </Surface>
            )}

            <div className="mt-7">
              <AddToCartPanel medicine={medicine} />
            </div>

            <div className="mt-7 flex flex-col gap-3 border-t border-[var(--ui-border-subtle)] pt-6 sm:flex-row sm:gap-8">
              <p className="flex items-center gap-2 text-[13.5px] text-zinc-500 dark:text-zinc-400">
                <HugeiconsIcon icon={StoreVerified01Icon} size={17} strokeWidth={1.8} color="currentColor" className="text-green-600 dark:text-green-500" />
                Genuine, batch-traceable stock
              </p>
              <p className="flex items-center gap-2 text-[13.5px] text-zinc-500 dark:text-zinc-400">
                <HugeiconsIcon icon={DeliveryTruck01Icon} size={17} strokeWidth={1.8} color="currentColor" className="text-green-600 dark:text-green-500" />
                Free delivery over ₹499
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-800 dark:text-zinc-100">
                About this medicine
              </h2>
              {/* Capped near 65 characters: this is the only long-form prose on
                  the page and it should read like prose. */}
              <p className="mt-2 max-w-[34rem] text-pretty text-[14.5px] leading-[1.65] text-zinc-500 dark:text-zinc-400">
                {medicine.description}
              </p>
            </div>

            <dl className="mt-7 border-t border-[var(--ui-border-subtle)]">
              {specs.map(s => (
                <div key={s.label} className="flex gap-6 border-b border-[var(--ui-border-subtle)] py-3">
                  <dt className="w-32 shrink-0 text-[13.5px] text-zinc-400 dark:text-zinc-500">{s.label}</dt>
                  <dd className="text-[13.5px] text-zinc-700 dark:text-zinc-200">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 sm:mt-24">
            <h2 className="text-[22px] font-semibold tracking-[-0.035em] text-zinc-800 dark:text-zinc-100 sm:text-[26px]">
              People also order
            </h2>
            <div className="squircle-fill mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
              {related.map(m => (
                <MedicineCard key={m.id} medicine={m} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  )
}
