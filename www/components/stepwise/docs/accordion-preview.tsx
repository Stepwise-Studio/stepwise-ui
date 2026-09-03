'use client'

import { Accordion } from '@/components/stepwise/accordion'

/**
 * Accordion is usually the first component anyone opens, so the demo content
 * is the honest story of building this rather than a generic FAQ. Nobody
 * remembers "What are the peer dependencies?".
 */
const FAQ_ITEMS = [
  {
    id: 'why',
    title: 'Why does this exist?',
    content:
      'Because the alternative was building another accordion from scratch, and you are currently reading the last one we intend to write.',
  },
  {
    id: 'long',
    title: 'What took the longest?',
    content:
      'Deciding. The code was mostly fine. Choosing between two shades of grey took a weekend, twice.',
  },
  {
    id: 'ai',
    title: 'How much of this is AI?',
    content:
      'More than we planned. At one point it wrote a modal that opened twice and closed once. We kept the opening.',
  },
  {
    id: 'redo',
    title: 'Anything you would redo?',
    content:
      'The corner maths. It works now and nobody is allowed to touch it.',
  },
]

export function AccordionBasicPreview() {
  return (
    <div className="w-full max-w-lg">
      <Accordion items={FAQ_ITEMS} />
    </div>
  )
}

export function AccordionMultiplePreview() {
  return (
    <div className="w-full max-w-lg">
      <Accordion items={FAQ_ITEMS.slice(0, 3)} multiple />
    </div>
  )
}
