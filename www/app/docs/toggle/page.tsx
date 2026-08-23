import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  TogglePreview,
  ToggleSizesPreview,
  ToggleLabelPreview,
} from '@/components/stepwise/docs/toggle-preview'

const basicCode = `import { Toggle } from '@/components/stepwise/toggle'

const [on, setOn] = useState(true)

// no visible label — needs ariaLabel so screen readers know what it does
<Toggle checked={on} onChange={setOn} ariaLabel="Toggle" />`

const sizesCode = `<Toggle size="sm" defaultChecked ariaLabel="Small toggle" />
<Toggle size="default" defaultChecked ariaLabel="Default toggle" />
<Toggle size="lg" defaultChecked ariaLabel="Large toggle" />`

const labelCode = `<Toggle
  checked={on}
  onChange={setOn}
  label="Email notifications"
  hint="Get a digest when something needs you."
/>`

const toc = [
  { id: 'default', label: 'Default', child: false },
  { id: 'sizes', label: 'Sizes', child: false },
  { id: 'label', label: 'With label', child: false },
  { id: 'props', label: 'Props', child: false },
]

export default function TogglePage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Toggle</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A switch with some weight to it — the knob stretches along its direction of travel and
            settles on a spring, so the flip feels thrown rather than snapped. Controlled or
            uncontrolled, three sizes, with an optional label and hint.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add toggle" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={200}
            preview={<TogglePreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="sizes" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Sizes</Text>
          <PreviewCode
            minHeight={220}
            preview={<ToggleSizesPreview />}
            code={<CodeBlock code={sizesCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="label" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">With label</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            The label and hint are wired to the switch, so clicking either flips it.
          </Text>
          <PreviewCode
            minHeight={280}
            preview={<ToggleLabelPreview />}
            code={<CodeBlock code={labelCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'checked',        type: 'boolean',                    desc: 'Controlled state.' },
            { name: 'defaultChecked', type: 'boolean',                    desc: 'Uncontrolled initial state.' },
            { name: 'onChange',       type: '(checked: boolean) => void', desc: 'Fires on flip.' },
            { name: 'size',           type: '"sm" | "default" | "lg"',    desc: 'Default "default".' },
            { name: 'label',          type: 'string',                     desc: 'Label beside the switch.' },
            { name: 'hint',           type: 'string',                     desc: 'Helper line under the label.' },
            { name: 'ariaLabel',      type: 'string',                     desc: 'Accessible name for the switch. Needed when used without `label`.' },
            { name: 'disabled',       type: 'boolean',                    desc: 'Disables the switch.' },
            { name: 'className',      type: 'string',                     desc: 'Merged onto the outer wrapper.' },
          ]} />
        </section>

      </div>

      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
