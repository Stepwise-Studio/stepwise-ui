import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  SliderBasicPreview,
  SliderDotsPreview,
  SliderRangePreview,
  SliderClassicalPreview,
  SliderShowcasePreview,
} from '@/components/stepwise/docs/slider-preview'

const basicCode = `import { Slider } from '@/components/stepwise/slider'

const [width, setWidth] = useState(40)

<Slider label="Width" value={width} onChange={setWidth} min={0} max={100} />`

const dotsCode = `// "dots" adds evenly spaced tick marks; they fade as the fill passes them
<Slider variant="dots" label="Shape" value={v} onChange={setV}
        min={0} max={8} step={1} dotCount={9} />`

const rangeCode = `// "range" gives two handles and returns a [start, end] tuple
const [range, setRange] = useState<[number, number]>([240, 680])

<Slider variant="range" label="Radius" value={range} onChange={setRange}
        min={0} max={1000} />`

const showcaseCode = `<Slider label="Opacity" value={a} onChange={setA} formatValue={n => \`\${n}%\`} />
<Slider variant="dots" label="Weight" value={b} onChange={setB} min={0} max={6} dotCount={7} />
<Slider variant="range" label="Price" value={c} onChange={setC} formatValue={n => \`$\${n}\`} />`

const classicalCode = `// classical is orthogonal to variant - dots/range still apply on top of it.
// Label/value move above the track instead of overlaying it.
<Slider classical label="Volume" value={v} onChange={setV} formatValue={n => \`\${n}%\`} />
<Slider classical variant="dots" label="Rating" value={r} onChange={setR} min={0} max={8} dotCount={9} />
<Slider classical variant="range" label="Price" value={p} onChange={setP} formatValue={n => \`$\${n}\`} />`

const tocItems = [
  { id: 'default',     label: 'Default',     child: false },
  { id: 'dots',      label: 'Dots',      child: false },
  { id: 'range',     label: 'Range',     child: false },
  { id: 'classical', label: 'Classical', child: false },
  { id: 'showcase',  label: 'Showcase',  child: false },
  { id: 'props',     label: 'Props',     child: false },
]

export default function SliderPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Slider</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            An inline field slider: a labelled squircle row with a thin handle and the live value,
            matching Input's corner radius and smoothing. Drag, click, or use the arrow
            keys. Comes in plain, dotted, and dual-handle range variants, plus a{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">classical</code>{' '}
            capsule-and-knob layout for when the field style isn't the fit; responsive and theme-aware.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add slider" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            preview={<SliderBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="dots" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Dots</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Tick marks split the track into steps. Each dot fades out as the fill passes it, so the
            handle reads its position at a glance - good for discrete, low-count settings.
          </Text>
          <PreviewCode
            preview={<SliderDotsPreview />}
            code={<CodeBlock code={dotsCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="range" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Range</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Two handles select a span; the fill sits between them and the handles can't cross.
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded mx-1">onChange</code>
            returns a <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">[start, end]</code> tuple.
          </Text>
          <PreviewCode
            preview={<SliderRangePreview />}
            code={<CodeBlock code={rangeCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="classical" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Classical</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Compact pill track, solid zinc fill, white knob inset equally on all four
            sides with a light shadow - no ring, no gradient.{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">classical</code>{' '}
            is orthogonal to <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">variant</code>:
            plain is continuous, <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">dots</code> adds
            fixed-interval ticks, <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">range</code> adds
            a second handle. Label and value sit above the track. Dots swap color instead of fading
            here - the capsule track is too compact for the fade to read.
          </Text>
          <PreviewCode
            preview={<SliderClassicalPreview />}
            code={<CodeBlock code={classicalCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="showcase" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Showcase</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Custom value formatting via{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">formatValue</code>.
          </Text>
          <PreviewCode
            preview={<SliderShowcasePreview />}
            code={<CodeBlock code={showcaseCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'variant',      type: '"plain" | "dots" | "range"',          desc: 'Track style. Default "plain".' },
            { name: 'classical',    type: 'boolean',                             desc: 'Compact pill-track layout instead of the field style. Default false.' },
            { name: 'orientation',  type: '"horizontal" | "vertical"',           desc: 'Classical track only. Default horizontal.' },
            { name: 'value',        type: 'number | [number, number]',           desc: 'Controlled value (tuple for range).' },
            { name: 'defaultValue', type: 'number | [number, number]',           desc: 'Uncontrolled initial value.' },
            { name: 'onChange',     type: '(v: number | [number, number]) => void', desc: 'Fires on drag / key / click.' },
            { name: 'min',          type: 'number',                              desc: 'Minimum. Default 0.' },
            { name: 'max',          type: 'number',                              desc: 'Maximum. Default 100.' },
            { name: 'step',         type: 'number',                              desc: 'Snap increment. Default 1.' },
            { name: 'label',        type: 'string',                              desc: 'Label shown inside, on the left.' },
            { name: 'showValue',    type: 'boolean',                             desc: 'Show the value on the right. Default true.' },
            { name: 'formatValue',  type: '(v: number) => string',               desc: 'Format the displayed value.' },
            { name: 'dotCount',     type: 'number',                              desc: 'Tick marks for the dots variant. Default 5.' },
            { name: 'disabled',     type: 'boolean',                             desc: 'Disables interaction.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
