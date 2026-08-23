'use client'

import { RetroTypewriter } from '@/components/stepwise/retro-typewriter'

export function RetroTypewriterPreview() {
  return (
    <div className="w-full flex justify-center py-4">
      <RetroTypewriter initialText={'hello, world\n'} />
    </div>
  )
}
