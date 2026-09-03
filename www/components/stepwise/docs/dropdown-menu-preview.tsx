'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { PencilEdit02Icon, Copy01Icon, Delete02Icon, UserIcon, CreditCardIcon, Share01Icon, Mail01Icon, Link01Icon } from '@hugeicons/core-free-icons'
import { DropdownMenu, type DropdownEntry } from '@/components/stepwise/dropdown-menu'
import { Button } from '@/components/stepwise/button'

const iconProps = { size: 15, strokeWidth: 2, color: 'currentColor' } as const
const edit  = <HugeiconsIcon icon={PencilEdit02Icon} {...iconProps} />
const copy  = <HugeiconsIcon icon={Copy01Icon} {...iconProps} />
const trash = <HugeiconsIcon icon={Delete02Icon} {...iconProps} />
const user  = <HugeiconsIcon icon={UserIcon} {...iconProps} />
const card  = <HugeiconsIcon icon={CreditCardIcon} {...iconProps} />
const share = <HugeiconsIcon icon={Share01Icon} {...iconProps} />
const mail  = <HugeiconsIcon icon={Mail01Icon} {...iconProps} />
const link  = <HugeiconsIcon icon={Link01Icon} {...iconProps} />

export function DropdownBasicPreview() {
  return (
    <DropdownMenu
      trigger={<Button size="sm">Actions</Button>}
      items={[
        { heading: 'Manage' },
        { label: 'Edit', icon: edit, shortcut: '⌘E' },
        { label: 'Duplicate', icon: copy, shortcut: '⌘D' },
        { separator: true },
        { label: 'Delete', icon: trash, destructive: true },
      ]}
    />
  )
}

// ─── Text only - no icon prop passed, so no icon gutter is reserved ───────────
export function DropdownTextOnlyPreview() {
  return (
    <DropdownMenu
      trigger={<Button size="sm">Account</Button>}
      items={[
        { label: 'Profile' },
        { label: 'Billing' },
        { label: 'Team settings' },
        { separator: true },
        { label: 'Sign out', destructive: true },
      ]}
    />
  )
}

// ─── Nested - items with their own `items` become submenu triggers ───────────
export function DropdownNestedPreview() {
  return (
    // Horizontally centered (matches the other demos) but top-anchored -
    // the panel only grows downward, so vertical centering left almost no
    // room below it; self-start overrides just the box's vertical centering.
    // Horizontal overflow is already handled for real by the submenu's own
    // auto-flip against the actual viewport, not this box.
    <div className="flex w-full justify-center self-start">
      <DropdownMenu
        trigger={<Button size="sm">File Actions</Button>}
        items={[
          { label: 'Edit', icon: edit, shortcut: '⌘E' },
          {
            label: 'Share',
            icon: share,
            items: [
              { label: 'Copy link', icon: link },
              { label: 'Invite by email', icon: mail },
            ],
          },
          {
            label: 'Account',
            icon: user,
            items: [
              { label: 'Profile', icon: user },
              { label: 'Billing', icon: card },
            ],
          },
          { separator: true },
          { label: 'Duplicate', icon: copy, shortcut: '⌘D' },
          { label: 'Delete', icon: trash, destructive: true },
        ]}
      />
    </div>
  )
}

export function DropdownAlignPreview() {
  const items: DropdownEntry[] = [
    { label: 'Profile' },
    { label: 'Billing' },
    { separator: true },
    { label: 'Sign out', destructive: true },
  ]
  return (
    <div className="flex w-full items-start justify-between">
      <DropdownMenu
        trigger={<Button size="sm">Aligned start</Button>}
        items={items}
      />
      <DropdownMenu
        align="end"
        trigger={<Button size="sm">Aligned end</Button>}
        items={items}
      />
    </div>
  )
}
