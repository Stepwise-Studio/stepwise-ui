'use client'

import { useEffect, useRef, useState } from 'react'
import { Progress, type ProgressColor } from '@/components/stepwise/progress'

// A rAF loop advancing by a hair every frame, instead of a big jump on a
// slow interval — a 4%-every-500ms tick paired with the bar's own 500ms
// ease-out transition meant each step fully decelerated to a stop right as
// the next one began, reading as "move, pause, move, pause." Continuous
// per-frame targets never let the transition catch up to a standstill, so
// it settles into one smooth, unbroken crawl instead.
function useSmoothProgress(cycleMs = 6000, startPct = 0) {
  const [v, setV] = useState(startPct)
  const startRef = useRef<number | null>(null)
  useEffect(() => {
    let raf: number
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const elapsed = (now - startRef.current) % cycleMs
      setV((startPct + (elapsed / cycleMs) * 100) % 100)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [cycleMs, startPct])
  return v
}

export function ProgressLivePreview() {
  const v = useSmoothProgress()
  return (
    <div className="flex w-full max-w-[340px] flex-col gap-2 py-6">
      <Progress value={v} aria-label="Loading" />
    </div>
  )
}

export function ProgressIndeterminatePreview() {
  return (
    <div className="flex w-full max-w-[340px] flex-col gap-2 py-6">
      <Progress aria-label="Loading" />
    </div>
  )
}

// Storage-warning pattern: the color isn't a fixed prop here, it's derived
// from the value itself — plenty of room reads as safe green, then warns,
// then goes critical as free space actually runs out.
function storageColor(pct: number): ProgressColor {
  if (pct >= 90) return 'danger'
  if (pct >= 70) return 'warning'
  return 'success'
}

export function ProgressLabelPreview() {
  const [v, setV] = useState(38)
  useEffect(() => {
    const id = setInterval(() => setV(p => (p >= 100 ? 0 : p + 5)), 400)
    return () => clearInterval(id)
  }, [])
  // Starts at 50%, not 0 — from zero, the 9s cycle spends its first ~6.3s
  // sitting in the "safe" green band before ever reaching the warning
  // threshold, which is a long wait just to see the color actually change.
  const storage = useSmoothProgress(9000, 50)

  return (
    <div className="flex w-full max-w-[340px] flex-col gap-5">
      <Progress label="Uploading" showValue value={v} />
      <Progress
        label="Storage used"
        showValue
        value={storage}
        color={storageColor(storage)}
        formatValue={n => `${Math.round(n)}%`}
      />
    </div>
  )
}
