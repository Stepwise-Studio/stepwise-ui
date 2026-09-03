import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { FadePreview } from '@/components/stepwise/docs/text-effects-preview'

const usageCode = `import { FadeText } from '@/components/stepwise/fade-text'

// Fades in word by word on mount (blurred rise, staggered)
<FadeText>Ship delightful interfaces faster</FadeText>

// Toggle \`show\` to fade out - the exit is softer than the enter
<FadeText show={visible} by="char">
  Character by character
</FadeText>`

const tocItems = [
  { id: 'preview', label: 'Preview', child: false },
  { id: 'props',   label: 'Props',   child: false },
]

export default function FadeTextPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Fade Text</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Fades text in and out, word by word or character by character. Each chunk rises in
            with a blur and leaves on a softer, smaller exit. Toggle <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">show</code> to play it either way.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add fade-text" />
        </section>

        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            preview={<FadePreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'children',  type: 'string',            desc: 'Text to animate.' },
            { name: 'by',        type: '"word" | "char"',   desc: 'Split granularity. Default "word".' },
            { name: 'show',      type: 'boolean',           desc: 'Fade in (true) or out (false). Default true.' },
            { name: 'stagger',   type: 'number',            desc: 'Per-chunk stagger in seconds. Default 0.05.' },
            { name: 'className', type: 'string',            desc: 'Extra classes (font size / weight).' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
