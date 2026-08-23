'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/stepwise/checkbox'

export function CheckboxStatesPreview() {
  const [checked, setChecked] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
    </div>
  )
}

export function CheckboxSizesPreview() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <Checkbox size="sm"      label="Small"   defaultChecked />
      <Checkbox size="default" label="Default" defaultChecked />
      <Checkbox size="lg"      label="Large"   defaultChecked />
    </div>
  )
}

export function CheckboxGroupPreview() {
  const items = ['Notifications', 'Marketing emails', 'Product updates', 'Security alerts']
  const [selected, setSelected] = useState<Set<string>>(new Set(['Notifications']))

  const toggle = (item: string) => {
    const next = new Set(selected)
    next.has(item) ? next.delete(item) : next.add(item)
    setSelected(next)
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map(item => (
        <Checkbox
          key={item}
          label={item}
          checked={selected.has(item)}
          onChange={() => toggle(item)}
        />
      ))}
    </div>
  )
}

export function CheckboxIndeterminatePreview() {
  const items = ['Design system', 'Component library', 'Documentation']
  const [selected, setSelected] = useState<Set<string>>(new Set(['Design system']))

  const allChecked = selected.size === items.length
  const someChecked = selected.size > 0 && selected.size < items.length

  const toggleAll = () => {
    setSelected(allChecked ? new Set() : new Set(items))
  }

  const toggle = (item: string) => {
    const next = new Set(selected)
    next.has(item) ? next.delete(item) : next.add(item)
    setSelected(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        label="Select all"
        checked={allChecked}
        indeterminate={someChecked}
        onChange={toggleAll}
      />
      <div className="flex flex-col gap-2.5 pl-6">
        {items.map(item => (
          <Checkbox
            key={item}
            label={item}
            checked={selected.has(item)}
            onChange={() => toggle(item)}
          />
        ))}
      </div>
    </div>
  )
}

export function CheckboxDisabledPreview() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <Checkbox label="Unchecked disabled" disabled />
      <Checkbox label="Checked disabled" defaultChecked disabled />
      <Checkbox label="Indeterminate disabled" indeterminate disabled />
    </div>
  )
}
