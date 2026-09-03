import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { SeparatorHorizontalPreview, SeparatorLabelPreview, SeparatorVerticalPreview } from '@/components/stepwise/docs/separator-preview'

const hCode = `import { Separator } from '@/components/stepwise/separator'

<Separator />`

const labelCode = `<Separator label="OR" />`

const vCode = `<div className="flex h-6 items-center gap-4">
  <span>Docs</span>
  <Separator orientation="vertical" />
  <span>Guides</span>
</div>`

const toc = [
  { id: 'horizontal', label: 'Horizontal', child: false },
  { id: 'label',      label: 'With label',  child: false },
  { id: 'vertical',   label: 'Vertical',    child: false },
  { id: 'props',      label: 'Props',       child: false },
]

export default function SeparatorPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Separator</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A thin divider between content. Horizontal or vertical, with an optional centered label.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add separator" />
        </section>

        <section id="horizontal" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Horizontal</Text>
          <PreviewCode minHeight={160} preview={<SeparatorHorizontalPreview />} code={<CodeBlock code={hCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="label" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">With label</Text>
          <PreviewCode minHeight={120} preview={<SeparatorLabelPreview />} code={<CodeBlock code={labelCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="vertical" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Vertical</Text>
          <PreviewCode minHeight={120} preview={<SeparatorVerticalPreview />} code={<CodeBlock code={vCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'orientation', type: "'horizontal' | 'vertical'", desc: 'Direction. Default horizontal.' },
            { name: 'label',       type: 'ReactNode', desc: 'Centered label - horizontal only.' },
            { name: 'className',   type: 'string',    desc: 'Merged onto the root.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
