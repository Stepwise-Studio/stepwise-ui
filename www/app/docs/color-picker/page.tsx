import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { ColorPickerBasicPreview, ColorPickerSizesPreview, ColorPickerPresetsPreview } from '@/components/stepwise/docs/color-picker-preview'

const basicCode = `import { ColorPicker } from '@/components/stepwise/color-picker'

const [color, setColor] = useState('#3b82f6')

<ColorPicker value={color} onChange={setColor} />`

const sizesCode = `<ColorPicker size="sm" value={color} onChange={setColor} />
<ColorPicker size="md" value={color} onChange={setColor} />
<ColorPicker size="lg" value={color} onChange={setColor} />`

const presetsCode = `<ColorPicker value={color} onChange={setColor} showPresets />`

const toc = [
  { id: 'default',   label: 'Default',   child: false },
  { id: 'sizes',   label: 'Sizes',   child: false },
  { id: 'presets', label: 'Presets', child: false },
  { id: 'props',   label: 'Props',   child: false },
]

export default function ColorPickerPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Color Picker</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A big saturation/value swatch up front, a plain hue rail underneath — drag either
            to dial in a colour, or sample one straight off the screen with the eyedropper.
            Hex (with alpha as 8-digit) is always one glance away, and quick-pick presets are
            available via <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">showPresets</code>.
            Never clipped — the panel renders in a portal.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add color-picker" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={300}
            preview={<ColorPickerBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="sizes" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Sizes</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">size</code>{' '}
            takes <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">"sm" | "md" | "lg"</code>.
            Default is "md".
          </Text>
          <PreviewCode
            minHeight={260}
            preview={<ColorPickerSizesPreview />}
            code={<CodeBlock code={sizesCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="presets" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Presets</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Off by default — pass{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">showPresets</code>{' '}
            to add a row of quick-pick swatches below the hex field.
          </Text>
          <PreviewCode
            minHeight={340}
            preview={<ColorPickerPresetsPreview />}
            code={<CodeBlock code={presetsCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'value',       type: 'string',                desc: 'Hex color string. Default "#3b82f6".' },
            { name: 'onChange',    type: '(hex: string) => void', desc: 'Fires with a valid 6-digit hex value on every change.' },
            { name: 'showPresets', type: 'boolean',               desc: 'Show a row of quick-pick preset swatches. Default false.' },
            { name: 'size',        type: '"sm" | "md" | "lg"',    desc: 'Trigger swatch size. Default "md".' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
