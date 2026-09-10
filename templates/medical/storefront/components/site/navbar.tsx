'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Cancel01Icon, Menu01Icon, PrescriptionIcon, ShoppingBag02Icon,
} from '@hugeicons/core-free-icons'
import { SmoothCorners } from '@lisse/react'
import { Button } from '@/components/stepwise/button'
import { DropdownMenu } from '@/components/stepwise/dropdown-menu'
import { ThemeToggle } from '@/components/stepwise/theme-toggle'
import { SearchField } from '@/components/site/search-field'
import { CATEGORY_NAMES, CATEGORY_ORDER } from '@/lib/categories'
import { useCart } from '@/lib/use-cart'
import { cn } from '@/lib/utils/cn'

/**
 * Site header.
 *
 * Exactly five primary items, per the brief: Medicines, Offers, Search, Upload
 * Prescription, Cart. The six categories live *inside* Medicines - there is
 * deliberately no separate "Categories" entry, because a category is a way of
 * looking at medicines, not a sibling of them.
 *
 * Layout holds until the content genuinely stops fitting rather than at a
 * device preset: the full row survives down to 1024px, below which the two
 * text links and the search field fold into a sheet and the two actions that
 * matter on a phone - upload and cart - stay in the bar.
 */

const NAV_LINKS = [
  { href: '/medicines', label: 'Medicines' },
  { href: '/offers',    label: 'Offers' },
] as const

function Wordmark() {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent dark:focus-visible:ring-sky-400"
    >
      {/* The mark is a medical cross cut from a squircle - the same corner
          language as every other surface on the site, at 10px. */}
      <SmoothCorners corners={{ radius: 10, smoothing: 0.6 }}>
        <span className="flex h-8 w-8 items-center justify-center bg-sky-600 dark:bg-sky-500">
          <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true" fill="var(--color-white)">
            <rect x="6" y="1.5" width="3" height="12" rx="1" />
            <rect x="1.5" y="6" width="12" height="3" rx="1" />
          </svg>
        </span>
      </SmoothCorners>
      <span className="text-[17px] font-semibold tracking-[-0.04em] text-zinc-800 dark:text-zinc-100">
        MedixGo
      </span>
    </Link>
  )
}

/** The cart count. Digits are tabular so a jump from 9 to 10 widens the pill
 *  predictably instead of shuffling the glyphs, and the badge pops in on the
 *  bounce easing rather than appearing. */
