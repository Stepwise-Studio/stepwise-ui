'use client'

import { LensCarousel, type LensCarouselItem } from '@/components/stepwise/lens-carousel'

/* The same stills and the same order the landing page's lens carousel uses.
 * Dealt round-robin across theme groups (bright interiors, night scenes, misty
 * landscapes, warm stone, pastel clouds) so no two lookalikes sit next to each
 * other, including across the wrap seam where the loop repeats. */
const src = (n: string): LensCarouselItem => ({ src: `/backgrounds/freebie-${n}.webp`, alt: '' })

export const lensItems: LensCarouselItem[] = [
  '025', '009', '033', '001', '081', '057', '041',
  '049', '017', '097', '065', '089', '073',
].map(src)

export function LensCarouselPreview() {
  return <LensCarousel items={lensItems} />
}
