'use client'

import { useState } from 'react'
import { LogoReveal, type LogoRevealPreset } from '@/components/stepwise/logo-reveal'
import { Toggle } from '@/components/stepwise/toggle'
import { Button } from '@/components/stepwise/button'

// Demo marks — swap these for your own logo's path data.
const STAR = 'M256 40 L318 190 L480 202 L356 308 L394 466 L256 380 L118 466 L156 308 L32 202 L194 190 Z'
const BOLT = 'M300 40 L120 300 L240 300 L212 472 L392 212 L272 212 Z'
const TRIANGLE = [
  'M256 64 L448 384 L64 384 Z',
  'M256 208 L336 344 L176 344 Z',
]

const SHAPES = [
  { key: 'star', label: 'Star',     path: STAR },
  { key: 'bolt', label: 'Bolt',     path: BOLT },
  { key: 'tri',  label: 'Triangle', path: TRIANGLE as string[] },
] as const

const PRESETS: { key: LogoRevealPreset; label: string; hint: string }[] = [
  { key: 'white',     label: 'White',     hint: 'paper + grain' },
  { key: 'black',     label: 'Black',     hint: 'ink on night' },
  { key: 'blueprint', label: 'Blueprint', hint: 'drafting sheet' },
]

function PillRow<T extends string>({
  options, value, onPick,
}: {
  options: { key: T; label: string }[]; value: T; onPick: (k: T) => void
}) {
  return (
    <div className="flex items-center gap-2">
      {options.map(o => (
        <button
          key={o.key}
          onClick={() => onPick(o.key)}
          className={
            'h-8 rounded-full px-3 text-[12px] font-medium transition-colors duration-150 ' +
            (value === o.key
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
              : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700')
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function LogoRevealBasicPreview() {
  const [playing, setPlaying] = useState(false)
  const [shape, setShape]     = useState<(typeof SHAPES)[number]>(SHAPES[0])
  const [preset, setPreset]   = useState<LogoRevealPreset>('white')
  const [guides, setGuides]   = useState(true)
  const [texture, setTexture] = useState(true)

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      {/* Plays over the ENTIRE site, like a real opening sequence */}
      <Button size="lg" onClick={() => setPlaying(true)}>Play opening sequence</Button>

      <p className="max-w-sm text-center text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        Construction guides draw off the logo&apos;s own geometry, the mark is traced over
        them, then the bold fill lands as the scaffolding fades — full-screen, like a
        site loader should be.
      </p>

      {/* Controls */}
      <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-6">
        <div className="flex flex-col items-center gap-2.5">
          <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">Style</span>
          <PillRow options={PRESETS} value={preset} onPick={setPreset} />
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            {PRESETS.find(x => x.key === preset)?.hint}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2.5">
          <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">Mark</span>
          <PillRow options={SHAPES.map(sh => ({ key: sh.key, label: sh.label }))} value={shape.key} onPick={k => setShape(SHAPES.find(sh => sh.key === k)!)} />
        </div>

        <div className="flex flex-col items-center gap-2.5">
          <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">Guides</span>
          <Toggle checked={guides} onChange={setGuides} />
        </div>

        <div className="flex flex-col items-center gap-2.5">
          <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">Grain</span>
          <Toggle checked={texture} onChange={setTexture} />
        </div>
      </div>

      {playing && (
        <LogoReveal
          path={shape.path}
          preset={preset}
          showGuides={guides}
          texture={texture}
          size={170}
          onFinish={() => setPlaying(false)}
        />
      )}
    </div>
  )
}
