'use client'

import { useState } from 'react'
import { Calendar, CalendarRange } from '@/components/stepwise/calendar'

export function CalendarPreview() {
  const [date, setDate] = useState<Date | null>(null)
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <Calendar selected={date} onSelect={setDate} />
    </div>
  )
}

export function CalendarRangePreview() {
  const [from, setFrom] = useState<Date | null>(null)
  const [to,   setTo]   = useState<Date | null>(null)
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <CalendarRange from={from} to={to} onRangeChange={(f, t) => { setFrom(f); setTo(t) }} />
    </div>
  )
}
