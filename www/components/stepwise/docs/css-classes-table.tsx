'use client'

import { Text } from '@/components/stepwise/typography'
import { Surface } from '@/components/stepwise/primitives/surface'
import { CopyButton } from './copy-button'

interface Row {
  name: string
  classes: string
}

export function CssClassesTable({ rows }: { rows: Row[] }) {
  return (
    <Surface
      radius={24}
      lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
      className="overflow-x-auto"
    >
      <div className="min-w-[520px]">
        <div className="grid grid-cols-[160px_1fr] px-6 py-3 bg-zinc-900 dark:bg-zinc-100">
          <Text variant="body" as="span" className="text-zinc-200 dark:text-zinc-800 font-semibold">Variant</Text>
          <Text variant="body" as="span" className="text-zinc-200 dark:text-zinc-800 font-semibold">Applied classes</Text>
        </div>
        {rows.map((v, i) => (
          <div
            key={v.name}
            className={`group grid grid-cols-[160px_1fr_40px] items-center px-6 py-3.5 ${
              i % 2 === 0 ? 'bg-zinc-100 dark:bg-zinc-900' : 'bg-zinc-200/60 dark:bg-zinc-800/60'
            } ${i < rows.length - 1 ? 'border-b border-zinc-200/80 dark:border-zinc-700/50' : ''}`}
          >
            <Text variant="mono" as="code" className="text-zinc-700 dark:text-zinc-300">{v.name}</Text>
            <Text variant="mono" as="code" className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{v.classes}</Text>
            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <CopyButton text={v.classes} />
            </div>
          </div>
        ))}
      </div>
    </Surface>
  )
}
