import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { TooltipPreview } from '@/components/stepwise/docs/tooltip-preview'
import { PropsTable } from '@/components/stepwise/docs/props-table'

const usageCode = `import { Tooltip } from '@/components/stepwise/tooltip'

// Basic - top by default
<Tooltip content="Save to cloud">
  <button>Save</button>
</Tooltip>

// Explicit side
<Tooltip content="Opens settings panel" side="right">
  <IconButton icon={<Settings />} />
</Tooltip>

// Flips automatically near viewport edges
<Tooltip content="Left-aligned but flips right near the edge" side="left">
  <button>Hover me</button>
</Tooltip>

// Rich content
<Tooltip content={<span>Press <kbd>⌘K</kbd> to open</span>} side="bottom">
  <button>Keyboard shortcut</button>
</Tooltip>`

const tocItems = [
  { id: 'preview', label: 'Preview', child: false },
  { id: 'usage',   label: 'Usage',   child: false },
  { id: 'props',   label: 'Props',   child: false },
]

export default async function TooltipPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Tooltip</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A lightweight, edge-aware tooltip that flips placement automatically when
            it would clip against the viewport. Delayed enter, instant exit - no
            library dependencies.
          </Text>
        </div>

        {/* Installation */}
        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add tooltip" />
        </section>

        {/* Preview + Code */}
        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            minHeight={400}
            preview={<TooltipPreview />}
            code={<CodeBlock code={usageCode} className="rounded-none" flat />}
          />
        </section>

        {/* Usage - distinct from the Preview's code tab, which shows the
            component's own source rather than practical call sites */}
        <section id="usage" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Usage</Text>
          <CodeBlock code={usageCode} lang="tsx" />
        </section>

        {/* Props */}
        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>

          <PropsTable rows={[
            { name: 'content',   type: 'ReactNode',                        desc: 'The text or rich content displayed inside the tooltip bubble.' },
            { name: 'children',  type: 'ReactElement',                     desc: 'The trigger element. Must be a single element - the tooltip injects its own ref and event listeners via cloneElement.' },
            { name: 'side',      type: '"top" | "bottom" | "left" | "right"', desc: 'Preferred placement. The tooltip automatically flips to the opposite or roomiest side when the preferred side does not have enough space. Default: "top".' },
            { name: 'className', type: 'string',                           desc: 'Extra classes applied to the tooltip bubble itself - useful for overriding max-width or styling.' },
          ]} />
        </section>

      </div>

      {/* On this page */}
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
