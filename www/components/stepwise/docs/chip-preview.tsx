'use client'

import { Warning2, Danger, CloudSunny, InfoCircle, Notepad2, Clock } from 'iconsax-react'
import { Chip, type ChipColor } from '@/components/stepwise/chip'

const COLORS: ChipColor[] = ['danger', 'warning', 'success', 'info', 'magical', 'idle']

const colorLabels: Record<ChipColor, string> = {
  danger: 'Danger', warning: 'Warning', success: 'Success',
  info: 'Info', magical: 'Magical', idle: 'Idle',
}

const colorIconLabels: Record<ChipColor, string> = {
  danger: 'Blocked', warning: 'Action', success: 'Clear',
  info: 'Update', magical: 'Docs', idle: 'Timeout',
}

const iconHexColor: Record<ChipColor, string> = {
  danger: '#e11d48', warning: '#d97706', success: '#16a34a',
  info: '#0284c7', magical: '#4f46e5', idle: '#52525b',
}

function getIcon(color: ChipColor, sz = 18) {
  const col = iconHexColor[color]
  switch (color) {
    case 'danger':  return <Warning2   variant="TwoTone" size={sz} color={col} />
    case 'warning': return <Danger     variant="TwoTone" size={sz} color={col} />
    case 'success': return <CloudSunny variant="TwoTone" size={sz} color={col} />
    case 'info':    return <InfoCircle variant="TwoTone" size={sz} color={col} />
    case 'magical': return <Notepad2   variant="TwoTone" size={sz} color={col} />
    case 'idle':    return <Clock      variant="TwoTone" size={sz} color={col} />
  }
}

export function ChipSoftPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map(c => <Chip key={c} color={c} variant="soft">{colorLabels[c]}</Chip>)}
    </div>
  )
}

export function ChipSolidPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map(c => <Chip key={c} color={c} variant="solid">{colorLabels[c]}</Chip>)}
    </div>
  )
}

export function ChipColorsPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map(c => <Chip key={c} color={c} variant="outline">{colorLabels[c]}</Chip>)}
    </div>
  )
}

export function ChipWithIconPreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {COLORS.map(c => (
          <Chip key={c} color={c} variant="soft" icon={getIcon(c)}>
            {colorIconLabels[c]}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {COLORS.map(c => (
          <Chip key={c} color={c} variant="outline" icon={getIcon(c)}>
            {colorIconLabels[c]}
          </Chip>
        ))}
      </div>
    </div>
  )
}

export function ChipDotPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Chip color="success" variant="soft" dot>Live</Chip>
      <Chip color="info" variant="outline" dot>Syncing</Chip>
      <Chip color="warning" variant="soft" dot>Pending</Chip>
      <Chip color="danger" variant="outline" dot>Error</Chip>
      <Chip color="idle" variant="soft" dot>Draft</Chip>
    </div>
  )
}

const sizesConfig = [
  { size: 'sm'      as const, variant: 'soft'    as const },
  { size: 'default' as const, variant: 'outline' as const },
  { size: 'lg'      as const, variant: 'solid'   as const },
]

export function ChipSizesPreview() {
  return (
    <div className="flex flex-col gap-3">
      {sizesConfig.map(({ size, variant }) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          {COLORS.map(c => <Chip key={c} color={c} size={size} variant={variant}>{colorLabels[c]}</Chip>)}
        </div>
      ))}
    </div>
  )
}

export function ChipUsagePreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      {[
        { label: 'Payment processed',    color: 'success' as const, text: 'Paid'        },
        { label: 'Server response slow', color: 'warning' as const, text: 'Degraded'    },
        { label: 'Build failed',         color: 'danger'  as const, text: 'Failed'      },
        { label: 'Syncing data',         color: 'info'    as const, text: 'In progress' },
      ].map(({ label, color, text }) => (
        <div key={label} className="flex items-center justify-between">
          <span className="text-[14px] text-zinc-700 dark:text-zinc-300">{label}</span>
          <Chip color={color} variant="soft" dot>{text}</Chip>
        </div>
      ))}
    </div>
  )
}