function CartBadge({ count }: { count: number }) {
  const reduce = useReducedMotion()
  return (
    <AnimatePresence initial={false}>
      {count > 0 && (
        <motion.span
          key="badge"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.4, x: 2, y: -2 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={reduce    ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.5, ease: [0.34, 1.36, 0.64, 1] }}
          className={cn(
            'pointer-events-none absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center',
            'rounded-full bg-amber-500 px-1 text-[10px] font-semibold leading-none tabular-nums text-white',
          )}
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export function Navbar() {
  const { count } = useCart()
  const pathname  = usePathname()
  const router    = useRouter()
  const reduce    = useReducedMotion()
  const [sheetOpen, setSheetOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Route change closes the sheet. Without this it survives navigation and the
  // new page renders underneath an open overlay.
  useEffect(() => { setSheetOpen(false) }, [pathname])

  // A full-height overlay that leaves the page scrollable behind it is the
  // classic mobile-menu bug: you scroll the page instead of the menu.
  useEffect(() => {
    if (!sheetOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSheetOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [sheetOpen])

  const categoryItems = CATEGORY_ORDER.map(handle => ({
    label   : CATEGORY_NAMES[handle],
    onSelect: () => router.push(`/medicines?category=${handle}`),
  }))

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-[14px] focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-[var(--ui-border)] bg-[color-mix(in_oklab,var(--background)_88%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center gap-3 px-5 sm:px-8">
          <Wordmark />

          {/* ── Desktop nav ── */}
          <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 lg:flex">
            <DropdownMenu
              align="start"
              items={[{ heading: 'Shop by category' }, ...categoryItems, { separator: true }, {
                label: 'All medicines',
                onSelect: () => router.push('/medicines'),
              }]}
              trigger={
                <button
                  type="button"
                  className={cn(
                    'px-3 py-2 text-[14px] font-medium tracking-[-0.01em] outline-none',
                    'transition-colors duration-[--duration-quick] ease-[--ease-out]',
                    'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white',
                    'focus-visible:ring-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400',
                    pathname.startsWith('/medicines') && 'text-zinc-900 dark:text-white',
                  )}
                >
                  Medicines
                </button>
              }
            />
            <Link
              href="/offers"
              className={cn(
                'px-3 py-2 text-[14px] font-medium tracking-[-0.01em] outline-none',
                'transition-colors duration-[--duration-quick] ease-[--ease-out]',
                'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white',
                'focus-visible:ring-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400',
                pathname.startsWith('/offers') && 'text-zinc-900 dark:text-white',
              )}
            >
              Offers
            </Link>
          </nav>

          <SearchField className="ml-auto hidden w-full max-w-[280px] lg:block" />

          {/* Every responsive show/hide here is on a WRAPPER, never on the
              Button itself. `Button` forwards `className` to its inner
              `<button>`, but lisse paints the squircle edge on a sibling
              overlay in the outer wrapper - so `className="lg:hidden"` on a
              Button hides the control and leaves a stray ring floating in the
              header. Hiding the wrapper takes the overlay with it. */}
          <div className="ml-auto flex items-center gap-2 lg:ml-3">
            <span className="hidden sm:inline-flex">
              <ThemeToggle />
            </span>

            {/* Upload Prescription is the prominent action, so it is the only
                solid button in the bar. On a phone it drops to the icon alone
                rather than disappearing - it is the whole point of the site. */}
            <span className="hidden sm:inline-flex">
              <Button
                href="/prescriptions"
                icon={<HugeiconsIcon icon={PrescriptionIcon} size={16} strokeWidth={2} color="currentColor" />}
              >
                Upload Prescription
              </Button>
            </span>
            <span className="inline-flex sm:hidden">
              <Button
                href="/prescriptions"
                iconOnly
                aria-label="Upload prescription"
                icon={<HugeiconsIcon icon={PrescriptionIcon} size={17} strokeWidth={2} color="currentColor" />}
              />
            </span>

            <div className="relative">
              <Button
                href="/cart"
                variant="outline"
                iconOnly
                aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? '' : 's'}` : 'Cart, empty'}
                icon={<HugeiconsIcon icon={ShoppingBag02Icon} size={17} strokeWidth={1.8} color="currentColor" />}
              />
              <CartBadge count={count} />
            </div>

            <span className="inline-flex lg:hidden">
              <Button
                variant="ghost"
                iconOnly
                aria-label="Open menu"
                aria-expanded={sheetOpen}
                onClick={() => setSheetOpen(true)}
                icon={<HugeiconsIcon icon={Menu01Icon} size={18} strokeWidth={1.8} color="currentColor" />}
              />
            </span>
          </div>
        </div>
      </header>

      {/* ── Mobile sheet ──
          Slides down from the header rather than fading in place, so it reads
          as coming from the control that opened it. */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            key="sheet"
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              onClick={() => setSheetOpen(false)}
              className="absolute inset-0 bg-[oklch(0.16_0.03_258/0.4)]"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={reduce ? { opacity: 0 } : { y: -16, opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
              exit={reduce    ? { opacity: 0 } : { y: -16, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-0 max-h-full overflow-y-auto bg-[var(--background)] px-5 pb-8 pt-4 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <Wordmark />
                <Button
                  ref={closeRef}
                  variant="ghost"
                  iconOnly
                  aria-label="Close menu"
                  onClick={() => setSheetOpen(false)}
                  icon={<HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} color="currentColor" />}
                />
              </div>

              <SearchField className="mt-5" autoFocus />

              <nav aria-label="Primary" className="mt-6 flex flex-col">
                {NAV_LINKS.map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="border-b border-[var(--ui-border-subtle)] py-3.5 text-[17px] font-medium tracking-[-0.02em] text-zinc-800 dark:text-zinc-100"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              <p className="mt-7 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                Shop by category
              </p>
              <ul className="mt-2 grid grid-cols-2 gap-x-4">
                {CATEGORY_ORDER.map(handle => (
                  <li key={handle}>
                    <Link
                      href={`/medicines?category=${handle}`}
                      className="block py-2.5 text-[15px] text-zinc-600 dark:text-zinc-300"
                    >
                      {CATEGORY_NAMES[handle]}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex items-center gap-3">
                <Button
                  href="/prescriptions"
                  fullWidth
                  size="lg"
                  icon={<HugeiconsIcon icon={PrescriptionIcon} size={17} strokeWidth={2} color="currentColor" />}
                >
                  Upload Prescription
                </Button>
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
