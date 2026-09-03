import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  MultiselectBasicPreview,
  MultiselectWithLabelPreview,
  MultiselectControlledPreview,
  MultiselectOverflowPreview,
} from '@/components/stepwise/docs/multiselect-preview'

const basicCode = `import { Multiselect } from '@/components/stepwise/multiselect'

const options = [
  { value: 'vanilla',   label: 'Vanilla' },
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'pistachio', label: 'Pistachio' },
]

<Multiselect options={options} placeholder="Choose flavors" />`

const labelCode = `<Multiselect
  label="Ice cream flavors"
  options={options}
  placeholder="Pick your favorites"
/>
<Multiselect
  label="Skills"
  options={skills}
  placeholder="Select skills"
/>`

const controlledCode = `const [values, setValues] = useState<string[]>(['react', 'typescript'])

<Multiselect
  label="Skills"
  options={skills}
  value={values}
  onChange={setValues}
/>`

const overflowCode = `// maxVisible controls how many chips show before "+N"
<Multiselect
  options={options}
  value={['vanilla', 'chocolate', 'strawberry', 'pistachio']}
  onChange={setValues}
  maxVisible={2}
/>`

const tocItems = [
  { id: 'default',      label: 'Default',      child: false },
  { id: 'label',      label: 'With label', child: false },
  { id: 'controlled', label: 'Controlled', child: false },
  { id: 'overflow',   label: 'Overflow',   child: false },
  { id: 'props',      label: 'Props',      child: false },
]

export default function MultiselectPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Multiselect</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Multi-option selector with removable pills in the trigger for selected values.
            Opens into a floating panel - matching Select and Combobox - with checkable rows.
            Supports overflow with a{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">+N</code>{' '}
            badge when selections exceed{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">maxVisible</code>.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add multiselect" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={680}
            preview={<MultiselectBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="label" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">With label</Text>
          <PreviewCode
            minHeight={680}
            preview={<MultiselectWithLabelPreview />}
            code={<CodeBlock code={labelCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="controlled" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Controlled</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Pass{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">value</code>{' '}
            (string array) and{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">onChange</code>{' '}
            for controlled usage. The component manages state internally when uncontrolled.
          </Text>
          <PreviewCode
            minHeight={680}
            preview={<MultiselectControlledPreview />}
            code={<CodeBlock code={controlledCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="overflow" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Overflow</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            When more items are selected than{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">maxVisible</code>{' '}
            (default: 2), the remaining count shows as a{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">+N</code>{' '}
            chip. Click the trigger to see all options.
          </Text>
          <PreviewCode
            minHeight={680}
            preview={<MultiselectOverflowPreview />}
            code={<CodeBlock code={overflowCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'options',     type: 'MultiselectOption[]',        desc: 'Array of { value, label } objects.' },
            { name: 'value',       type: 'string[]',                   desc: 'Controlled selected values.' },
            { name: 'onChange',    type: '(values: string[]) => void', desc: 'Called when selection changes.' },
            { name: 'placeholder', type: 'string',                     desc: 'Text shown when nothing is selected.' },
            { name: 'label',       type: 'string',                     desc: 'Label rendered above the trigger.' },
            { name: 'maxVisible',  type: 'number',                     desc: 'Max pills shown before +N. Default: 2.' },
            { name: 'disabled',    type: 'boolean',                    desc: 'Disables the trigger.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
