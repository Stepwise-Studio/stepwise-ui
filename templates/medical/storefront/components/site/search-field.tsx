'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { Surface } from '@/components/stepwise/primitives/surface'
import { cn } from '@/lib/utils/cn'

/**
 * The search control. One implementation, three placements: the header bar, the
 * mobile sheet, and the top of the medicines listing.
 *
 * It is a real `<form role="search">` with a submit, so Enter works, the
 * browser offers the field to autofill, and the result is a URL - which means a
 * search can be bookmarked, shared and rendered on the server.
 */
export function SearchField({
  className,
  defaultValue = '',
  autoFocus,
  size = 'default',
}: {
  className?   : string
  defaultValue?: string
  autoFocus?   : boolean
  size?        : 'default' | 'lg'
}) {
  const router = useRouter()
  const [q, setQ] = useState(defaultValue)
  const lg = size === 'lg'

  return (
    <form
      role="search"
      className={cn('min-w-0', className)}
      onSubmit={e => {
        e.preventDefault()
        router.push(q.trim() ? `/medicines?q=${encodeURIComponent(q.trim())}` : '/medicines')
      }}
    >
      <Surface
        radius={lg ? 18 : 16}
        className={cn(
          'relative flex w-full items-center bg-[var(--surface-raised)]',
          lg ? 'h-12' : 'h-10',
        )}
        lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
      >
        <HugeiconsIcon
          icon={Search01Icon}
          size={lg ? 19 : 17}
          strokeWidth={1.8}
          color="currentColor"
          className={cn('pointer-events-none absolute text-zinc-400 dark:text-zinc-500', lg ? 'left-4' : 'left-3')}
        />
        <input
          type="search"
          name="q"
          value={q}
          autoFocus={autoFocus}
          onChange={e => setQ(e.target.value)}
          aria-label="Search medicines"
          placeholder="Search by name or salt"
          /* 16px on mobile: below that, iOS Safari zooms the page on focus and
             never zooms back out. */
          className={cn(
            'h-full w-full bg-transparent pr-3 text-[16px] tracking-[-0.02em] text-zinc-800 outline-none',
            'placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500',
            lg ? 'pl-11 sm:text-[15px]' : 'pl-9 sm:text-[14px]',
          )}
        />
      </Surface>
    </form>
  )
}
