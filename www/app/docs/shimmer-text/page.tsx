import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { ShimmerPreview } from '@/components/stepwise/docs/text-effects-preview'

const usageCode = `import { ShimmerText } from '@/components/stepwise/shimmer-text'

// The AI "thinking / generating" label — a highlight band
// sweeps across muted text on an infinite loop. Pure CSS.
<ShimmerText>Generating response…</ShimmerText>

// Tune the sweep speed (seconds)
<ShimmerText duration={1.4}>Summarizing sources</ShimmerText>`

const tocItems = [
  { id: 'preview',      label: 'Preview',      child: false },
  { id: 'installation', label: 'Installation', child: false },
  { id: 'usage',        label: 'Usage',        child: false },
  { id: 'props',        label: 'Props',        child: false },
]

export default function ShimmerTextPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Shimmer Text</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            The loading shimmer every AI-native app reaches for. A highlight band sweeps
            across muted text on an endless loop — a "thinking" state that feels alive
            without a spinner. Pure CSS, so it costs nothing to run.
          </Text>
        </div>

        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            preview={<ShimmerPreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="installation" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add shimmer-text" />
          <Text variant="body-soft" className="text-zinc-500 dark:text-zinc-400">
            Ships with a small CSS block (the two-layer gradient clip) and theme-aware
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded mx-1">--shimmer-base</code>
            /
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded mx-1">--shimmer-highlight</code>
            tokens you can retune per brand.
          </Text>
        </section>

        <section id="usage" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Usage</Text>
          <CodeBlock code={usageCode} lang="tsx" />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'children', type: 'string',  desc: 'Text to shimmer (mirrored into data-text for the clip layer).' },
            { name: 'duration', type: 'number',  desc: 'Sweep duration in seconds. Default 2.' },
            { name: 'band',     type: 'number',  desc: 'Highlight band width as a % of text width. Default 300.' },
            { name: 'className', type: 'string', desc: 'Extra classes (set font size / weight here).' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
