'use client'

import { InfiniteCanvas } from '@/components/stepwise/infinite-canvas'
import { Avatar } from '@/components/stepwise/avatar'
import { Chip } from '@/components/stepwise/chip'

// A gradient "image" tile — self-contained, no network needed.
function Gradient({ from, to, emoji }: { from: string; to: string; emoji: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center text-[40px]"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <span className="drop-shadow-sm">{emoji}</span>
    </div>
  )
}

function Quote({ text }: { text: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-900 p-5 text-center dark:bg-white">
      <span className="text-[15px] font-medium leading-snug tracking-[-0.02em] text-white dark:text-zinc-900">
        {text}
      </span>
    </div>
  )
}

// Mix of "images" and real components — the canvas holds anything.
const TILES = [
  <Gradient key="a" from="#fb7185" to="#f59e0b" emoji="🌅" />,
  <Quote key="b" text="Squircles, always." />,
  <Gradient key="c" from="#38bdf8" to="#6366f1" emoji="🪐" />,
  <div key="d" className="flex h-full w-full flex-col items-center justify-center gap-2 bg-zinc-50 dark:bg-zinc-900">
    <Avatar name="Sarah Chen" size="lg" />
    <span className="text-[12px] text-zinc-400">Sarah</span>
  </div>,
  <Gradient key="e" from="#22c55e" to="#14b8a6" emoji="🌿" />,
  <div key="f" className="flex h-full w-full flex-wrap items-center justify-center gap-1.5 bg-zinc-50 p-3 dark:bg-zinc-900">
    <Chip color="success" variant="solid" size="sm">Live</Chip>
    <Chip color="magical" size="sm">New</Chip>
  </div>,
  <Gradient key="g" from="#a78bfa" to="#ec4899" emoji="🎨" />,
  <Quote key="h" text="The last 2% is the point." />,
  <Gradient key="i" from="#f97316" to="#ef4444" emoji="🔥" />,
  <div key="j" className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-[13px] font-mono text-zinc-500 dark:from-zinc-800 dark:to-zinc-900">
    npx stepwise-ui
  </div>,
  <Gradient key="k" from="#0ea5e9" to="#22d3ee" emoji="💎" />,
  <Gradient key="l" from="#facc15" to="#f97316" emoji="⚡" />,
]

export function InfiniteCanvasBasicPreview() {
  return (
    <InfiniteCanvas
      items={TILES}
      cellWidth={150}
      cellHeight={150}
      gap={14}
      height={460}
      className="rounded-[20px]"
    />
  )
}

export function InfiniteCanvasTextPreview() {
  return (
    <InfiniteCanvas
      items={TILES}
      cellWidth={140}
      cellHeight={140}
      gap={14}
      height={460}
      className="rounded-[20px]"
      centerContent={
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-[32px] font-semibold tracking-[-0.03em] text-zinc-900 [text-wrap:balance] md:text-[44px] dark:text-white">
            An endless canvas.
          </h3>
          <p className="max-w-[34ch] text-[14px] text-zinc-500 dark:text-zinc-400">
            Drag anywhere to roam. The weave never repeats a tile edge-to-edge.
          </p>
        </div>
      }
    />
  )
}
