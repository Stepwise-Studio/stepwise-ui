'use client'

import { GlowButton } from '@/components/stepwise/glow-button'

export function GlowButtonBasicPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-2">
      <GlowButton>Install on Figma</GlowButton>
    </div>
  )
}

export function GlowButtonSizesPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-2">
      <GlowButton size="default">Default</GlowButton>
      <GlowButton size="lg">Large</GlowButton>
    </div>
  )
}
