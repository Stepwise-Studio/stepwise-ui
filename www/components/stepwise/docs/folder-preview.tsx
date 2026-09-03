'use client'

import { useState } from 'react'
import {
  Image02Icon, File01Icon, MusicNote01Icon, Video01Icon, StarIcon, CameraLensIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { Folder } from '@/components/stepwise/folder'
import { ColorSwatch } from '@/components/stepwise/color-swatch'
import { Segment } from '@/components/stepwise/segment'
import { cn } from '@/lib/utils/cn'

/* ── Showcase - empty ↔ filled toggle ─────────────────────────────── */
export function FolderShowcasePreview() {
  const [state, setState] = useState<'empty' | 'filled'>('filled')
  return (
    <div className="flex flex-col items-center gap-6">
      <Folder
        label="Japan 2024"
        count={state === 'empty' ? 'Empty' : '83 photos'}
        icon={Image02Icon}
        peek={state === 'empty' ? 0 : 3}
      />
      <Segment
        size="sm"
        value={state}
        onChange={v => setState(v as 'empty' | 'filled')}
        options={[{ value: 'empty', label: 'Empty' }, { value: 'filled', label: 'Filled' }]}
      />
    </div>
  )
}

/* ── Fan-out on hover, with paging past five ──────────────────────── */
const CASE_FILES = [
  { name: 'Deposition_transcript.pdf' },
  { name: 'Exhibit_A_photos.zip', progress: 64 },
  { name: 'Client_intake_form.docx' },
  { name: 'Settlement_draft_v3.pdf', progress: 30 },
  { name: 'Witness_statement.pdf' },
  { name: 'Evidence_log.xlsx' },
  { name: 'Correspondence_2024.eml' },
  { name: 'Retainer_agreement.pdf' },
]

export function FolderFanPreview() {
  return (
    <div className="flex flex-col items-center gap-5">
      <Folder label="Case files" count="8 documents" icon={File01Icon} files={CASE_FILES} />
      <p className="max-w-[290px] text-center text-[12px] leading-relaxed text-zinc-400 dark:text-zinc-500">
        Hover, tap, or focus the folder - the files lift out into an arc, and hovering one shows
        its name (and progress, if it&apos;s still uploading). The arrows always page through,
        wrapping around at either end.
      </p>
    </div>
  )
}

/* ── Colors + icon picker ─────────────────────────────────────────── */
const SWATCH = ['#dfe1e7', '#26272c', '#f5d98b', '#bfdbfe', '#fbcfe8', '#bbf7d0']
const ICONS: { icon: IconSvgElement; key: string }[] = [
  { icon: File01Icon, key: 'File' },
  { icon: Image02Icon, key: 'Image' },
  { icon: MusicNote01Icon, key: 'Music' },
  { icon: Video01Icon, key: 'Video' },
  { icon: StarIcon, key: 'Star' },
  { icon: CameraLensIcon, key: 'Camera' },
]

export function FolderColorPreview() {
  const [color, setColor] = useState(SWATCH[0])
  const [iconIdx, setIconIdx] = useState(0)
  // "Neutral" is meant to be the same default look as every other preview -
  // but its hex happens to just match --folder-body, not the pocket/icon
  // tokens too. Passing it as `color` still derives those via the OKLCH-
  // relative math (for any *other* color), producing a visibly flatter
  // pocket than the hand-tuned defaults. Passing no color at all is the only
  // way to get the real default back.
  const isNeutral = color === SWATCH[0]
  return (
    <div className="flex flex-col items-center gap-6">
      <Folder color={isNeutral ? undefined : color} icon={ICONS[iconIdx].icon} label="Design assets" count="24 files" />
      <ColorSwatch colors={SWATCH} value={color} onChange={setColor} labels={['Neutral', 'Graphite', 'Amber', 'Sky', 'Rose', 'Mint']} />
      <div className="flex items-center gap-2">
        {ICONS.map((it, i) => (
          <button
            key={it.key}
            onClick={() => setIconIdx(i)}
            aria-label={it.key}
            aria-pressed={i === iconIdx}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl border transition-colors duration-150',
              i === iconIdx
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
                : 'border-zinc-200 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800',
            )}
          >
            <HugeiconsIcon icon={it.icon} size={18} color="currentColor" />
          </button>
        ))}
      </div>
    </div>
  )
}
