'use client'

import { useState } from 'react'
import { Input, type InputVariant } from '@/components/stepwise/input'
import { Segment } from '@/components/stepwise/segment'

const VARIANTS: { value: InputVariant; label: string; hint?: string }[] = [
  { value: 'name',     label: 'Name',     hint: 'Your full legal name.' },
  { value: 'email',    label: 'Email',    hint: 'We\'ll never share your email.' },
  { value: 'username', label: 'Username', hint: 'Letters, numbers, and underscores only.' },
  { value: 'password', label: 'Password', hint: 'Must be at least 8 characters.' },
  { value: 'text',     label: 'Text',     hint: 'A plain single-line text field.' },
]

export function InputVariantPreview() {
  const [active, setActive] = useState<InputVariant>('name')
  const current = VARIANTS.find(v => v.value === active)!

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <Segment
        options={VARIANTS}
        value={active}
        onChange={(v) => setActive(v as InputVariant)}
      />
      <div className="w-full max-w-[320px]">
        <Input key={active} variant={active} hint={current.hint} />
      </div>
    </div>
  )
}
