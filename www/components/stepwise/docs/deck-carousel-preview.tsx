'use client'

import { useState } from 'react'
import { DeckCarousel, type DeckCarouselItem } from '@/components/stepwise/deck-carousel'
import { Segment } from '@/components/stepwise/segment'

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=380&h=500&q=80`

export const deckItems: DeckCarouselItem[] = [
  { src: u('photo-1506905925346-21bda4d32df4'), alt: 'A still lake under a mountain range', title: 'Mirror Lake',   subtitle: 'Alpine · 3 day route',  badge: '4.9' },
  { src: u('photo-1441974231531-c6227db76b6e'), alt: 'Sunlight through a dense forest',     title: 'Cedar Deep',    subtitle: 'Woodland · Easy',       badge: '4.6' },
  { src: u('photo-1519681393784-d120267933ba'), alt: 'A mountain ridge at night',           title: 'The Long Ridge', subtitle: 'Summit · Hard',        badge: '4.8' },
  { src: u('photo-1472214103451-9374bd1c798e'), alt: 'Green hills rolling to a horizon',    title: 'Low Fields',    subtitle: 'Meadow · Easy',         badge: '4.4' },
  { src: u('photo-1439066615861-d1af74d74000'), alt: 'A snowbound treeline',                title: 'White Pass',    subtitle: 'Winter · Hard',         badge: '4.7' },
  { src: u('photo-1426604966848-d7adac402bff'), alt: 'A wide valley in morning light',      title: 'Belle Valley',  subtitle: 'Lowland · Moderate',    badge: '4.5' },
]

export function DeckCarouselPreview() {
  return <DeckCarousel items={deckItems} />
}

const SHAPES = [
  { value: 'shelf', label: 'Shelf' },
  { value: 'hand',  label: 'Held hand' },
] as const

type ShapeId = typeof SHAPES[number]['value']

const SHAPE: Record<ShapeId, { spread: number; tilt: number; lift: number; scaleStep: number }> = {
  shelf: { spread: 84, tilt: 7,  lift: 18, scaleStep: 0.07 },
  hand:  { spread: 50, tilt: 12, lift: 9,  scaleStep: 0.09 },
}

export function DeckCarouselShapePreview() {
  const [shape, setShape] = useState<ShapeId>('shelf')
  const p = SHAPE[shape]

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <DeckCarousel items={deckItems} itemWidth={150} {...p} visible={3} />
      <Segment
        size="sm"
        options={SHAPES.map(({ value, label }) => ({ value, label }))}
        value={shape}
        onChange={setShape}
      />
    </div>
  )
}

export function DeckCarouselPlainPreview() {
  return (
    <DeckCarousel
      items={deckItems.map(({ src, alt }) => ({ src, alt }))}
      itemWidth={170}
      ratio={1}
      radius={26}
    />
  )
}
