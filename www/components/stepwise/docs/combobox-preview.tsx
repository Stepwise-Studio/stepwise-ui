'use client'

import { useState } from 'react'
import { Combobox } from '@/components/stepwise/combobox'

const FRAMEWORKS = [
  { value: 'next',      label: 'Next.js',   description: 'The React framework for the web' },
  { value: 'remix',     label: 'Remix',     description: 'Full stack web framework' },
  { value: 'astro',     label: 'Astro',     description: 'Content-driven websites' },
  { value: 'nuxt',      label: 'Nuxt',      description: 'The intuitive Vue framework' },
  { value: 'sveltekit', label: 'SvelteKit', description: 'Web development, streamlined' },
  { value: 'solid',     label: 'SolidStart', description: 'Fine-grained reactivity' },
  { value: 'qwik',      label: 'Qwik City', description: 'Resumable applications' },
]

const COUNTRIES = [
  { value: 'in', label: 'India' },
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
  { value: 'br', label: 'Brazil' },
  { value: 'au', label: 'Australia' },
  { value: 'ca', label: 'Canada' },
]

export function ComboboxBasicPreview() {
  const [v, setV] = useState('')
  return (
    <div className="w-full max-w-xs">
      <Combobox label="Framework" options={FRAMEWORKS} value={v} onChange={setV} placeholder="Search frameworks…" />
    </div>
  )
}

export function ComboboxPlainPreview() {
  const [v, setV] = useState('in')
  return (
    <div className="w-full max-w-xs">
      <Combobox label="Country" options={COUNTRIES} value={v} onChange={setV} placeholder="Search countries…" />
    </div>
  )
}

export function ComboboxEmptyPreview() {
  return (
    <div className="w-full max-w-xs">
      <Combobox
        label="Try typing “zzz”"
        options={COUNTRIES}
        placeholder="Search countries…"
        emptyMessage="Nothing matches that search"
      />
    </div>
  )
}
