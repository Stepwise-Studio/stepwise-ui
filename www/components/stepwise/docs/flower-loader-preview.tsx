'use client'

import { FlowerLoader } from '@/components/stepwise/flower-loader'

export function FlowerBasicPreview() {
  return (
    <div className="flex items-center justify-center py-6">
      <FlowerLoader size={120} />
    </div>
  )
}

export function FlowerVariantsPreview() {
  const variants = [
    { label: 'rose',    petalColor: '#fb7185', centerColor: '#fbbf24', petals: 6 },
    { label: 'violet',  petalColor: '#a78bfa', centerColor: '#f9a8d4', petals: 8 },
    { label: 'sky',     petalColor: '#38bdf8', centerColor: '#fde047', petals: 5 },
    { label: 'peach',   petalColor: '#fb923c', centerColor: '#fecaca', petals: 7 },
  ]
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 py-4">
      {variants.map(v => (
        <div key={v.label} className="flex flex-col items-center gap-3">
          <FlowerLoader size={84} petals={v.petals} petalColor={v.petalColor} centerColor={v.centerColor} />
          <span className="text-[12px] text-zinc-400 dark:text-zinc-500">{v.label}</span>
        </div>
      ))}
    </div>
  )
}
