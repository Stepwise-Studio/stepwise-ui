import type { Metadata } from 'next'
import Link from 'next/link'
import { MedicineCard } from '@/components/site/medicine-card'
import { SearchField } from '@/components/site/search-field'
import { Container } from '@/components/site/section'
import { Surface } from '@/components/stepwise/primitives/surface'
import { CATEGORY_NAMES, CATEGORY_ORDER, isCategorySlug } from '@/lib/categories'
import { getMedicines } from '@/lib/medusa/client'
import { cn } from '@/lib/utils/cn'

export const metadata: Metadata = {
  title      : 'Medicines',
  description: 'Browse genuine medicines by category, or search by name or salt.',
}

/**
 * Medicine listing.
 *
 * Filter state lives entirely in the URL - `?category=` and `?q=` - so a
 * filtered listing is bookmarkable, shareable and server-rendered, and the
 * filter chips are plain links rather than a client-side store. Next 16 hands
 * `searchParams` in as a promise; it has to be awaited before it is read.
 */
export default async function MedicinesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const params   = await searchParams
  const category = isCategorySlug(params.category) ? params.category : undefined
  const q        = params.q?.trim() || undefined

  const medicines = await getMedicines({ category, search: q })

  const heading = category ? CATEGORY_NAMES[category] : 'All medicines'

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <header className="max-w-[34rem]">
          <h1 className="text-balance text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] text-zinc-800 dark:text-zinc-100 sm:text-[38px]">
            {heading}
          </h1>
          <p className="mt-3 text-pretty text-[15px] leading-[1.6] text-zinc-500 dark:text-zinc-400">
            {q
              ? `Results for “${q}”.`
              : 'Every pack lists its composition, its dosage and whether it needs a prescription.'}
          </p>
        </header>

        <SearchField className="mt-7 max-w-[26rem]" defaultValue={q ?? ''} size="lg" />

        {/* ── Category filter ──
            A horizontal scroller on a phone. The row is padded past the layout
            margin so the last chip is not shaved off flush at the edge, which
            is the cue that there is more to scroll to. */}
        <nav aria-label="Filter by category" className="-mx-5 mt-6 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8">
          <ul className="flex w-max items-center gap-2">
            <li>
              <FilterChip href="/medicines" active={!category}>All</FilterChip>
            </li>
            {CATEGORY_ORDER.map(slug => (
              <li key={slug}>
                <FilterChip href={`/medicines?category=${slug}`} active={category === slug}>
                  {CATEGORY_NAMES[slug]}
                </FilterChip>
              </li>
            ))}
          </ul>
        </nav>

        {medicines.length > 0 ? (
          <>
            <p className="mt-8 text-[13px] tabular-nums text-zinc-500 dark:text-zinc-400">
              {medicines.length} {medicines.length === 1 ? 'product' : 'products'}
            </p>
            <div className="squircle-fill mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
              {medicines.map(m => (
                <MedicineCard key={m.id} medicine={m} />
              ))}
            </div>
          </>
        ) : (
          <Surface
            radius={22}
            className="mt-10 flex flex-col items-start gap-3 bg-[var(--surface-raised)] p-8"
            lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
          >
            <h2 className="text-[17px] font-semibold tracking-[-0.03em] text-zinc-800 dark:text-zinc-100">
              Nothing here yet
            </h2>
            <p className="max-w-[30rem] text-pretty text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              {q
                ? 'No medicine matched that search. Try the salt name — paracetamol rather than a brand.'
                : 'This category has no products in the template catalogue yet. The four ACME products are spread across Pain & Fever, Vitamins & Supplements and Baby Care.'}
            </p>
            <Link
              href="/medicines"
              className="mt-1 text-[14px] font-medium text-sky-600 underline decoration-sky-600/30 underline-offset-[5px] hover:decoration-sky-600/70 dark:text-sky-400 dark:decoration-sky-400/30"
            >
              Show all medicines
            </Link>
          </Surface>
        )}
      </Container>
    </div>
  )
}

/** A filter chip. Written here rather than using the library's `Chip`, which is
 *  a status badge and is not interactive. */
function FilterChip({
  href, active, children,
}: {
  href: string; active: boolean; children: React.ReactNode
}) {
  return (
    <Surface
      radius={14}
      className={cn(
        'transition-colors duration-[--duration-quick] ease-[--ease-out]',
        active ? 'bg-zinc-800 dark:bg-zinc-100' : 'bg-[var(--surface-raised)]',
      )}
      lisse={{
        middleBorder: {
          width: 1, opacity: 1,
          color: active ? 'transparent' : 'var(--ui-border)',
        },
      }}
    >
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex h-9 items-center whitespace-nowrap px-3.5 text-[13.5px] font-medium tracking-[-0.01em] outline-none',
          active
            ? 'text-white dark:text-zinc-900'
            : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white',
        )}
      >
        {children}
      </Link>
    </Surface>
  )
}
