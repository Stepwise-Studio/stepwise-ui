'use client'

import { useState } from 'react'
import { ColorPicker } from '@/components/stepwise/color-picker'

export function ColorPickerBasicPreview() {
  const [color, setColor] = useState('#3b82f6')
  return (
    <div className="flex flex-col items-center gap-6">
      <ColorPicker value={color} onChange={setColor} />
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm" style={{ background: color }} />
        <span className="text-[13px] font-mono tabular-nums text-zinc-600 dark:text-zinc-400">
          {color.toUpperCase()}
        </span>
      </div>
    </div>
  )
}

export function ColorPickerSizesPreview() {
  const [colors, setColors] = useState({ sm: '#3b82f6', md: '#ec4899', lg: '#22c55e' })
  const sizes = ['sm', 'md', 'lg'] as const
  return (
    <div className="flex items-end gap-6">
      {sizes.map(size => (
        <div key={size} className="flex flex-col items-center gap-2">
          <ColorPicker
            size={size}
            value={colors[size]}
            onChange={v => setColors(prev => ({ ...prev, [size]: v }))}
          />
          <span className="text-[12px] font-mono text-zinc-400 dark:text-zinc-500">{size}</span>
        </div>
      ))}
    </div>
  )
}

export function ColorPickerPresetsPreview() {
  const [color, setColor] = useState('#8b5cf6')
  return <ColorPicker value={color} onChange={setColor} showPresets />
}
