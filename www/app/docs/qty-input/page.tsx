import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { QtyInputBasicPreview, QtyInputStatesPreview } from '@/components/stepwise/docs/qty-input-preview'

const basicCode = `import { QtyInput } from '@/components/stepwise/qty-input'

const [qty, setQty] = useState(1)

<QtyInput value={qty} onChange={setQty} min={1} max={99} />`

const statesCode = `<QtyInput defaultValue={1} min={1} max={10} />
<QtyInput defaultValue={5} step={5} />
<QtyInput defaultValue={3} disabled />`

const toc = [
  { id: 'default',  label: 'Default',  child: false },
  { id: 'states', label: 'States', child: false },
  { id: 'props',  label: 'Props',  child: false },
]

export default function QtyInputPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Quantity Input</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A compact +/− stepper for cart quantities, numeric settings, or any bounded
            integer. The count animates on change. Minus is disabled at{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">min</code>,
            plus at{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">max</code>.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add qty-input" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={200}
            preview={<QtyInputBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="states" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">States</Text>
          <PreviewCode
            minHeight={240}
            preview={<QtyInputStatesPreview />}
            code={<CodeBlock code={statesCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'value',        type: 'number',                 desc: 'Controlled value.' },
            { name: 'defaultValue', type: 'number',                 desc: 'Uncontrolled initial value. Default 1.' },
            { name: 'onChange',     type: '(value: number) => void', desc: 'Fires on each step.' },
            { name: 'min',          type: 'number',                 desc: 'Minimum allowed value. Default 0.' },
            { name: 'max',          type: 'number',                 desc: 'Maximum allowed value. Default ∞.' },
            { name: 'step',         type: 'number',                 desc: 'Increment/decrement amount. Default 1.' },
            { name: 'disabled',     type: 'boolean',                desc: 'Disables all controls.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
