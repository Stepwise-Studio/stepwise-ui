import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  ComboboxBasicPreview,
  ComboboxPlainPreview,
  ComboboxEmptyPreview,
} from '@/components/stepwise/docs/combobox-preview'

const basicCode = `import { Combobox } from '@/components/stepwise/combobox'

const options = [
  { value: 'next',  label: 'Next.js', description: 'The React framework for the web' },
  { value: 'remix', label: 'Remix',   description: 'Full stack web framework' },
]

<Combobox
  label="Framework"
  options={options}
  value={value}
  onChange={setValue}
  placeholder="Search frameworks…"
/>`

const plainCode = `// Descriptions are optional — omit them for a compact list
const countries = [
  { value: 'in', label: 'India' },
  { value: 'us', label: 'United States' },
]

<Combobox label="Country" options={countries} value={v} onChange={setV} />`

const emptyCode = `<Combobox
  options={countries}
  emptyMessage="Nothing matches that search"
/>`

const tocItems = [
  { id: 'default',    label: 'Default',        child: false },
  { id: 'plain',    label: 'Without descriptions', child: false },
  { id: 'empty',    label: 'Empty state',  child: false },
  { id: 'keyboard', label: 'Keyboard',     child: false },
  { id: 'props',    label: 'Props',        child: false },
]

export default function ComboboxPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Combobox</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A dropdown you can type into. Filters as you type, highlights the matched text, and is
            fully keyboard-driven. The field matches the Input's squircle and border treatment, so
            it sits naturally in a form.
          </Text>
        </div>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Each option can carry an optional{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">description</code>{' '}
            — it's searched alongside the label.
          </Text>
          <PreviewCode
            minHeight={600}
            preview={<ComboboxBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="plain" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Without descriptions</Text>
          <PreviewCode
            minHeight={600}
            preview={<ComboboxPlainPreview />}
            code={<CodeBlock code={plainCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="empty" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Empty state</Text>
          <PreviewCode
            minHeight={600}
            preview={<ComboboxEmptyPreview />}
            code={<CodeBlock code={emptyCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="keyboard" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Keyboard</Text>
          <ul className="flex flex-col gap-2 text-[15px] text-zinc-600 dark:text-zinc-300 list-disc pl-5">
            <li><b>↓ / ↑</b> — move through the filtered options (wraps around).</li>
            <li><b>Enter</b> — select the highlighted option.</li>
            <li><b>Esc</b> — close the list and clear the query.</li>
            <li>Typing filters instantly; the matched substring is emphasised in each row.</li>
          </ul>
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'options',      type: 'ComboboxOption[]',          desc: 'Array of { value, label, description? }.' },
            { name: 'value',        type: 'string',                    desc: 'Controlled selected value.' },
            { name: 'onChange',     type: '(value: string) => void',   desc: 'Called when an option is chosen.' },
            { name: 'placeholder',  type: 'string',                    desc: 'Field placeholder. Default "Search…".' },
            { name: 'label',        type: 'string',                    desc: 'Label rendered above the field.' },
            { name: 'emptyMessage', type: 'string',                    desc: 'Shown when nothing matches. Default "No results found".' },
            { name: 'disabled',     type: 'boolean',                   desc: 'Disables the field.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
