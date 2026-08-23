'use client'

import { Separator } from '@/components/stepwise/separator'

export function SeparatorHorizontalPreview() {
  return (
    <div className="flex w-full max-w-[300px] flex-col gap-4 text-center">
      <span className="text-[14px] text-zinc-600 dark:text-zinc-300">Account settings</span>
      <Separator />
      <span className="text-[14px] text-zinc-600 dark:text-zinc-300">Danger zone</span>
    </div>
  )
}

export function SeparatorLabelPreview() {
  return (
    <div className="w-full max-w-[300px]">
      <Separator label="OR" />
    </div>
  )
}

export function SeparatorVerticalPreview() {
  return (
    <div className="flex h-6 items-center gap-4 text-[14px] text-zinc-600 dark:text-zinc-300">
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Guides</span>
      <Separator orientation="vertical" />
      <span>API</span>
    </div>
  )
}
