'use client'

import { AnimatedGradient } from '@/components/stepwise/animated-gradient'

export function AnimatedGradientPreview() {
  return (
    <div className="flex w-full flex-col items-center gap-8 py-8">
      <AnimatedGradient text="Stepwise UI" className="text-5xl font-semibold tracking-[-0.02em]" />
      <AnimatedGradient text="Ship delightful interfaces" className="text-2xl font-medium tracking-[-0.01em]" duration={3.5} />
    </div>
  )
}
