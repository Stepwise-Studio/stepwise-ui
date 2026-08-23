'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { RefreshIcon } from '@hugeicons/core-free-icons'
import { ShimmerText } from '@/components/stepwise/shimmer-text'
import { ScrambleText } from '@/components/stepwise/scramble-text'
import { FadeText } from '@/components/stepwise/fade-text'
import { Typewriter } from '@/components/stepwise/typewriter'
import { SquigglyUnderline } from '@/components/stepwise/squiggly-underline'
import { CircleAnnotation } from '@/components/stepwise/circle-annotation'
import { useTheme } from '@/lib/theme'

// Per-theme accent pairs — verified >=4.5:1 against the actual rendered
// background in both appearances (light bg ~white, dark bg ~black):
// rose-600/rose-500 = 4.70 / 5.72, sky-700/sky-500 = 5.93 / 7.58.
const ROSE = { light: '#e11d48', dark: '#f43f5e' }
const SKY  = { light: '#0369a1', dark: '#0ea5e9' }

/* ── shared replay button ─────────────────────────────────────────────────── */

function Replay({ onClick, label = 'Replay' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-[13px] font-medium
        text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800
        hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-[0.96]
        transition-[background-color,scale] duration-150"
    >
      <HugeiconsIcon icon={RefreshIcon} size={14} strokeWidth={2} color="currentColor" />
      {label}
    </button>
  )
}

/* ── shimmer ──────────────────────────────────────────────────────────────── */

export function ShimmerPreview() {
  return (
    <div className="flex flex-col items-start gap-4">
      <ShimmerText className="text-[26px] font-semibold tracking-tight">Generating response…</ShimmerText>
      <ShimmerText className="text-[15px] font-medium">Searching the knowledge base</ShimmerText>
      <ShimmerText className="text-[15px] font-medium" duration={1.4}>Summarizing 12 sources</ShimmerText>
    </div>
  )
}

/* ── scramble ─────────────────────────────────────────────────────────────── */

export function ScramblePreview() {
  const [k, setK] = useState(0)
  return (
    <div className="flex flex-col items-center gap-7">
      <ScrambleText
        key={k}
        className="text-[34px] font-semibold tracking-tight text-zinc-900 dark:text-white"
      >
        Stepwise Interface Kit
      </ScrambleText>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Replay onClick={() => setK(k + 1)} />
      </div>
      <p className="max-w-sm text-center text-[13px] text-zinc-400 dark:text-zinc-500">
        Default intensity is 0.45. Pass{' '}
        <code className="rounded bg-zinc-100 px-1 py-0.5 text-[12px] dark:bg-zinc-800">intensity={'{0.9}'}</code>{' '}
        for the old storm, or{' '}
        <code className="rounded bg-zinc-100 px-1 py-0.5 text-[12px] dark:bg-zinc-800">speed={'{96}'}</code>{' '}
        to stretch the resolve even further.
      </p>
    </div>
  )
}

/* ── fade in / out ────────────────────────────────────────────────────────── */

export function FadePreview() {
  const [show, setShow] = useState(true)
  return (
    <div className="flex flex-col items-center gap-7 text-center">
      <div className="min-h-[40px] flex items-center">
        <FadeText show={show} className="text-[26px] font-medium tracking-tight text-zinc-900 dark:text-white">
          Ship delightful interfaces faster
        </FadeText>
      </div>
      <Replay onClick={() => setShow(s => !s)} label={show ? 'Fade out' : 'Fade in'} />
    </div>
  )
}

/* ── typewriter ───────────────────────────────────────────────────────────── */

export function TypewriterPreview() {
  return (
    <div className="text-[28px] font-medium tracking-tight text-zinc-900 dark:text-white">
      We build{' '}
      <Typewriter
        words={['design systems', 'component libraries', 'delightful UIs']}
        className="text-sky-500"
      />
    </div>
  )
}

/* ── squiggly underline ───────────────────────────────────────────────────── */

export function SquigglyPreview() {
  const [k, setK] = useState(0)
  const { theme } = useTheme()
  const dark = theme === 'dark'
  return (
    <div className="flex flex-col items-center gap-8">
      <p key={k} className="text-[26px] font-medium tracking-tight text-zinc-800 dark:text-zinc-100 text-center leading-relaxed">
        The{' '}
        <SquigglyUnderline color={dark ? ROSE.dark : ROSE.light}>most important</SquigglyUnderline>{' '}
        detail is the{' '}
        <SquigglyUnderline color={dark ? SKY.dark : SKY.light}>one you notice</SquigglyUnderline>.
      </p>
      <Replay onClick={() => setK(k + 1)} />
    </div>
  )
}

/* ── circle annotation ────────────────────────────────────────────────────── */

export function CirclePreview() {
  const [k, setK] = useState(0)
  const { theme } = useTheme()
  const dark = theme === 'dark'
  return (
    <div className="flex flex-col items-center gap-9">
      <p key={k} className="text-[26px] font-medium tracking-tight text-zinc-800 dark:text-zinc-100 text-center leading-[1.7]">
        Every detail is{' '}
        <CircleAnnotation color={dark ? ROSE.dark : ROSE.light}>intentional</CircleAnnotation>{' '}
        — nothing here is an accident.
      </p>
      <Replay onClick={() => setK(k + 1)} />
    </div>
  )
}