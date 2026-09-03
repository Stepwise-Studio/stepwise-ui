'use client'

import { useState } from 'react'
import { SelectionFrame } from '@/components/stepwise/selection-frame'

export function SelectionFrameBasicPreview() {
  return (
    <div className="flex flex-col items-center gap-10 py-6">
      <SelectionFrame padding={6}>
        <span className="text-[28px] font-semibold tracking-tight text-zinc-900 dark:text-white">
          Consistent by Default
        </span>
      </SelectionFrame>
    </div>
  )
}

export function SelectionFrameHandlesPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-10 py-4">
      {(['square', 'circle'] as const).map(h => (
        <div key={h} className="flex flex-col items-center gap-4">
          <SelectionFrame handles={h} padding={6}>
            <span className="text-[18px] font-medium text-zinc-800 dark:text-zinc-100">Selected</span>
          </SelectionFrame>
          <span className="text-[12px] text-zinc-400 dark:text-zinc-500">{h}</span>
        </div>
      ))}
    </div>
  )
}

export function SelectionFrameLinesPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-10 py-4">
      {(['solid', 'dashed', 'long'] as const).map(l => (
        <div key={l} className="flex flex-col items-center gap-4">
          <SelectionFrame line={l} padding={6}>
            <span className="text-[18px] font-medium text-zinc-800 dark:text-zinc-100 capitalize">{l}</span>
          </SelectionFrame>
          <span className="text-[12px] text-zinc-400 dark:text-zinc-500">{l}</span>
        </div>
      ))}
    </div>
  )
}

export function SelectionFrameAnimatedPreview() {
  const [k, setK] = useState(0)
  return (
    <div className="flex flex-col items-center gap-9 py-2">
      <div key={k} className="flex flex-wrap items-center justify-center gap-x-14 gap-y-10">
        <div className="flex flex-col items-center gap-4">
          <SelectionFrame animated line="dashed" padding={6}>
            <span className="text-[18px] font-medium text-zinc-800 dark:text-zinc-100">Marching ants</span>
          </SelectionFrame>
          <span className="text-[12px] text-zinc-400 dark:text-zinc-500">animated · dashed</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <SelectionFrame animated line="long" color="#e11d48" handles="circle" padding={6}>
            <span className="text-[18px] font-medium text-zinc-800 dark:text-zinc-100">Long dashes</span>
          </SelectionFrame>
          <span className="text-[12px] text-zinc-400 dark:text-zinc-500">animated · long</span>
        </div>
      </div>
      <button
        onClick={() => setK(k + 1)}
        className="px-3 h-9 rounded-full text-[13px] font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-[0.96] transition-[background-color,scale] duration-150"
      >
        Replay
      </button>
    </div>
  )
}

// A hero-style hook line with the one word the frame is meant to sell
// wrapped in it - this is what the component is *for*, shown at the scale
// it's actually used at, instead of a cluttered grab-bag of unrelated demos.
export function SelectionFrameUsagePreview() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <span className="text-[34px] sm:text-[42px] font-semibold tracking-tight leading-tight text-zinc-900 dark:text-white">
        Draw attention to what{' '}
        <SelectionFrame animated line="dashed" padding={4} handles="circle">
          matters
        </SelectionFrame>
      </span>
    </div>
  )
}
