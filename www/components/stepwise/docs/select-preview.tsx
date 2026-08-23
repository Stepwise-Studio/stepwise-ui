'use client'

import { useState } from 'react'
import { Select } from '@/components/stepwise/select'

const FRAMEWORKS = [
  { value: 'next',      label: 'Next.js' },
  { value: 'remix',     label: 'Remix' },
  { value: 'astro',     label: 'Astro' },
  { value: 'nuxt',      label: 'Nuxt' },
  { value: 'sveltekit', label: 'SvelteKit' },
]

const TIMEZONES = [
  { value: 'utc', label: 'UTC (GMT+0)' },
  { value: 'est', label: 'Eastern (GMT-5)' },
  { value: 'pst', label: 'Pacific (GMT-8)' },
  { value: 'cet', label: 'Central European (GMT+1)' },
  { value: 'ist', label: 'India (GMT+5:30)' },
  { value: 'jst', label: 'Japan (GMT+9)' },
]

export function SelectBasicPreview() {
  return (
    <div className="w-full max-w-xs">
      <Select options={FRAMEWORKS} placeholder="Choose a framework" />
    </div>
  )
}

export function SelectWithLabelPreview() {
  return (
    <div className="w-full max-w-xs flex flex-col gap-4">
      <Select label="Framework" options={FRAMEWORKS} placeholder="Select a framework" />
      <Select label="Timezone"  options={TIMEZONES}  placeholder="Select timezone" />
    </div>
  )
}

export function SelectControlledPreview() {
  const [value, setValue] = useState('next')
  return (
    <div className="w-full max-w-xs flex flex-col gap-3">
      <Select label="Framework" options={FRAMEWORKS} value={value} onChange={setValue} />
      <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
        Selected: <span className="font-medium text-zinc-700 dark:text-zinc-300">{value}</span>
      </p>
    </div>
  )
}

export function SelectDisabledPreview() {
  return (
    <div className="w-full max-w-xs">
      <Select options={FRAMEWORKS} placeholder="Disabled select" disabled />
    </div>
  )
}
