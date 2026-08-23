'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Home01Icon, File01Icon, PlusSignIcon, Sun03Icon } from '@hugeicons/core-free-icons'
import { CommandPalette } from '@/components/stepwise/command'
import { Button } from '@/components/stepwise/button'
import { Kbd } from '@/components/stepwise/kbd'

const iconProps = { size: 16, strokeWidth: 1.6, color: 'currentColor' } as const
const home = <HugeiconsIcon icon={Home01Icon} {...iconProps} />
const doc = <HugeiconsIcon icon={File01Icon} {...iconProps} />
const plus = <HugeiconsIcon icon={PlusSignIcon} {...iconProps} />
const sun = <HugeiconsIcon icon={Sun03Icon} {...iconProps} />

const groups = [
  { heading: 'Navigation', items: [
    { id: 'home', label: 'Go to Home', icon: home, shortcut: ['G', 'H'] },
    { id: 'docs', label: 'Go to Docs', icon: doc, keywords: 'documentation guides', shortcut: ['G', 'D'] },
  ]},
  { heading: 'Actions', items: [
    { id: 'new', label: 'Create new project', icon: plus, keywords: 'add', shortcut: ['⌘', 'N'] },
    { id: 'theme', label: 'Toggle theme', icon: sun, keywords: 'dark light mode' },
  ]},
]

export function CommandPreview() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        <span className="flex items-center gap-2">Open command palette <Kbd keys={['⌘', 'K']} /></span>
      </Button>
      <p className="text-[12px] text-zinc-400 dark:text-zinc-500">…or just press ⌘K anywhere on this page.</p>
      <CommandPalette open={open} onOpenChange={setOpen} groups={groups} />
    </div>
  )
}
