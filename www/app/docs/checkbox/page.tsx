import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  CheckboxStatesPreview,
  CheckboxSizesPreview,
  CheckboxGroupPreview,
  CheckboxIndeterminatePreview,
  CheckboxDisabledPreview,
} from '@/components/stepwise/docs/checkbox-preview'

const statesCode = `import { Checkbox } from '@/components/stepwise/checkbox'

<Checkbox label="Unchecked" />
<Checkbox label="Checked" defaultChecked />
<Checkbox label="Indeterminate" indeterminate />`

const sizesCode = `<Checkbox size="sm"      label="Small"   defaultChecked />
<Checkbox size="default" label="Default" defaultChecked />
<Checkbox size="lg"      label="Large"   defaultChecked />`

const groupCode = `const [selected, setSelected] = useState<Set<string>>(new Set(['Notifications']))

const toggle = (item: string) => {
  const next = new Set(selected)
  next.has(item) ? next.delete(item) : next.add(item)
  setSelected(next)
}

{items.map(item => (
  <Checkbox
    key={item}
    label={item}
    checked={selected.has(item)}
    onChange={() => toggle(item)}
  />
))}`

const indeterminateCode = `const allChecked = selected.size === items.length
const someChecked = selected.size > 0 && selected.size < items.length

<Checkbox
  label="Select all"
  checked={allChecked}
  indeterminate={someChecked}
  onChange={toggleAll}
/>
{items.map(item => (
  <Checkbox
    key={item}
    label={item}
    checked={selected.has(item)}
    onChange={() => toggle(item)}
  />
))}`

const disabledCode = `<Checkbox label="Unchecked disabled" disabled />
<Checkbox label="Checked disabled" defaultChecked disabled />
<Checkbox label="Indeterminate disabled" indeterminate disabled />`

const tocItems = [
  { id: 'states',        label: 'States',        child: false },
  { id: 'sizes',         label: 'Sizes',         child: false },
  { id: 'group',         label: 'Group',         child: false },
  { id: 'indeterminate', label: 'Indeterminate', child: false },
  { id: 'disabled',      label: 'Disabled',      child: false },
  { id: 'props',         label: 'Props',         child: false },
]

export default function CheckboxPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Checkbox</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Squircle checkbox in three sizes. Supports checked, indeterminate, and disabled states.
            Works controlled or uncontrolled. Use{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">indeterminate</code>{' '}
            for parent checkboxes in a tree selection.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add checkbox" />
        </section>

        <section id="states" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">States</Text>
          <PreviewCode
            minHeight={100}
            preview={<CheckboxStatesPreview />}
            code={<CodeBlock code={statesCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="sizes" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Sizes</Text>
          <PreviewCode
            minHeight={80}
            preview={<CheckboxSizesPreview />}
            code={<CodeBlock code={sizesCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="group" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Group</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Manage a set of checkboxes with a{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">Set</code>{' '}
            in local state. Each checkbox is a controlled component.
          </Text>
          <PreviewCode
            minHeight={200}
            preview={<CheckboxGroupPreview />}
            code={<CodeBlock code={groupCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="indeterminate" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Indeterminate</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Pass{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">indeterminate</code>{' '}
            to show the dash state — useful for a "select all" checkbox when some items are selected.
            The{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">indeterminate</code>{' '}
            prop overrides the visual even if{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">checked</code>{' '}
            is true.
          </Text>
          <PreviewCode
            minHeight={200}
            preview={<CheckboxIndeterminatePreview />}
            code={<CodeBlock code={indeterminateCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="disabled" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Disabled</Text>
          <PreviewCode
            minHeight={80}
            preview={<CheckboxDisabledPreview />}
            code={<CodeBlock code={disabledCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'size',           type: '"sm" | "default" | "lg"', desc: '14 / 18 / 22 px. Default: "default".' },
            { name: 'label',          type: 'string',                  desc: 'Text label rendered next to the checkbox.' },
            { name: 'checked',        type: 'boolean',                 desc: 'Controlled checked state.' },
            { name: 'defaultChecked', type: 'boolean',                 desc: 'Initial state when uncontrolled.' },
            { name: 'indeterminate',  type: 'boolean',                 desc: 'Shows dash. Overrides the visual regardless of checked.' },
            { name: 'disabled',       type: 'boolean',                 desc: '40% opacity, blocks interaction.' },
            { name: 'onChange',       type: '(e: ChangeEvent) => void', desc: 'Change handler — receives the native event.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
