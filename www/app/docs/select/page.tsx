import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  SelectBasicPreview,
  SelectWithLabelPreview,
  SelectControlledPreview,
  SelectDisabledPreview,
} from '@/components/stepwise/docs/select-preview'

const basicCode = `import { Select } from '@/components/stepwise/select'

const options = [
  { value: 'next',    label: 'Next.js' },
  { value: 'remix',   label: 'Remix' },
  { value: 'astro',   label: 'Astro' },
]

<Select options={options} placeholder="Choose a framework" />`

const labelCode = `<Select
  label="Framework"
  options={options}
  placeholder="Select a framework"
/>
<Select
  label="Timezone"
  options={timezones}
  placeholder="Select timezone"
/>`

const controlledCode = `const [value, setValue] = useState('next')

<Select
  label="Framework"
  options={options}
  value={value}
  onChange={setValue}
/>`

const disabledCode = `<Select options={options} placeholder="Disabled select" disabled />`

const tocItems = [
  { id: 'default',      label: 'Default',      child: false },
  { id: 'label',      label: 'With label', child: false },
  { id: 'controlled', label: 'Controlled', child: false },
  { id: 'disabled',   label: 'Disabled',   child: false },
  { id: 'props',      label: 'Props',      child: false },
]

export default function SelectPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Select</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Single-option selector with an input-like trigger and a floating panel below it,
            matching Combobox. Optional label, controlled or uncontrolled.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add select" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={520}
            preview={<SelectBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="label" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">With label</Text>
          <PreviewCode
            minHeight={620}
            preview={<SelectWithLabelPreview />}
            code={<CodeBlock code={labelCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="controlled" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Controlled</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Pass{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">value</code>{' '}
            and{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">onChange</code>{' '}
            for controlled usage. Without them the component manages its own state.
          </Text>
          <PreviewCode
            minHeight={520}
            preview={<SelectControlledPreview />}
            code={<CodeBlock code={controlledCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="disabled" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Disabled</Text>
          <PreviewCode
            minHeight={80}
            preview={<SelectDisabledPreview />}
            code={<CodeBlock code={disabledCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'options',     type: 'SelectOption[]',                           desc: 'Array of { value, label } objects.' },
            { name: 'value',       type: 'string',                                   desc: 'Controlled selected value.' },
            { name: 'onChange',    type: '(value: string) => void',                  desc: 'Called when selection changes.' },
            { name: 'placeholder', type: 'string',                                   desc: 'Text shown when nothing is selected.' },
            { name: 'label',       type: 'string',                                   desc: 'Label rendered above the trigger.' },
            { name: 'disabled',    type: 'boolean',                                  desc: 'Disables the trigger.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
