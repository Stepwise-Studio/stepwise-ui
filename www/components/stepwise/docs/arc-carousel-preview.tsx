'use client'

import { ArcCarousel, type ArcCarouselItem } from '@/components/stepwise/arc-carousel'

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=300&h=400&q=80`

export const arcItems: ArcCarouselItem[] = [
  { src: u('photo-1494790108377-be9c29b29330'), alt: '' },
  { src: u('photo-1507003211169-0a1dd7228f2d'), alt: '' },
  { src: u('photo-1539571696357-5a69c17a67c6'), alt: '' },
  { src: u('photo-1524504388940-b1c1722653e1'), alt: '' },
  { src: u('photo-1500648767791-00dcc994a43e'), alt: '' },
  { src: u('photo-1534528741775-53994a69daeb'), alt: '' },
  { src: u('photo-1517841905240-472988babdf9'), alt: '' },
  { src: u('photo-1529626455594-4ff0802cfb7e'), alt: '' },
]

export function ArcCarouselPreview() {
  return <ArcCarousel items={arcItems} />
}
