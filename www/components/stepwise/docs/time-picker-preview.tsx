'use client'

import { useState } from 'react'
import { TimePicker } from '@/components/stepwise/time-picker'

export function TimePickerPreview() {
  const [v, setV] = useState('09:30')
  const [open, setOpen] = useState(false)
  return (
    <div className="w-full max-w-xs">
      <TimePicker label="Start time" value={v} onChange={setV} onOpenChange={setOpen} />
      <div
        aria-hidden
        style={{ height: open ? 250 : 12, transition: 'height 280ms cubic-bezier(0.22,1,0.36,1)' }}
      />
    </div>
  )
}

export function TimePicker24Preview() {
  const [v, setV] = useState('17:00')
  const [open, setOpen] = useState(false)
  return (
    <div className="w-full max-w-xs">
      <TimePicker label="Ends at (24h, 15m steps)" value={v} onChange={setV} use12Hour={false} step={15} onOpenChange={setOpen} />
      <div
        aria-hidden
        style={{ height: open ? 250 : 12, transition: 'height 280ms cubic-bezier(0.22,1,0.36,1)' }}
      />
    </div>
  )
}
