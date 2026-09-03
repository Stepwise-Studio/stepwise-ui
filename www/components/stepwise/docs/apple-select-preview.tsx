'use client'

import { useState } from 'react'
import { AppleSelect, APPLE_ACCENTS } from '@/components/stepwise/apple-select'
import { ColorSwatch } from '@/components/stepwise/color-swatch'

const PARAGRAPH =
  'Introduced with iOS 3 in June 2009 was the ability to select, copy and paste text using selection handles displayed on either end of the highlighted range.'

export function AppleSelectBasicPreview() {
  return (
    <div className="flex w-full justify-center px-4 py-6">
      <AppleSelect text={PARAGRAPH} selection={[43, 60]} />
    </div>
  )
}

const ACCENT_LIST = Object.values(APPLE_ACCENTS)
const ACCENT_LABELS = Object.keys(APPLE_ACCENTS)

export function AppleSelectAccentsPreview() {
  const [accent, setAccent] = useState<string>(APPLE_ACCENTS.purple)
  return (
    <div className="flex flex-col items-center gap-8 px-4 py-6">
      {/* Ends on the final period so the closing handle has empty space to sit
          in. The handle's dot is centred on the selection edge (as on iOS), so
          a range ending mid-sentence puts it on top of the next word. */}
      <AppleSelect
        text="A fixed highlight the author sets - the band and both handles follow the accent."
        selection={[62, 80]}
        accent={accent}
      />
      <ColorSwatch colors={ACCENT_LIST} value={accent} onChange={setAccent} labels={ACCENT_LABELS} />
    </div>
  )
}
