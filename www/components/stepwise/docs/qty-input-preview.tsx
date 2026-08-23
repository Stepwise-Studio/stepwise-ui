'use client'

import { useState } from 'react'
import { QtyInput } from '@/components/stepwise/qty-input'

export function QtyInputBasicPreview() {
  const [qty, setQty] = useState(1)
  return (
    <div className="flex flex-col items-center gap-3">
      <QtyInput value={qty} onChange={setQty} min={1} max={99} />
      <p className="text-[12px] text-zinc-400 dark:text-zinc-500 tabular-nums">
        {qty} item{qty !== 1 ? 's' : ''} in cart
      </p>
    </div>
  )
}

export function QtyInputStatesPreview() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <QtyInput defaultValue={1} min={1} max={10} />
        <span className="text-[13px] text-zinc-400 dark:text-zinc-500">min=1, max=10</span>
      </div>
      <div className="flex items-center gap-4">
        <QtyInput defaultValue={5} step={5} min={0} />
        <span className="text-[13px] text-zinc-400 dark:text-zinc-500">step=5</span>
      </div>
      <div className="flex items-center gap-4">
        <QtyInput defaultValue={3} disabled />
        <span className="text-[13px] text-zinc-400 dark:text-zinc-500">disabled</span>
      </div>
    </div>
  )
}
