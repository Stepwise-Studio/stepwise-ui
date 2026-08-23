import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { ColorSwatchBasicPreview, ColorSwatchSizesPreview } from '@/components/stepwise/docs/color-swatch-preview'

const basicCode = `import { ColorSwatch } from '@/components/stepwise/color-swatch'

const [color, setColor] = useState('#3b82f6')

<ColorSwatch
  colors={['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']}
  value={color}
  onChange={setColor}
/>`

const sizeCode = `<ColorSwatch size={20} defaultValue="#18181b" colors={…} />
<ColorSwatch size={34} defaultValue="#0ea5e9" colors={…} />`

const toc = [
  { id: 'default', label: 'Default', child: false },
  { id: 'sizes', label: 'Sizes', child: false },
  { id: 'props', label: 'Props', child: false },
]

export default function ColorSwatchPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Color Swatch</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A row of color circles with a single active selection — the ring springs between
            swatches as you pick. Controlled or uncontrolled.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add color-swatch" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode minHeight={160} preview={<ColorSwatchBasicPreview />} code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="sizes" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Sizes</Text>
          <PreviewCode minHeight={160} preview={<ColorSwatchSizesPreview />} code={<CodeBlock code={sizeCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'colors',       type: 'string[]', desc: 'The selectable colors (any CSS color).' },
            { name: 'value',        type: 'string',   desc: 'Controlled active color.' },
            { name: 'defaultValue', type: 'string',   desc: 'Uncontrolled initial color.' },
            { name: 'onChange',     type: '(color: string) => void', desc: 'Fires on selection.' },
            { name: 'size',         type: 'number',   desc: 'Circle diameter in px. Default 26.' },
            { name: 'labels',       type: 'string[]', desc: 'Screen-reader labels, parallel to colors.' },
            { name: 'className',    type: 'string',   desc: 'Merged onto the root.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
