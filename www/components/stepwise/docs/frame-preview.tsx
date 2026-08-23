'use client'

import { Frame } from '@/components/stepwise/frame'

/* A plain, empty frame — this is the base primitive itself: radius, squircle
   smoothing, border, and resting shadow. No content baked in; consumers
   fill it with whatever they want (see FrameHeader/Title/etc for one way). */
export function FrameBasicPreview() {
  return (
    <div className="w-full max-w-[280px]">
      <Frame className="h-32" />
    </div>
  )
}
