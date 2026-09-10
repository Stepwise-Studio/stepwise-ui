import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils/cn'

/**
 * Page rhythm.
 *
 * The brief asks the homepage to alternate visually rich and quiet sections.
 * `tone` is how that is expressed: `raised` is the lighter of the two paper
 * stocks and carries the busy sections, `sunken` is the warmer stock and
 * carries the quiet ones. Two stocks, alternating - not a stripe painted on one
 * page. `plain` inherits the page ground for sections that should read as
 * continuous with what precedes them.
 *
 * Vertical rhythm is one scale, applied here and nowhere else, so no section
 * can quietly drift out of step with its neighbours.
 */

const TONE = {
  raised: 'bg-[var(--surface-raised)]',
  sunken: 'bg-[var(--surface-sunken)]',
  plain : '',
} as const

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  // Layout margins grow with the viewport; content never touches the edge.
  return <div className={cn('mx-auto w-full max-w-[1180px] px-5 sm:px-8', className)}>{children}</div>
}

export function Section({
  tone = 'plain',
  id,
  className,
  children,
}: {
  tone?: keyof typeof TONE
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={cn('py-16 sm:py-20 lg:py-28', TONE[tone], className)}>
      {children}
    </section>
  )
}

/**
 * A section's heading block.
 *
 * Sentence case, no eyebrow label, no uppercase tracking. The support line is
 * capped near 60 characters so it reads as a paragraph rather than as a banner,
 * and `text-pretty` keeps a single word off its last line.
 */
export function SectionHeading({
  title,
  support,
  action,
  align = 'start',
  className,
}: {
  title  : string
  support?: string
  action? : { label: string; href: string }
  align?  : 'start' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className,
      )}
    >
      <div className={cn('max-w-[34rem]', align === 'center' && 'mx-auto text-center')}>
        <h2 className="text-balance text-[26px] font-semibold leading-[1.12] tracking-[-0.035em] text-zinc-800 dark:text-zinc-100 sm:text-[32px] lg:text-[38px]">
          {title}
        </h2>
        {support && (
          <p className="mt-3 text-pretty text-[15px] leading-[1.6] text-zinc-500 dark:text-zinc-400 sm:text-[16px]">
            {support}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className={cn(
            'group inline-flex shrink-0 items-center gap-1.5 text-[14px] font-medium text-sky-600 dark:text-sky-400',
            'underline decoration-sky-600/25 decoration-from-font underline-offset-[5px] dark:decoration-sky-400/25',
            'transition-colors duration-[--duration-quick] ease-[--ease-out]',
            'hover:text-sky-700 hover:decoration-sky-600/60 dark:hover:text-sky-300 dark:hover:decoration-sky-400/60',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:focus-visible:ring-sky-400',
            align === 'center' && 'sm:mt-1',
          )}
        >
          {action.label}
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={15}
            strokeWidth={2}
            color="currentColor"
            /* Moves on hover, not on every frame. `transition-transform` names
               exactly what animates - no `transition: all`. */
            className="transition-transform duration-[--duration-fast] ease-[--ease-smooth-out] group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          />
        </Link>
      )}
    </div>
  )
}
