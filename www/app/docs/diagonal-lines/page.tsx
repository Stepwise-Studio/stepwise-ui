import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { DiagonalLinesPreview, DiagonalLinesLeftPreview } from '@/components/stepwise/docs/diagonal-lines-preview'

const basicCode = `import { DiagonalLines } from '@/components/stepwise/diagonal-lines'

<div className="relative h-64">
  <DiagonalLines />
</div>`

const leftCode = `<div className="relative h-64">
  <DiagonalLines variant="left" />
</div>`

const toc = [
  { id: 'default', label: 'Default', child: false },
  { id: 'left',    label: 'Left',    child: false },
  { id: 'props',   label: 'Props',   child: false },
]

export default function DiagonalLinesPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Diagonal Lines</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Diagonal hairlines for section backgrounds, leaning left or right. Absolutely
            positioned to fill its nearest positioned ancestor - give the parent{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">relative</code>{' '}
            and a height.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add diagonal-lines" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Leans right.
          </Text>
          <PreviewCode
            preview={<DiagonalLinesPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="left" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Left</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Pass <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">variant="left"</code>{' '}
            to lean the other way.
          </Text>
          <PreviewCode
            preview={<DiagonalLinesLeftPreview />}
            code={<CodeBlock code={leftCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'variant',   type: "'left' | 'right'", desc: "Direction of lean. Default 'right'." },
            { name: 'size',      type: 'number',  desc: 'Pattern tile size in px. Default 24.' },
            { name: 'faded',     type: 'boolean', desc: 'Fade the pattern out toward the edges. Default true.' },
            { name: 'className', type: 'string',  desc: 'Merged onto the root.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
