import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  SelectionFrameBasicPreview,
  SelectionFrameHandlesPreview,
  SelectionFrameLinesPreview,
  SelectionFrameAnimatedPreview,
  SelectionFrameUsagePreview,
} from '@/components/stepwise/docs/selection-frame-preview'

const basicCode = `import { SelectionFrame } from '@/components/stepwise/selection-frame'

<SelectionFrame padding={6}>
  <span className="text-[28px] font-semibold">Consistent by Default</span>
</SelectionFrame>`

const handlesCode = `<SelectionFrame handles="square">…</SelectionFrame>  // default
<SelectionFrame handles="circle">…</SelectionFrame>`

const linesCode = `<SelectionFrame line="solid" />    // default
<SelectionFrame line="dashed" />   // dash [4, 4]
<SelectionFrame line="long" />     // dash [10, 6]

// override either preset's dash pattern directly
<SelectionFrame line="dashed" dash={[1, 3]} />`

const animatedCode = `// dashed / long → marching ants. Corner handles always pop in on mount.
<SelectionFrame animated line="dashed" />
<SelectionFrame animated line="long" color="#e11d48" handles="circle" />`

const usageCode = `<span className="text-[42px] font-semibold">
  Draw attention to what{' '}
  <SelectionFrame animated line="dashed" padding={4} handles="circle">
    matters
  </SelectionFrame>
</span>`

const tocItems = [
  { id: 'default',  label: 'Default',  child: false },
  { id: 'handles',  label: 'Handles',  child: false },
  { id: 'lines',    label: 'Lines',    child: false },
  { id: 'animated', label: 'Animated', child: false },
  { id: 'usage',    label: 'Usage',    child: false },
  { id: 'props',    label: 'Props',    child: false },
]

export default function SelectionFramePage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Selection Frame</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            That box Figma draws around a selected frame — corner handles and a crisp accent
            stroke. Wrap it around a text span or any div to call it out. Square or circle
            handles, solid, dashed, or long-dashed lines, static or marching-ants animated.
            It measures its child, so it always fits.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add selection-frame" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            preview={<SelectionFrameBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="handles" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Handles</Text>
          <PreviewCode
            preview={<SelectionFrameHandlesPreview />}
            code={<CodeBlock code={handlesCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="lines" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Lines</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">dashed</code>{' '}
            and <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">long</code>{' '}
            are tuned dash presets; pass <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">dash</code>{' '}
            to override either one's pattern directly.
          </Text>
          <PreviewCode
            preview={<SelectionFrameLinesPreview />}
            code={<CodeBlock code={linesCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="animated" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Animated</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Dashed and long lines march; a solid line has no dash pattern to march, so{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">animated</code>{' '}
            only affects the corner handles' entrance for it. Leave{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">animated</code>{' '}
            off for a fully static frame.
          </Text>
          <PreviewCode
            preview={<SelectionFrameAnimatedPreview />}
            code={<CodeBlock code={animatedCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="usage" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Usage</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Inline by default, so it drops straight into a headline or a sentence — the classic
            "circle the one word that matters" move. Pass{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">inline={'{false}'}</code>{' '}
            to wrap a block-level element like a card or an image instead.
          </Text>
          <PreviewCode
            minHeight={220}
            preview={<SelectionFrameUsagePreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'children', type: 'React.ReactNode',            desc: 'The content to frame — it is measured live.' },
            { name: 'handles',  type: '"square" | "circle"',        desc: 'Corner handle shape. Default "square".' },
            { name: 'line',     type: '"solid" | "dashed" | "long"', desc: 'Stroke style. Default "solid".' },
            { name: 'dash',     type: '[number, number]',           desc: 'Overrides the [dash, gap] px pair "dashed"/"long" resolve to.' },
            { name: 'animated', type: 'boolean',                    desc: 'Marching ants for "dashed"/"long". Corner handles always animate in. Default false.' },
            { name: 'color',    type: 'string',                     desc: 'Accent color. Default Figma blue (#0d99ff).' },
            { name: 'radius',   type: 'number',                     desc: 'Frame corner radius. Default 0.' },
            { name: 'padding',  type: 'number',                     desc: 'Gap between content and frame. Default 4.' },
            { name: 'inline',   type: 'boolean',                    desc: 'Inline (text spans) vs block. Default true.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
