import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { ScalePreview } from '@/components/stepwise/docs/scale-preview'

const usageCode = `import { Scale } from '@/components/stepwise/scale'

// set --pattern in a parent to control the line color
<div style={{ '--pattern': 'var(--ui-border)' }}>
  <Scale orientation="horizontal" />
  <Scale orientation="vertical" />
</div>`

const tocItems = [
  { id: 'preview', label: 'Preview', child: false },
  { id: 'props',   label: 'Props',   child: false },
]

export default function ScalePage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Scale</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A ruler-tick strip — diagonal hairlines at a fixed pitch. One component, two
            orientations, previously two separate files. Reads its line color from a{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">--pattern</code>{' '}
            CSS variable set by the consumer. Newly recovered from an old drive.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add scale" />
        </section>

        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            preview={<ScalePreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'orientation', type: "'horizontal' | 'vertical'", desc: "Strip direction. Default 'horizontal'." },
            { name: 'className',   type: 'string', desc: 'Merged onto the root.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
