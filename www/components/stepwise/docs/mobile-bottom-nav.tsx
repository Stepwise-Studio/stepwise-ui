'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ChevronUpIcon, GithubIcon } from '@hugeicons/core-free-icons'
import { Surface } from '@/components/stepwise/primitives/surface'
import { ScrollArea } from '@/components/stepwise/scroll-area'
import { ThemeToggle } from '@/components/stepwise/theme-toggle'
import { useTheme } from '@/lib/theme'
import { SidebarNav } from './sidebar-nav'
import { cn } from '@/lib/utils/cn'

const REPO_URL = 'https://github.com/Stepwise-Studio/stepwise-ui'

interface NavItem { href: string; label: string }
interface NavSection { label: string; items: NavItem[] }

// Plain `rounded-full`, not `Surface`/`SmoothCorners` - every corner on
// these pills sits at radius = half the height, the documented exception
// where a squircle correction has nothing to do (there's no straight edge
// segment left to smooth).
// No light-mode shadow - the progressive blur strip behind these pills
// already separates them from the page, and two pills sitting side by side
// each casting their own soft shadow compounded into a visible darker
// rectangle band across the row instead of reading as two distinct pills.
// Dark mode keeps its own - the page behind is already near-black there, so
// a shadow doesn't have the same page-tinting side effect and is still
// what gives the pills their edge against a dark backdrop.
const PILL = 'border border-zinc-200/80 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 dark:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.6)]'

/** A small sticky top bar, mobile-only - brand mark + wordmark (left),
 *  GitHub (right). Two free-floating circular pills for these read as
 *  fighting for space rather than belonging together at this width; sitting
 *  in one shared bar reads as the brand identity it actually is, same as
 *  the desktop header's own left zone. Deliberately lighter than the old
 *  mobile header this replaced, though - no search box, no hamburger,
 *  both live in `MobileBottomNav` now. */
export function MobileTopBar() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  return (
    <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-100 bg-white/85 px-4 backdrop-blur-md md:hidden dark:border-zinc-900 dark:bg-[oklch(0.09_0_0)]/85">
      <Link href="/" aria-label="Stepwise UI home" className="flex items-center gap-2">
        {/* 36x14 matches the mark's real 490:191 ratio. 35x14 declared 2.50
            against a true 2.565, which Next flags as a distorted aspect. */}
        <Image
          src={dark ? '/brand/logo-mark-dark.svg' : '/brand/logo-mark.svg'}
          alt=""
          width={36}
          height={14}
          className="h-[14px] w-auto"
        />
        <span className="text-[16px] font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white">Stepwise UI</span>
      </Link>
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source on GitHub"
        className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors duration-150 hover:bg-zinc-900/5 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-200"
      >
        <HugeiconsIcon icon={GithubIcon} size={18} strokeWidth={1.8} color="currentColor" />
      </a>
    </div>
  )
}

