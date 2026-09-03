import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { DottedSpotlightPreview } from '@/components/stepwise/docs/dotted-spotlight-preview'

const usageCode = `import { DottedSpotlight } from '@/components/stepwise/dotted-spotlight'

<div className="relative h-64">
  <DottedSpotlight />
</div>`

const tocItems = [
  { id: 'preview', label: 'Preview', child: false },
  { id: 'props',   label: 'Props',   child: false },
]

export default function DottedSpotlightPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Dotted Spotlight</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A dot grid with a mouse-follow flashlight - dots brighten near the cursor.
            Absolutely positioned to fill its nearest positioned ancestor - give the parent{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">relative</code>{' '}
            and a height. Looking for the plain version?{' '}
            <a href="/docs/dotted-grid" className="underline decoration-zinc-300 underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-200">Dotted Grid</a>{' '}
            has its own page.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add dotted-spotlight" />
        </section>

        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            preview={<DottedSpotlightPreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'size',      type: 'number',  desc: 'Pattern tile size in px. Default 24.' },
            { name: 'dotSize',   type: 'number',  desc: 'Dot radius in px. Default 1.5.' },
            { name: 'radius',    type: 'number',  desc: 'Flashlight radius, px. Default 400.' },
            { name: 'faded',     type: 'boolean', desc: 'Fade the pattern out toward the edges. Default true.' },
            { name: 'className', type: 'string',  desc: 'Merged onto the root.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
