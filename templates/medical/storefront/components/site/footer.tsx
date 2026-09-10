import Link from 'next/link'
import { CATEGORY_NAMES, CATEGORY_ORDER } from '@/lib/categories'
import { Container } from '@/components/site/section'

/**
 * Footer.
 *
 * Four columns of links, then the legal line. The pharmacy licence and the
 * "not a substitute for medical advice" note are the two things a medical store
 * genuinely has to say, so they get their own line rather than being buried in
 * a column - and they are the first placeholders the owner must replace.
 *
 * All copy here is PLACEHOLDER. See COPY-TODO.md.
 */

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'All medicines',        href: '/medicines' },
      { label: 'Offers',               href: '/offers' },
      { label: 'Upload prescription',  href: '/prescriptions' },
      { label: 'Cart',                 href: '/cart' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About MedixGo',   href: '#' },
      { label: 'How it works',    href: '/#how-it-works' },
      { label: 'Our pharmacists', href: '#' },
      { label: 'Careers',         href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help centre',       href: '#' },
      { label: 'Track your order',  href: '#' },
      { label: 'Returns & refunds', href: '#' },
      { label: 'Contact us',        href: '#' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--ui-border)] bg-[var(--surface-sunken)]">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-8">
          <div className="max-w-[22rem]">
            <p className="text-[17px] font-semibold tracking-[-0.04em] text-zinc-800 dark:text-zinc-100">
              MedixGo
            </p>
            <p className="mt-2.5 text-pretty text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              A neighbourhood pharmacy that happens to be online. Genuine
              medicines, checked by a pharmacist, delivered to your door.
            </p>
          </div>

          {COLUMNS.map(col => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-800 dark:text-zinc-100">
                {col.title}
              </h2>
              <ul className="mt-3 flex flex-col gap-2.5">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-zinc-500 transition-colors duration-[--duration-quick] hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Categories">
            <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-800 dark:text-zinc-100">
              Categories
            </h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {CATEGORY_ORDER.map(handle => (
                <li key={handle}>
                  <Link
                    href={`/medicines?category=${handle}`}
                    className="text-[14px] text-zinc-500 transition-colors duration-[--duration-quick] hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    {CATEGORY_NAMES[handle]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--ui-border-subtle)] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[38rem] text-pretty text-[12.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            Retail drug licence 00-XXXXX-000, issued to MedixGo Pharmacy Pvt.
            Ltd. Nothing on this site is a substitute for advice from a
            registered medical practitioner.
          </p>
          <p className="shrink-0 text-[12.5px] text-zinc-400 dark:text-zinc-500">
            © {new Date().getFullYear()} MedixGo
          </p>
        </div>
      </Container>
    </footer>
  )
}
