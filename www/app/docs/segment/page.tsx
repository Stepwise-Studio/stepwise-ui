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
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A segmented control for switching between mutually exclusive options - the active
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
            code={<CodeBlock code={usageCode} className="rounded-none" flat />}
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
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Add a <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">content</code> to each option and Segment renders the active panel below with a blur-fade - a full tab group, no separate component.
          </Text>
          <PreviewCode
            minHeight={200}
            preview={<SegmentTabsPreview />}
            code={<CodeBlock code={tabsCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        {/* Usage - distinct from the Preview's code tab, which shows the
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
