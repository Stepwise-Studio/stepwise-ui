'use client'

import { useState } from 'react'
import { Multiselect } from '@/components/stepwise/multiselect'

const FLAVORS = [
  { value: 'vanilla',       label: 'Vanilla' },
  { value: 'chocolate',     label: 'Chocolate' },
  { value: 'strawberry',    label: 'Strawberry' },
  { value: 'black-current', label: 'Black Current' },
  { value: 'pistachio',     label: 'Pistachio' },
  { value: 'mango',         label: 'Mango' },
]

const SKILLS = [
  { value: 'react',      label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'nextjs',     label: 'Next.js' },
  { value: 'tailwind',   label: 'Tailwind CSS' },
  { value: 'node',       label: 'Node.js' },
  { value: 'graphql',    label: 'GraphQL' },
]

export function MultiselectBasicPreview() {
  return (
    <div className="w-full max-w-xs">
      <Multiselect options={FLAVORS} placeholder="Choose flavors" />
    </div>
  )
}

export function MultiselectWithLabelPreview() {
  const [flavors, setFlavors] = useState<string[]>(['chocolate', 'black-current'])
  return (
    <div className="w-full max-w-xs flex flex-col gap-4">
      <Multiselect
        label="Ice cream flavors"
        options={FLAVORS}
        value={flavors}
        onChange={setFlavors}
        placeholder="Pick your favorites"
      />
      <Multiselect
        label="Skills"
        options={SKILLS}
        placeholder="Select skills"
      />
    </div>
  )
}

export function MultiselectControlledPreview() {
  const [values, setValues] = useState<string[]>(['react', 'typescript'])
  return (
    <div className="w-full max-w-xs flex flex-col gap-3">
      <Multiselect label="Skills" options={SKILLS} value={values} onChange={setValues} />
      <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
        {values.length === 0 ? 'None selected' : `Selected: ${values.join(', ')}`}
      </p>
    </div>
  )
}

export function MultiselectOverflowPreview() {
  const [values, setValues] = useState<string[]>(['vanilla', 'chocolate', 'strawberry', 'pistachio'])
  return (
    <div className="w-full max-w-xs">
      <Multiselect
        label="Flavors (max 2 visible)"
        options={FLAVORS}
        value={values}
        onChange={setValues}
        placeholder="Select flavors"
        maxVisible={2}
      />
    </div>
  )
}
