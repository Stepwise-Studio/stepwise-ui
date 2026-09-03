'use client'

import { ArcCarousel, type ArcCarouselItem } from '@/components/stepwise/arc-carousel'

/* The landing page's arc order - a different deal of the same stills to the
 * lens carousel's, so the two never show the same picture in the same slot. */
const src = (n: string): ArcCarouselItem => ({ src: `/backgrounds/freebie-${n}.webp`, alt: '' })

export const arcItems: ArcCarouselItem[] = [
  '089', '097', '065', '041', '073', '049', '081',
  '057', '009', '017', '033', '025', '001',
].map(src)

export function ArcCarouselPreview() {
  return <ArcCarousel items={arcItems} />
}
