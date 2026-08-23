'use client'

import { useState } from 'react'
import { Slider } from '@/components/stepwise/slider'

export function SliderBasicPreview() {
  const [v, setV] = useState(40)
  return (
    <div className="w-full max-w-sm">
      <Slider label="Width" value={v} onChange={val => setV(val as number)} min={0} max={100} />
    </div>
  )
}

export function SliderDotsPreview() {
  const [v, setV] = useState(0)
  return (
    <div className="w-full max-w-sm">
      <Slider variant="dots" label="Shape" value={v} onChange={val => setV(val as number)} min={0} max={8} step={1} dotCount={9} />
    </div>
  )
}

export function SliderRangePreview() {
  const [v, setV] = useState<[number, number]>([240, 680])
  return (
    <div className="w-full max-w-sm">
      <Slider variant="range" label="Radius" value={v} onChange={val => setV(val as [number, number])} min={0} max={1000} />
    </div>
  )
}

export function SliderClassicalPreview() {
  const [v, setV] = useState(50)
  const [rating, setRating] = useState(3)
  const [range, setRange] = useState<[number, number]>([20, 75])
  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <Slider classical label="Volume" value={v} onChange={val => setV(val as number)} formatValue={n => `${n}%`} />
      <Slider classical variant="dots" label="Rating" value={rating} onChange={val => setRating(val as number)} min={0} max={8} step={1} dotCount={9} />
      <Slider classical variant="range" label="Price" value={range} onChange={val => setRange(val as [number, number])} formatValue={n => `$${n}`} />
    </div>
  )
}

export function SliderShowcasePreview() {
  const [a, setA] = useState(64)
  const [b, setB] = useState(3)
  const [c, setC] = useState<[number, number]>([20, 75])
  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <Slider label="Opacity" value={a} onChange={v => setA(v as number)} formatValue={n => `${n}%`} />
      <Slider variant="dots" label="Weight" value={b} onChange={v => setB(v as number)} min={0} max={6} dotCount={7} />
      <Slider variant="range" label="Price" value={c} onChange={v => setC(v as [number, number])} formatValue={n => `$${n}`} />
    </div>
  )
}
