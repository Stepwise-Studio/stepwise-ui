import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  InfiniteCanvasBasicPreview,
  InfiniteCanvasTextPreview,
} from '@/components/stepwise/docs/infinite-canvas-preview'

const basicCode = `import { InfiniteCanvas } from '@/components/stepwise/infinite-canvas'

<InfiniteCanvas
  items={[
    <img src="/a.jpg" alt="" />,
    <ProductCard {...p} />,
    <Gradient from="#38bdf8" to="#6366f1" />,
    // …anything. 3+ tiles weave cleanly.
  ]}
  cellWidth={150}
  cellHeight={150}
/>`

const textCode = `<InfiniteCanvas
  items={tiles}
  centerContent={
    <div className="flex flex-col items-center gap-3">
      <h3 className="text-[44px] font-semibold">An endless canvas.</h3>
      <p>Drag anywhere to roam.</p>
    </div>
  }
/>`

const motionCode = `// Auto-motion is on by default — the plane drifts slowly to invite a drag,
// and the built-in toggle (bottom-right) lets people stop it.
<InfiniteCanvas items={tiles} defaultAutoMotion />

// tune the drift, or hide the toggle and drive it yourself
<InfiniteCanvas items={tiles} motionVector={{ x: -0.5, y: 0 }} showToggle={false} />`

const toc = [
  { id: 'default',  label: 'Default',           child: false },
  { id: 'text',   label: 'Text in middle',  child: false },
  { id: 'motion', label: 'Auto-motion',     child: false },
  { id: 'props',  label: 'Props',           child: false },
]

export default function InfiniteCanvasPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Infinite Canvas</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A draggable plane that never ends. Drop in images or any component and they weave
            outward forever — tiled so seamlessly that the same tile never sits edge-to-edge with
            itself. It drifts on its own to hint that it moves; grab it and roam, and it carries a
            little inertia when you let go.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add infinite-canvas" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Click and drag to move around. Every tile here is a real node — gradients, an avatar,
            chips, a code snippet. Flip auto-motion with the toggle in the corner.
          </Text>
          <PreviewCode
            minHeight={500}
            preview={<InfiniteCanvasBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="text" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Text in the middle</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Pass{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">centerContent</code>{' '}
            for the hero variant — a headline sits above the drifting canvas while it stays fully
            draggable underneath, with an edge vignette keeping the copy legible.
          </Text>
          <PreviewCode
            minHeight={500}
            preview={<InfiniteCanvasTextPreview />}
            code={<CodeBlock code={textCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="motion" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Auto-motion</Text>
          <CodeBlock code={motionCode} lang="tsx" />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'items',             type: 'ReactNode[]',           desc: 'Tiles to scatter. 3+ for a clean weave.' },
            { name: 'cellWidth',         type: 'number',                desc: 'Tile width in px. Default 200.' },
            { name: 'cellHeight',        type: 'number',                desc: 'Tile height in px. Default 200.' },
            { name: 'gap',               type: 'number',                desc: 'Gap between tiles in px. Default 16.' },
            { name: 'stagger',           type: 'boolean',               desc: 'Offset alternate columns for an organic weave. Default true.' },
            { name: 'defaultAutoMotion', type: 'boolean',               desc: 'Start the ambient drift. Default true.' },
            { name: 'motionVector',      type: '{ x: number; y: number }', desc: 'Drift velocity in px/frame. Default { x: -0.32, y: -0.18 }.' },
            { name: 'showToggle',        type: 'boolean',               desc: 'Show the built-in auto-motion toggle. Default true.' },
            { name: 'centerContent',     type: 'ReactNode',             desc: 'Centered overlay — the text-in-the-middle variant.' },
            { name: 'height',            type: 'number | string',       desc: 'Canvas height. Default 520.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
