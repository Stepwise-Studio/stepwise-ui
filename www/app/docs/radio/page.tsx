import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  RadioStatesPreview,
  RadioSizesPreview,
  RadioGroupPreview,
  RadioDisabledPreview,
} from '@/components/stepwise/docs/radio-preview'

const statesCode = `import { Radio } from '@/components/stepwise/radio'

<Radio label="Unchecked" />
<Radio label="Checked" defaultChecked />`

const sizesCode = `<Radio size="sm"      label="Small"   defaultChecked />
<Radio size="default" label="Default" defaultChecked />
<Radio size="lg"      label="Large"   defaultChecked />`

const groupCode = `const [value, setValue] = useState('pro')

{options.map(opt => (
  <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
    <Radio
      name="plan"
      value={opt.value}
      checked={value === opt.value}
      onChange={() => setValue(opt.value)}
    />
    <span>
      <span className="text-[14px] font-medium">{opt.label}</span>
      <span className="text-[12px] text-zinc-500">{opt.desc}</span>
    </span>
  </label>
))}`

const disabledCode = `<Radio label="Unchecked disabled" disabled />
<Radio label="Checked disabled" defaultChecked disabled />`

const tocItems = [
  { id: 'states',   label: 'States',   child: false },
  { id: 'sizes',    label: 'Sizes',    child: false },
  { id: 'group',    label: 'Group',    child: false },
  { id: 'disabled', label: 'Disabled', child: false },
  { id: 'props',    label: 'Props',    child: false },
]

export default function RadioPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Radio</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Squircle radio button in three sizes. Works controlled or uncontrolled.
            For groups, manage state externally and pass the same{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">name</code>{' '}
            to each radio.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add radio" />
        </section>

        <section id="states" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">States</Text>
          <PreviewCode
            minHeight={80}
            preview={<RadioStatesPreview />}
            code={<CodeBlock code={statesCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="sizes" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Sizes</Text>
          <PreviewCode
            minHeight={80}
            preview={<RadioSizesPreview />}
            code={<CodeBlock code={sizesCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="group" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Group</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Track selected value in{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">useState</code>{' '}
            and pass{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">checked</code>{' '}
            as a comparison. Wrap the radio inside a custom label for richer content.
          </Text>
          <PreviewCode
            minHeight={220}
            preview={<RadioGroupPreview />}
            code={<CodeBlock code={groupCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="disabled" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Disabled</Text>
          <PreviewCode
            minHeight={80}
            preview={<RadioDisabledPreview />}
            code={<CodeBlock code={disabledCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'size',           type: '"sm" | "default" | "lg"', desc: '16 / 20 / 24 px. Default: "default".' },
            { name: 'label',          type: 'string',                  desc: 'Text label next to the radio.' },
            { name: 'checked',        type: 'boolean',                 desc: 'Controlled checked state.' },
            { name: 'defaultChecked', type: 'boolean',                 desc: 'Initial state when uncontrolled.' },
            { name: 'disabled',       type: 'boolean',                 desc: '40% opacity, blocks interaction.' },
            { name: 'name',           type: 'string',                  desc: 'Input name - groups radios in native forms.' },
            { name: 'onChange',       type: '(e: ChangeEvent) => void', desc: 'Change handler - receives the native event.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
