'use client'

import { useState } from 'react'
import { VideoPlayer } from '@/components/stepwise/video-player'
import { Segment } from '@/components/stepwise/segment'
import { cn } from '@/lib/utils/cn'

const CLIPS = [
  { value: 'flower', label: 'Flower', src: '/videos/flower.mp4' },
  { value: 'park',   label: 'Park',   src: '/videos/park.mp4' },
  { value: 'bunny',  label: 'Bunny',  src: '/videos/bunny.mp4' },
  { value: 'jelly',  label: 'Jelly',  src: '/videos/jelly.mp4' },
] as const

const RATIOS = [
  { value: '16/9',   label: '16:9' },
  { value: '4/3',    label: '4:3' },
  { value: '3/4',    label: '3:4' },
  { value: '9/16',   label: '9:16' },
  { value: '1/1',    label: '1:1' },
  { value: 'custom', label: 'Custom' },
] as const

type RatioId = typeof RATIOS[number]['value']

function isPortrait(ratio: string) {
  const [a, b] = ratio.split('/').map(Number)
  if (!a || !b) return false
  return a / b < 1
}

function playerWidth(ratio: string) {
  if (isPortrait(ratio)) return 'max-w-[240px]'
  if (ratio === '1/1') return 'max-w-sm'
  if (ratio === '4/3') return 'max-w-md'
  return 'max-w-xl'
}

export function VideoPlayerPreview() {
  const [clip, setClip] = useState<typeof CLIPS[number]['value']>('flower')
  const src = CLIPS.find(c => c.value === clip)!.src

  return (
    <div className="flex w-full flex-col items-center gap-6 py-12">
      <Segment
        size="sm"
        options={CLIPS.map(({ value, label }) => ({ value, label }))}
        value={clip}
        onChange={setClip}
      />
      <VideoPlayer
        key={src}
        src={src}
        loop
        className="w-full max-w-xl"
      />
    </div>
  )
}

export function VideoPlayerAspectPreview() {
  const [preset, setPreset] = useState<RatioId>('16/9')
  const [custom, setCustom] = useState('21/9')
  const ratio = preset === 'custom' ? (custom.trim() || '16/9') : preset

  return (
    <div className="flex w-full flex-col items-center gap-5 py-10">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Segment
          size="sm"
          options={RATIOS.map(({ value, label }) => ({ value, label }))}
          value={preset}
          onChange={setPreset}
        />
        {preset === 'custom' && (
          <input
            aria-label="Custom aspect ratio"
            value={custom}
            onChange={e => setCustom(e.target.value)}
            placeholder="21/9"
            className="h-7 w-[4.5rem] rounded-lg border border-zinc-200 bg-white px-2 text-center text-[12px] tabular-nums text-zinc-800 outline-none ring-zinc-400/40 placeholder:text-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        )}
      </div>
      <VideoPlayer
        src="/videos/flower.mp4"
        loop
        aspectRatio={ratio}
        className={cn(
          'w-full transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          playerWidth(ratio),
        )}
      />
    </div>
  )
}

export function VideoPlayerNoSrcPreview() {
  return (
    <VideoPlayer
      className="w-full max-w-sm"
    />
  )
}
