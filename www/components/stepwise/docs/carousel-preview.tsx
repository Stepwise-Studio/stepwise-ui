'use client'

import { useState } from 'react'
import { Carousel, type CarouselItem, type CarouselPattern } from '@/components/stepwise/carousel'
import { Text } from '@/components/stepwise/typography'
import { cn } from '@/lib/utils/cn'

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=280&h=360&q=80`

export const carouselItems: CarouselItem[] = [
  { src: u('photo-1494790108377-be9c29b29330'), alt: '' },
  { src: u('photo-1507003211169-0a1dd7228f2d'), alt: '' },
  { src: u('photo-1539571696357-5a69c17a67c6'), alt: '' },
  { src: u('photo-1524504388940-b1c1722653e1'), alt: '' },
  { src: u('photo-1500648767791-00dcc994a43e'), alt: '' },
  { src: u('photo-1534528741775-53994a69daeb'), alt: '' },
  { src: u('photo-1517841905240-472988babdf9'), alt: '' },
  { src: u('photo-1529626455594-4ff0802cfb7e'), alt: '' },
  { src: u('photo-1531746020798-e6953c6e4e04'), alt: '' },
  { src: u('photo-1506794778202-cad84cf45f1d'), alt: '' },
]

export const PATTERNS: { value: CarouselPattern; label: string }[] = [
  { value: 'helix',   label: 'Helix' },
  { value: 'deck',    label: 'Deck' },
  { value: 'marquee', label: 'Marquee' },
]

const COPY: Record<CarouselPattern, { title: string; line: string }> = {
  helix:   { title: 'A climbing strand',   line: 'The helix turns. The line stays.' },
  deck:    { title: 'Hover to spread',     line: 'A stack at rest. A fan on hover.' },
  marquee: { title: 'An endless strip',    line: 'Portraits drift. Copy floats in the centre.' },
}

function Copy({ pattern }: { pattern: CarouselPattern }) {
  const c = COPY[pattern]
  return (
    <div>
      <Text variant="h4" className="text-zinc-900 dark:text-white">{c.title}</Text>
      <Text variant="caption-soft" className="mt-1.5 text-zinc-500 dark:text-zinc-400">{c.line}</Text>
    </div>
  )
}

export function CarouselPlayground() {
  const [pattern, setPattern] = useState<CarouselPattern>('helix')
  const [copy, setCopy] = useState(true)

  return (
    <div className="flex w-full max-w-[720px] flex-col items-center gap-6">
      <Carousel items={carouselItems} pattern={pattern} className="w-full">
        {copy ? <Copy pattern={pattern} /> : null}
      </Carousel>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {PATTERNS.map(p => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPattern(p.value)}
            aria-pressed={pattern === p.value}
            className={cn(
              'h-8 rounded-xl px-3 text-[13px] font-medium transition-colors duration-150 active:scale-[0.96]',
              pattern === p.value
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setCopy(v => !v)}
        aria-pressed={copy}
        className={cn(
          'h-8 rounded-xl px-3 text-[13px] font-medium transition-colors duration-150 active:scale-[0.96]',
          copy
            ? 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100'
            : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800',
        )}
      >
        {copy ? 'Centre copy on' : 'Centre copy off'}
      </button>
    </div>
  )
}

export function CarouselHelixPreview() {
  return (
    <Carousel items={carouselItems} pattern="helix">
      <Copy pattern="helix" />
    </Carousel>
  )
}

export function CarouselDeckPreview() {
  return (
    <Carousel items={carouselItems} pattern="deck">
      <Copy pattern="deck" />
    </Carousel>
  )
}

export function CarouselMarqueePreview() {
  return (
    <Carousel items={carouselItems} pattern="marquee" className="max-w-[640px]">
      <Copy pattern="marquee" />
    </Carousel>
  )
}
