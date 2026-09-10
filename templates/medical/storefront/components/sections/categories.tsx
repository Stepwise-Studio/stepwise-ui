import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { Surface } from '@/components/stepwise/primitives/surface'
import { CategoryPlate } from '@/components/riso/illustrations'
import { Container, Section, SectionHeading } from '@/components/site/section'
import { CATEGORY_NAMES } from '@/lib/categories'
import { cn } from '@/lib/utils/cn'
import type { CategorySlug } from '@/lib/medusa/types'

/**
 * Shop by Category — Section 03. **Copy is locked** (heading and support line).
 *
 * A real bento: four distinct footprints across six cells, not a 3×2 of
 * identical tiles. The largest cell takes Pain & Fever because it is the
 * category most people arrive looking for; the 3-wide banner takes Vitamins &
 * Supplements because that plate is a row of objects and reads best wide.
 *
 * The label sits on the bare paper at the top of each plate rather than over a
 * scrim at the bottom. Every plate composition leaves that space empty on
 * purpose - which is also why the illustrations carry no text of their own.
 */

const CELLS: { slug: CategorySlug; span: string }[] = [
  { slug: 'pain-fever',           span: 'sm:col-span-2 lg:col-span-2 lg:row-span-2' },
  { slug: 'cold-cough',           span: '' },
  { slug: 'diabetes-care',        span: '' },
  { slug: 'skin-care',            span: 'sm:col-span-2 lg:col-span-2' },
  { slug: 'vitamins-supplements', span: 'sm:col-span-2 lg:col-span-3' },
  { slug: 'baby-care',            span: '' },
]

function CategoryCard({ slug, span }: { slug: CategorySlug; span: string }) {
  return (
    <Link
      href={`/medicines?category=${slug}`}
      className={cn(
        'squircle-fill group relative block outline-none',
        'focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)] dark:focus-visible:ring-sky-400',
        span,
      )}
    >
      <Surface
        radius={22}
        className="relative flex h-full w-full flex-col overflow-hidden"
        lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
      >
        {/* The plate is a framed print; the caption below it is the museum
            label. Keeping the two apart is what lets the illustration be
            cropped freely by its cell - six cells of four different shapes -
            without ever putting type over a busy passage of ink. It is also the
            asset rule: no text is baked into the artwork. */}
        <div className="relative flex-1">
          <CategoryPlate slug={slug} />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--ui-border-subtle)] bg-[var(--surface-raised)] px-4 py-3">
          <h3 className="text-balance text-[15px] font-semibold leading-[1.2] tracking-[-0.03em] text-zinc-800 dark:text-zinc-100">
            {CATEGORY_NAMES[slug]}
          </h3>
          <span
            aria-hidden="true"
            className={cn(
              'flex shrink-0 items-center justify-center text-zinc-400 dark:text-zinc-500',
              'transition-transform duration-[--duration-fast] ease-[--ease-smooth-out]',
              'group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0',
            )}
          >
            <HugeiconsIcon icon={ArrowRight02Icon} size={15} strokeWidth={2} color="currentColor" />
          </span>
        </div>
      </Surface>
    </Link>
  )
}

export function Categories() {
  return (
    <Section tone="raised" id="categories">
      <Container>
        <SectionHeading
          title="Everything you need, in one place"
          support="From everyday essentials to specialized care, find the medicines and health products you need."
        />

        {/* Row height is set here and nowhere else - a `min-h` on the card
            itself would let a cell exceed its own grid row, and the squircle
            frame (drawn for the row's height) would end mid-card. */}
        <div className="mt-10 grid auto-rows-[210px] grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:auto-rows-[198px] lg:grid-cols-4">
          {CELLS.map(cell => (
            <CategoryCard key={cell.slug} {...cell} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