export function MobileBottomNav({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname()
  const [navOpen, setNavOpen] = useState(false)
  const [query, setQuery] = useState('')
  const sheetScrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentLabel = useMemo(() => {
    for (const s of sections) {
      const item = s.items.find(i => i.href === pathname)
      if (item) return item.label
    }
    return 'Browse docs'
  }, [sections, pathname])

  // The search pill used to open the same `CommandPalette` overlay the
  // desktop ⌘K trigger does - but that was really just this same "browse
  // and jump to a page" list again, with a text box bolted on top. Filtering
  // in place, right here, does the one thing the pill added (narrow the
  // list by typing) without a second surface for what's really one job.
  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sections
    return sections
      .map(s => ({ ...s, items: s.items.filter(i => i.label.toLowerCase().includes(q)) }))
      .filter(s => s.items.length > 0)
  }, [sections, query])

  // Land on the current page already centered in the sheet - without this
  // it always opens scrolled to the very top, so a page under, say, "P"
  // needs a manual scroll past everything before it every single time,
  // even though the sheet's whole reason for existing is "where am I".
  // `useLayoutEffect`, no delay - it used to wait ~230ms for the sheet's
  // enter animation to finish before measuring, on the theory that
  // measuring mid-transition would catch the sheet at the wrong size. That
  // was wrong: the entrance only animates `scale`/`y`/`opacity` on the
  // *outer* motion.div, a transform that never touches the *inner*
  // `ScrollArea`'s own layout box - its scrollHeight/clientHeight are
  // final the instant it mounts. Waiting just meant the sheet was visible,
  // scrolled to the top, for ~230ms and then snapped to the real position
  // - the "glitch". Setting it in `useLayoutEffect` (synchronous, before
  // the browser paints) means the very first frame already shows the
  // correct scroll position, so there's nothing left to visibly jump.
  useLayoutEffect(() => {
    if (!navOpen || query) return
    const container = sheetScrollRef.current
    const active = container?.querySelector<HTMLElement>(`a[href="${pathname}"]`)
    active?.scrollIntoView({ block: 'center', behavior: 'auto' })
  }, [navOpen, pathname, query])

  // Clear the filter each time the sheet closes - reopening should show the
  // full list again, not whatever was typed last time.
  useEffect(() => {
    if (!navOpen) setQuery('')
  }, [navOpen])

  return (
    <>
      {/* scrim + upward sheet for the nav pill's page list */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            key="scrim"
            className="fixed inset-0 z-40 bg-black/20 md:hidden dark:bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setNavOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {navOpen && (
          <motion.div
            key="sheet"
            role="dialog"
            aria-label="Browse docs"
            className="fixed inset-x-4 z-50 md:hidden"
            style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 88px)' }}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.12 } }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <Surface
              radius={22}
              lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border, rgb(138 138 141 / 0.23))' } }}
              className="overflow-hidden bg-white shadow-[0_20px_60px_-12px_rgba(0,0,0,0.28)] dark:bg-zinc-900 dark:shadow-[0_24px_70px_-12px_rgba(0,0,0,0.8)]"
            >
              {/* subtle - no border of its own, just enough presence to read
                  as "type to filter" without competing with the brand's own
                  search styling elsewhere */}
              <div className="flex items-center gap-2 px-3.5 pt-1.5">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="shrink-0 text-zinc-400 dark:text-zinc-500">
                  <circle cx="9" cy="9" r="6" />
                  <path d="m14 14 3 3" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search docs…"
                  aria-label="Filter docs"
                  className="w-full bg-transparent py-2.5 text-[15px] tracking-[-0.01em] text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
              </div>
              <div className="mx-3.5 h-px bg-zinc-100 dark:bg-zinc-800" />

              <ScrollArea ref={sheetScrollRef} maxHeight="46vh" showScrollbar className="p-3" onClick={() => setNavOpen(false)}>
                {filteredSections.length === 0 ? (
                  <div className="px-2 py-8 text-center text-[13.5px] text-zinc-400 dark:text-zinc-500">
                    No results for "{query}"
                  </div>
                ) : (
                  <SidebarNav sections={filteredSections} query={query} />
                )}
              </ScrollArea>
            </Surface>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progressive frosted fade behind the pills - with the top header
          strip gone, page content (text, images) can now scroll directly
          underneath this bar with nothing to soften it. A single
          `backdrop-blur` div can't vary its own blur radius by position, so
          "concentrated at the bottom, clear toward the top" needs several
          layers stacked instead: each one blurs the *whole* strip a
          different amount, but its mask only lets that amount show through
          a different band. Stacking bands that grow both blurrier and
          taller toward the bottom is what reads as blur intensity
          increasing continuously, rather than one flat blurred rectangle
          with a fading edge. Not interactive - sits behind the pills,
          doesn't intercept their taps. */}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-32 md:hidden">
        {[
          { blur: 2,  mask: 'linear-gradient(to top, black 0%, black 25%, transparent 60%)' },
          { blur: 5,  mask: 'linear-gradient(to top, black 0%, black 20%, transparent 45%)' },
          { blur: 10, mask: 'linear-gradient(to top, black 0%, black 15%, transparent 32%)' },
          { blur: 18, mask: 'linear-gradient(to top, black 0%, black 10%, transparent 20%)' },
        ].map(({ blur, mask }, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        ))}
      </div>

      {/* the bar itself */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pt-2 md:hidden"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setNavOpen(o => !o)}
            aria-label={`Browse docs - currently ${currentLabel}`}
            aria-expanded={navOpen}
            className={cn(
              'flex h-12 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 text-[14px] font-medium text-zinc-800 transition-colors dark:text-zinc-100',
              PILL,
            )}
          >
            {/* Same optical-centering idea `Chip` uses (flex `items-center`
                centers the *line box*, not a word's actual ink, which
                clusters low), but tuned down from Chip's own numbers:
                `truncate` here brings its own `overflow: hidden`, and
                Chip's `lineHeight: 1` is tighter than several labels'
                descenders (the "pp" in "Apple Select") actually need -
                combined with the same upward shift, that clipped them
                against this span's own truncation boundary instead of the
                pill. `1.15` leaves just enough room below the baseline, so
                a lighter nudge is enough to finish the correction. */}
            <span
              className="max-w-[46vw] truncate"
              style={{ lineHeight: 1.15, transform: 'translateY(-0.03em)' }}
            >
              {currentLabel}
            </span>
            <motion.span
              animate={{ rotate: navOpen ? 0 : 180 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 text-zinc-400 dark:text-zinc-500"
            >
              <HugeiconsIcon icon={ChevronUpIcon} size={16} strokeWidth={2.5} color="currentColor" />
            </motion.span>
          </button>

          <ThemeToggle className={cn('h-12 w-12 shrink-0 rounded-full', PILL)} />
        </div>
      </div>
    </>
  )
}
