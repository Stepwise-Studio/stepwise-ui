'use client'

import { useState } from 'react'
import { Toggle } from '@/components/stepwise/toggle'

export function TogglePreview() {
  const [on, setOn] = useState(true)
  return <Toggle checked={on} onChange={setOn} ariaLabel="Toggle" />
}

export function ToggleSizesPreview() {
  return (
    <div className="flex items-center gap-8">
      {(['sm', 'default', 'lg'] as const).map(s => (
        <div key={s} className="flex flex-col items-center gap-3">
          <Toggle size={s} defaultChecked ariaLabel={`${s} toggle`} />
          <span className="text-[12px] text-zinc-400 dark:text-zinc-500">{s}</span>
        </div>
      ))}
    </div>
  )
}

export function ToggleLabelPreview() {
  const [a, setA] = useState(true)
  return (
    <div className="flex w-full max-w-xs flex-col gap-5">
      <Toggle checked={a} onChange={setA} label="Email notifications" hint="Get a digest when something needs you." />
      <Toggle defaultChecked={false} label="Public profile" hint="Anyone with the link can view it." />
      <Toggle defaultChecked disabled label="Two-factor auth" hint="Enforced by your organisation." />
    </div>
  )
}
