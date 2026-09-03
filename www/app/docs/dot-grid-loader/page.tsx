import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { DotGridBasicPreview, DotGridPatternsPreview } from '@/components/stepwise/docs/dot-grid-loader-preview'

const basicCode = `import { DotGridLoader } from '@/components/stepwise/dot-grid-loader'

<DotGridLoader pattern="wave" />`

const patternsCode = `<DotGridLoader pattern="wave" />    // diagonal sweep
<DotGridLoader pattern="ripple" />  // out from the centre
<DotGridLoader pattern="snake" />   // chases the ring
<DotGridLoader pattern="random" />  // scatter`

const toc = [
  { id: 'default',    label: 'Default',    child: false },
  { id: 'patterns', label: 'Patterns', child: false },
  { id: 'props',    label: 'Props',    child: false },
]

export default function DotGridLoaderPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Dot Grid Loader</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A 3×3 grid of animated dots, in four rhythms. Each cell only gets a delay from the chosen
            pattern, so the same nine dots read as a sweep, a ripple, a chase, or a scatter.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add dot-grid-loader" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={200}
            preview={<DotGridBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="patterns" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Patterns</Text>
          <PreviewCode
            minHeight={220}
            preview={<DotGridPatternsPreview />}
            code={<CodeBlock code={patternsCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'pattern',  type: '"wave" | "ripple" | "snake" | "random"', desc: 'Delay pattern. Default "wave".' },
            { name: 'dot',      type: 'number', desc: 'Dot diameter in px. Default 6.' },
            { name: 'gap',      type: 'number', desc: 'Gap between dots in px. Default 5.' },
            { name: 'duration', type: 'number', desc: 'Seconds per cycle. Default 1.4.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
