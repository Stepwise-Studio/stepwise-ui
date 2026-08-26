import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { ScaleHorizontalPreview, ScaleVerticalPreview, ScaleUsagePreview } from '@/components/stepwise/docs/scale-preview'

const horizontalCode = `import { Scale } from '@/components/stepwise/scale'

// --pattern controls the line color, thickness controls the strip's height in px
<Scale orientation="horizontal" thickness={24} style={{ '--pattern': 'var(--ui-border)' }} />`

const verticalCode = `// Vertical fills its parent's height — give the parent one
<div className="h-32">
  <Scale orientation="vertical" style={{ '--pattern': 'var(--ui-border)' }} />
</div>`

const usageCode = `// A hairline seam between two page sections — reads better than a plain
// border when the page above and below it are both fairly quiet
<div style={{ '--pattern': 'var(--ui-border)' }}>
  <section>{/* last section before the footer */}</section>
  <Scale orientation="horizontal" thickness={30} />
  <footer>{/* footer */}</footer>
</div>`

const tocItems = [
  { id: 'horizontal', label: 'Horizontal', child: false },
  { id: 'vertical',   label: 'Vertical',   child: false },
  { id: 'usage',      label: 'Usage',      child: false },
  { id: 'props',      label: 'Props',      child: false },
]

export default function ScalePage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Scale</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A ruler-tick strip — diagonal hairlines at a fixed pitch. One component, two
            orientations. Reads its line color from a{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">--pattern</code>{' '}
            CSS variable set by the consumer.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add scale" />
        </section>

        <section id="horizontal" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Horizontal</Text>
          <PreviewCode
            preview={<ScaleHorizontalPreview />}
            code={<CodeBlock code={horizontalCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="vertical" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Vertical</Text>
          <PreviewCode
            preview={<ScaleVerticalPreview />}
            code={<CodeBlock code={verticalCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="usage" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Usage</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A hairline separator between two page sections — here, the last section before
            a footer. Reads as an intentional seam rather than a plain divider.
          </Text>
          <PreviewCode
            minHeight={280}
            preview={<ScaleUsagePreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'orientation', type: "'horizontal' | 'vertical'", desc: "Strip direction. Default 'horizontal'." },
            { name: 'thickness',   type: 'number', desc: 'Strip thickness in px. Default 40.' },
            { name: 'className',   type: 'string', desc: 'Merged onto the root.' },
            { name: 'style',       type: 'CSSProperties', desc: "Merged onto the root — set --pattern here to control the line color." },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
