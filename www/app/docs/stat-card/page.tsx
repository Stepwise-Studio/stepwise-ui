import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { StatCardGridPreview } from '@/components/stepwise/docs/stat-card-preview'

const code = `import { StatCard } from '@/components/stepwise/stat-card'

<StatCard
  label="Revenue"
  value="$48.2K"
  icon={<RevenueIcon />}
  accent="emerald"
  change={{ value: '+12.4%', direction: 'up' }}
  sparkline={[4, 6, 5, 8, 7, 9, 12]}
/>`

const toc = [
  { id: 'grid',  label: 'Grid',  child: false },
  { id: 'props', label: 'Props', child: false },
]

export default function StatCardPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Stat Card</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A dashboard metric tile — icon, label, a big number, an up/down/neutral change
            chip, and an optional inline sparkline. Five accent colors tint the icon badge
            and the sparkline stroke together.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add stat-card" />
        </section>

        <section id="grid" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Grid</Text>
          <PreviewCode
            minHeight={260}
            preview={<StatCardGridPreview />}
            code={<CodeBlock code={code} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'label',     type: 'string',                                          desc: 'Metric name.' },
            { name: 'value',     type: 'string | number',                                 desc: 'The big number.' },
            { name: 'change',    type: '{ value: string; direction: "up"|"down"|"neutral" }', desc: 'Trend chip below the value.' },
            { name: 'icon',      type: 'React.ReactNode',                                 desc: 'Small icon shown in a tinted badge.' },
            { name: 'accent',    type: '"sky"|"emerald"|"rose"|"amber"|"violet"',          desc: 'Tints the icon badge and sparkline. Default "sky".' },
            { name: 'sparkline', type: 'number[]',                                        desc: 'Optional inline trend line — any values, auto-normalized.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
