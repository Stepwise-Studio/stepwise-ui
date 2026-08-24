import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { AnimatedGradientPreview } from '@/components/stepwise/docs/animated-gradient-preview'

const usageCode = `import { AnimatedGradient } from '@/components/stepwise/animated-gradient'

<AnimatedGradient text="Stepwise UI" className="text-5xl font-semibold" />`

const tocItems = [
  { id: 'preview', label: 'Preview', child: false },
  { id: 'props',   label: 'Props',   child: false },
]

export default function AnimatedGradientPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Animated Gradient</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A colorful gradient sweeps across the text on a loop, playing only while it's in
            view. Newly recovered from an old drive — imports have been updated to this
            project's conventions, but the component itself hasn't been reworked yet.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add animated-gradient" />
        </section>

        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            minHeight={280}
            preview={<AnimatedGradientPreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'text',       type: 'string',  desc: 'Text to render and sweep the gradient across.' },
            { name: 'duration',   type: 'number',  desc: 'Sweep duration in seconds. Default 5.' },
            { name: 'loop',       type: 'boolean', desc: 'Repeat the sweep indefinitely. Default true.' },
            { name: 'withGrain',  type: 'boolean', desc: 'Blend the gradient with overlay blend mode. Default false.' },
            { name: 'className',  type: 'string',  desc: 'Extra classes (set font size / weight here).' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
