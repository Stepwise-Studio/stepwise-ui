'use client'

import { useState } from 'react'
import { Radio } from '@/components/stepwise/radio'

export function RadioStatesPreview() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Radio label="Unchecked" />
      <Radio label="Checked" defaultChecked />
    </div>
  )
}

export function RadioSizesPreview() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <Radio size="sm"      label="Small"   defaultChecked />
      <Radio size="default" label="Default" defaultChecked />
      <Radio size="lg"      label="Large"   defaultChecked />
    </div>
  )
}

export function RadioGroupPreview() {
  const options = [
    { value: 'free',    label: 'Free',       desc: 'Up to 3 projects' },
    { value: 'pro',     label: 'Pro',        desc: '$12 / month' },
    { value: 'team',    label: 'Team',       desc: '$8 / seat / month' },
    { value: 'enterprise', label: 'Enterprise', desc: 'Custom pricing' },
  ]
  const [value, setValue] = useState('pro')

  return (
    <div className="flex flex-col gap-3">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-3 cursor-pointer select-none group">
          <Radio
            name="plan"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => setValue(opt.value)}
          />
          <span className="flex flex-col">
            <span className="text-[14px] font-medium text-zinc-900 dark:text-white leading-none">{opt.label}</span>
            <span className="text-[12px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-none">{opt.desc}</span>
          </span>
        </label>
      ))}
    </div>
  )
}

export function RadioDisabledPreview() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <Radio label="Unchecked disabled" disabled />
      <Radio label="Checked disabled" defaultChecked disabled />
    </div>
  )
}
