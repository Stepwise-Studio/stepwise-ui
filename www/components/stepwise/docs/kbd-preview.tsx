'use client'

import { Kbd } from '@/components/stepwise/kbd'

export function KbdBasicPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Kbd keys={['⌘', 'K']} />
      <Kbd keys={['⌘', '⇧', 'P']} />
      <Kbd>Esc</Kbd>
      <Kbd>Enter</Kbd>
    </div>
  )
}

export function KbdInlinePreview() {
  return (
    <p className="text-[14px] text-zinc-600 dark:text-zinc-300">
      Press <Kbd keys={['⌘', 'K']} /> to open the command palette, or <Kbd>/</Kbd> to search.
    </p>
  )
}
