'use client'

import { DottedGrid } from '@/components/stepwise/dotted-grid'

// DottedGrid is `position: absolute; inset: 0` by design, so dropping it in
// directly (no wrapper) makes it fill the whole preview box — its containing
// block is PreviewCode's own positioned preview slot, which sidesteps that
// slot's padding entirely rather than needing padding removed some other way.
export function DottedGridPreview() {
  return <DottedGrid />
}
