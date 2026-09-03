'use client'

import { useState } from 'react'
import { DatePicker } from '@/components/stepwise/date-picker'

// Height each variant's calendar popover needs below its input.
const CAL_H = { date: 400, range: 490, text: 400 } as const
type OpenKey = keyof typeof CAL_H
const EASE = 'cubic-bezier(0.22,1,0.36,1)'

export function DatePickerPreview() {
  const [date,  setDate]  = useState<Date | null>(null)
  const [from,  setFrom]  = useState<Date | null>(null)
  const [to,    setTo]    = useState<Date | null>(null)
  const [typed, setTyped] = useState<Date | null>(null)
  const [open,  setOpen]  = useState<OpenKey | null>(null)

  // Reserve inline space directly beneath the invoked input so the (allowOverflow)
  // box grows in place and the sibling inputs merely slide down - never off-screen.
  const Spacer = ({ k }: { k: OpenKey }) => (
    <div aria-hidden style={{ height: open === k ? CAL_H[k] + 16 : 0, transition: `height 300ms ${EASE}` }} />
  )

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[340px] flex flex-col gap-4">
        <div>
          <DatePicker variant="date" label="Date" value={date} onChange={setDate}
            onOpenChange={o => setOpen(o ? 'date' : null)} />
          <Spacer k="date" />
        </div>
        <div>
          <DatePicker variant="range" label="Date range" from={from} to={to}
            onRangeChange={(f, t) => { setFrom(f); setTo(t) }}
            onOpenChange={o => setOpen(o ? 'range' : null)} />
          <Spacer k="range" />
        </div>
        <div>
          <DatePicker variant="text" label="Date of birth" value={typed} onChange={setTyped}
            onOpenChange={o => setOpen(o ? 'text' : null)} />
          <Spacer k="text" />
        </div>
      </div>
    </div>
  )
}
