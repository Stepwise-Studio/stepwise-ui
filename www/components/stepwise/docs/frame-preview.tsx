'use client'

import { Frame } from '@/components/stepwise/frame'

/* A plain, empty frame - this is the base primitive itself: radius, squircle
   smoothing, border, and resting shadow. No content baked in; consumers
   fill it with whatever they want (see FrameHeader/Title/etc for one way). */
export function FrameBasicPreview() {
  // Square, so the preview reads as the surface itself rather than implying a
  // card shape - Frame has no intrinsic aspect ratio, the consumer sets it.
  return <Frame className="size-[220px]" />
}
