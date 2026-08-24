import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { SegmentPreview, SegmentUnderlinePreview, SegmentTabsPreview } from '@/components/stepwise/docs/segment-preview'
import { PropsTable } from '@/components/stepwise/docs/props-table'

const underlineCode = `<Segment variant="underline" options={options} value={v} onChange={setV} />`

const tabsCode = `// give options a \`content\` panel and Segment becomes a tab group
<Segment
  variant="underline"
  options={[
    { value: 'overview', label: 'Overview', content: <Overview /> },
    { value: 'activity', label: 'Activity', content: <Activity /> },
    { value: 'settings', label: 'Settings', content: <Settings /> },
  ]}
/>`

const componentCode = `'use client'

import { useId, useState } from 'react'
import { motion } from 'motion/react'
import { Surface } from '@/components/stepwise/primitives/surface'
import { cn } from '@/lib/utils/cn'

export interface SegmentOption<T extends string = string> {
  value: T
  label: string
  icon?: React.ReactNode
}

export interface SegmentProps<T extends string = string> {
  options: SegmentOption<T>[]
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  size?: 'sm' | 'md'
  className?: string
}

export function Segment<T extends string = string>({
  options, value: controlledValue, defaultValue,
  onChange, size = 'md', className,
}: SegmentProps<T>) {
  const id = useId()
  const [internal, setInternal] = useState<T>(() => defaultValue ?? options[0]?.value)
  const isControlled = controlledValue !== undefined
  const active = isControlled ? controlledValue : internal

  function select(v: T) {
    if (!isControlled) setInternal(v)
    onChange?.(v)
  }

  const h  = size === 'sm' ? 'h-7'    : 'h-8'
  const px = size === 'sm' ? 'px-2.5' : 'px-3'
  const fs = size === 'sm' ? 'text-[12px]' : 'text-[13px]'

  return (
    <Surface radius={100}
      className={cn('flex items-center bg-zinc-100 dark:bg-zinc-800/60 p-[3px] gap-px w-fit', className)}
    >
      {options.map((opt) => {
        const isActive = opt.value === active
        return (
          <button key={opt.value} type="button" onClick={() => select(opt.value)}
            className={cn(
              'relative flex items-center gap-1.5 rounded-full font-medium select-none',
              'active:scale-[0.96] transition-[color,transform] duration-150',
              h, px, fs,
              isActive
                ? 'text-zinc-800 dark:text-zinc-100'
                : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300',
            )}
          >
            {isActive && (
              <motion.div
                layoutId={\`\${id}-pill\`}
                className="absolute inset-0 rounded-full bg-white dark:bg-zinc-700/60 shadow-sm dark:shadow-none"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
              />
            )}
            {opt.icon && <span className="relative z-10 flex items-center">{opt.icon}</span>}
            <span className="relative z-10">{opt.label}</span>
          </button>
        )
      })}
    </Surface>
  )
}`

const usageCode = `import { Segment } from '@/components/stepwise/segment'

// Controlled
const [view, setView] = useState('list')
<Segment
  options={[
    { value: 'list',  label: 'List'  },
    { value: 'grid',  label: 'Grid'  },
    { value: 'table', label: 'Table' },
  ]}
  value={view}
  onChange={setView}
/>

// Uncontrolled
<Segment
  options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }]}
  defaultValue="week"
  onChange={(v) => console.log(v)}
/>

// Small size
<Segment options={options} value={v} onChange={setV} size="sm" />

// With icons
<Segment
  options={[
    { value: 'sun',  label: 'Light', icon: <SunIcon size={13} /> },
    { value: 'moon', label: 'Dark',  icon: <MoonIcon size={13} /> },
  ]}
  value={theme}
  onChange={setTheme}
/>`

const tocItems = [
  { id: 'preview',   label: 'Preview',   child: false },
  { id: 'underline', label: 'Underline', child: false },
  { id: 'tabs',      label: 'Tabs',      child: false },
  { id: 'usage',     label: 'Usage',     child: false },
  { id: 'props',     label: 'Props',     child: false },
]

export default async function SegmentPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Segment</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A segmented control for switching between mutually exclusive options — the active
            indicator slides with a spring. Choose the filled <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">pill</code> or
            the <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">underline</code> style, and give options a{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">content</code> panel to turn it into a tab group.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add segment" />
        </section>

        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            minHeight={300}
            preview={<SegmentPreview />}
            code={<CodeBlock code={componentCode} className="rounded-none" flat />}
          />
        </section>

        <section id="underline" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Underline</Text>
          <PreviewCode
            minHeight={120}
            preview={<SegmentUnderlinePreview />}
            code={<CodeBlock code={underlineCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="tabs" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">With panels (tabs)</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Add a <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">content</code> to each option and Segment renders the active panel below with a blur-fade — a full tab group, no separate component.
          </Text>
          <PreviewCode
            minHeight={200}
            preview={<SegmentTabsPreview />}
            code={<CodeBlock code={tabsCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        {/* Usage — distinct from the Preview's code tab, which shows the
            component's own source rather than practical call sites */}
        <section id="usage" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Usage</Text>
          <CodeBlock code={usageCode} lang="tsx" />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'options',      type: 'SegmentOption[]',   desc: 'Array of { value, label, icon?, content? }. content turns it into a tab group.' },
            { name: 'value',        type: 'string',            desc: 'Controlled selected value. Pair with onChange.' },
            { name: 'defaultValue', type: 'string',            desc: 'Uncontrolled initial value. Defaults to the first option when omitted.' },
            { name: 'onChange',     type: '(value) => void',   desc: 'Called when the user selects a different option.' },
            { name: 'variant',      type: '"pill" | "underline"', desc: 'pill → filled sliding pill (default)  |  underline → sliding underline.' },
            { name: 'size',         type: '"sm" | "md"',       desc: 'sm → 28 px buttons  |  md → 32 px buttons (default).' },
            { name: 'className',    type: 'string',            desc: 'Applied to the wrapper.' },
          ]} />
        </section>

      </div>

      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
