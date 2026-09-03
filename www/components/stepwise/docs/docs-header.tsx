'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import { GithubIcon, Home01Icon, Moon02Icon, Sun01Icon } from '@hugeicons/core-free-icons'
import { ThemeToggle } from '@/components/stepwise/theme-toggle'
import { CommandPalette, type CommandGroup } from '@/components/stepwise/command'
import { Kbd } from '@/components/stepwise/kbd'
import { MobileBottomNav, MobileTopBar } from './mobile-bottom-nav'
import { useTheme } from '@/lib/theme'

const REPO_URL = 'https://github.com/Stepwise-Studio/stepwise-ui'

interface NavItem { href: string; label: string }
interface NavSection { label: string; items: NavItem[] }

const iconProps = { size: 16, strokeWidth: 1.6, color: 'currentColor' } as const

export function DocsHeader({ sections }: { sections: NavSection[] }) {
  const [cmdOpen, setCmdOpen] = useState(false)
  const router = useRouter()
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'

  const groups: CommandGroup[] = [
    {
      heading: 'General',
      items: [
        {
          id: 'go-home',
          label: 'Go to home',
          icon: <HugeiconsIcon icon={Home01Icon} {...iconProps} />,
          onSelect: () => router.push('/'),
        },
        {
          id: 'toggle-theme',
          label: 'Toggle theme',
          // Same icon language as the standalone `ThemeToggle` button next to
          // this palette's trigger - shows the *current* theme, not the one
          // a click would switch to.
          icon: <HugeiconsIcon icon={dark ? Moon02Icon : Sun01Icon} {...iconProps} />,
          keywords: 'dark light mode appearance',
          // `toggle` reads clientX/clientY to center the view-transition
          // circular reveal - there's no real click point from a keyboard-
          // selected palette row, so it expands from screen center instead.
          onSelect: () => toggle({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 } as React.MouseEvent),
        },
      ],
    },
    ...sections.map(section => ({
      heading: section.label,
      items: section.items.map(item => ({
        id: item.href,
        label: item.label,
        onSelect: () => router.push(item.href),
      })),
    })),
  ]

  return (
    <>
      {/* Sticky top bar - desktop only now. Below `md`, `MobileTopBar`
          (brand + github, its own lighter bar) and `MobileBottomNav`
          (page nav/theme/search, bottom pills) are the entire mobile chrome
          instead of a shrunk-down version of this one. Every zone still
          gets an explicit `col-start` - without it, the
          search button being `display:none` below `sm` (relevant again if
          this bar's own breakpoint ever moves below `md`) drops out of CSS
          Grid's implicit auto-placement entirely, and the *next* DOM child
          (the github/theme group) slides into the now-empty column 2
          instead of column 3, landing short of the true right edge instead
          of flush against it. */}
      {/* The bar itself spans the viewport so its border and blur run edge to
          edge, but the row inside is capped to the same 1400px container the
          docs layout uses. Without that, past 1400px the page keeps centring
          while the header does not, and the logo drifts to the far left while
          the sidebar beneath it stays put. */}
      <header className="sticky top-0 z-40 hidden h-16 md:block border-b border-zinc-100 dark:border-zinc-900 bg-white/85 dark:bg-[oklch(0.09_0_0)]/85 backdrop-blur-md">
      <div className="mx-auto grid h-full max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-4">
        {/* Left - brand. The mobile hamburger + slide-over drawer this used
            to have is gone - `MobileBottomNav` below is the small-screen
            navigation surface now, so there's nothing left for a drawer to
            duplicate. */}
        <div className="col-start-1 flex items-center gap-1 justify-self-start">
          <Link
            href="/"
            // Same logo scale as the landing page's own nav (16px mark,
            // 19px wordmark, gap-2.5) - it used to render noticeably
            // smaller here (12px mark, 15px `h6`), which read as a
            // different brand mark rather than the same one persisting
            // across pages.
            className="flex items-center gap-2.5 px-2"
          >
            <Image
              src={dark ? '/brand/logo-mark-dark.svg' : '/brand/logo-mark.svg'}
              alt=""
              width={41}
              height={16}
              className="h-4 w-auto"
            />
            {/* Below `md` the wordmark's ~130px doesn't fit next to the
                search box and github/theme icons in the same row - it used
                to reveal at `sm` instead, which still wrapped to two lines
                (confirmed live) because the hamburger button was *also*
                still on-screen there. Now that the hamburger is gone
                entirely, `md` - where this column has real room - is the
                right threshold. */}
            <span className="hidden text-[19px] font-semibold tracking-[-0.03em] text-zinc-900 md:inline dark:text-white">Stepwise UI</span>
          </Link>
        </div>

        {/* Center - search. Filled instead of just outlined, and wider -
            an outlined 13px trigger read as an afterthought next to the
            brand mark and icons on either side of it. */}
        <button
          onClick={() => setCmdOpen(true)}
          // The center grid column is `auto`-width, so `w-full` alone has
          // nothing to stretch against - it collapses to content size the
          // same as no width class at all. An explicit width is what
          // actually widens it.
          className="col-start-2 hidden h-9 w-64 md:w-80 cursor-pointer items-center gap-2 rounded-full bg-zinc-100 px-3.5 text-[13px] text-zinc-500 transition-colors hover:bg-zinc-200/70 hover:text-zinc-800 sm:flex dark:bg-zinc-800/60 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="shrink-0">
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 3 3" />
          </svg>
          {/* The label used to be a bare text node between the icon and
              `Kbd` - with no flex-growing sibling, `⌘K` just trailed the
              text by one `gap` step instead of sitting at the button's
              right edge. Making the label its own `flex-1` child gives it
              the growable slot that pushes `Kbd` there. */}
          <span className="flex-1 text-left">Search docs</span>
          <Kbd>⌘K</Kbd>
        </button>

        {/* Right - github + theme. Same translucent hover fill as the
            landing page's nav (`zinc-900/5` / `white/10`), not the opaque
            `zinc-100` this used before. */}
        <div className="col-start-3 flex items-center gap-1 justify-self-end">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="flex items-center justify-center w-9 h-9 rounded-full text-zinc-500 transition-colors duration-150 hover:bg-zinc-900/5 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-200"
          >
            <HugeiconsIcon icon={GithubIcon} size={18} strokeWidth={1.8} color="currentColor" />
          </a>
          <ThemeToggle />
        </div>
      </div>
      </header>

      <CommandPalette
        groups={groups}
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        placeholder="Search components, effects, cards…"
      />

      <MobileTopBar />
      <MobileBottomNav sections={sections} />
    </>
  )
}
