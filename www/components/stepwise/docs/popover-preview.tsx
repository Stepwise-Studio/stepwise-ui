'use client'

import { Popover } from '@/components/stepwise/popover'
import { Button } from '@/components/stepwise/button'
import { Input } from '@/components/stepwise/input'

export function PopoverBasicPreview() {
  return (
    <Popover trigger={<Button>Open popover</Button>}>
      <div className="flex w-[240px] flex-col gap-3">
        <div>
          <p className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">Rename project</p>
          <p className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400">Give it a memorable name.</p>
        </div>
        <Input label="" aria-label="Project name" placeholder="stepwise-ui" />
        <Button size="sm" fullWidth>Save</Button>
      </div>
    </Popover>
  )
}

export function PopoverSidePreview() {
  return (
    <div className="flex items-center gap-3">
      <Popover side="top" trigger={<Button size="sm" variant="soft">Top</Button>}>
        <p className="w-[180px] text-[13px] text-zinc-600 dark:text-zinc-300">Opens above the trigger.</p>
      </Popover>
      <Popover align="start" trigger={<Button size="sm" variant="soft">Align start</Button>}>
        <p className="w-[180px] text-[13px] text-zinc-600 dark:text-zinc-300">Left edge follows the trigger.</p>
      </Popover>
    </div>
  )
}
