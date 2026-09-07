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

/* ── Palette ──────────────────────────────────────────────────────────
 * Declared up here rather than beside the colour picker because all three
 * previews below tint their folder, and they should agree. */

/** The lavender out of the landing hero's blurred mesh aura - see LIGHT_AURA
 *  in components/home/hero.tsx. */
const AURA   = '#ddd6fe'
/** The exact blue the landing page's own Folder is tinted with - see the
 *  Folder in components/home/canvas.tsx. */
const COBALT = '#2563eb'
/**
 * The folder every preview on this page opens on. The component's own
 * untinted default renders near-black in dark mode, which read as a shadow
 * rather than a folder, so the docs lead with this instead. It is only a
 * `color` prop - the component default itself is unchanged.
 */
const SKY    = '#bfdbfe'

/* ── Showcase - empty ↔ filled toggle ─────────────────────────────── */
export function FolderShowcasePreview() {
  const [state, setState] = useState<'empty' | 'filled'>('filled')
  return (
    <div className="flex flex-col items-center gap-6">
      <Folder
        label="Product shots"
        count={state === 'empty' ? 'Empty' : '36 photos'}
        color={SKY}
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
    <div className="flex flex-col items-center">
      <Folder label="Case files" count="8 documents" color={SKY} icon={File01Icon} files={CASE_FILES} />
    </div>
  )
}

/* ── Colors + icon picker ─────────────────────────────────────────── */
/* Deliberately no near-white or near-black swatch. This section demonstrates
 * *tinting* the folder, and both of those read as "no colour applied" rather
 * than as a choice - the near-white one even had to special-case itself out
 * of the tint path to avoid looking flatter than its neighbours. */
const SWATCH = [AURA, COBALT, '#f5d98b', SKY, '#fbcfe8', '#bbf7d0']
const ICONS: { icon: IconSvgElement; key: string }[] = [
  { icon: File01Icon, key: 'File' },
  { icon: Image02Icon, key: 'Image' },
  { icon: MusicNote01Icon, key: 'Music' },
  { icon: Video01Icon, key: 'Video' },
  { icon: StarIcon, key: 'Star' },
  { icon: CameraLensIcon, key: 'Camera' },
]

export function FolderColorPreview() {
  const [color, setColor] = useState(SKY)
  const [iconIdx, setIconIdx] = useState(0)
  return (
    <div className="flex flex-col items-center gap-6">
      <Folder color={color} icon={ICONS[iconIdx].icon} label="Design assets" count="24 files" />
      <ColorSwatch colors={SWATCH} value={color} onChange={setColor} labels={['Aura', 'Cobalt', 'Amber', 'Sky', 'Rose', 'Mint']} />
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
