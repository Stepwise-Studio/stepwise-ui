import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { SquigglyPreview } from '@/components/stepwise/docs/text-effects-preview'

const usageCode = `import { SquigglyUnderline } from '@/components/stepwise/squiggly-underline'

// Draws a wavy underline on when it scrolls into view — color tints text + stroke
The <SquigglyUnderline color="#e11d48">most important</SquigglyUnderline> detail.

// Tune the wave + draw speed (wave metrics scale from font size by default)
<SquigglyUnderline duration={1.2} delay={0.25} replayInView>
  emphasis
</SquigglyUnderline>`

const tocItems = [
  { id: 'preview',      label: 'Preview',      child: false },
  { id: 'installation', label: 'Installation', child: false },
  { id: 'usage',        label: 'Usage',        child: false },
  { id: 'props',        label: 'Props',        child: false },
]

export default function SquigglyUnderlinePage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Squiggly Underline</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A hand-drawn, wavy underline that draws itself on when scrolled into view. The wave
            scales with the inherited font size, mirrors for RTL, and tints both text and stroke
            when a color is set so emphasis never relies on the underline alone.
          </Text>
        </div>

        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            preview={<SquigglyPreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="installation" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add squiggly-underline" />
        </section>

        <section id="usage" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Usage</Text>
          <CodeBlock code={usageCode} lang="tsx" />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'children',      type: 'React.ReactNode', desc: 'The text (or nodes) to underline.' },
            { name: 'color',         type: 'string',          desc: 'Tints text and stroke. Default currentColor.' },
            { name: 'amplitude',     type: 'number',          desc: 'Wave height in px. Scales from font size when omitted.' },
            { name: 'wavelength',    type: 'number',          desc: 'Wave length in px. Scales from font size when omitted.' },
            { name: 'thickness',     type: 'number',          desc: 'Stroke width in px. Scales from font size when omitted.' },
            { name: 'duration',      type: 'number',          desc: 'Draw-on duration in seconds at ~100px width. Scales with text length. Default 1.1.' },
            { name: 'delay',         type: 'number',          desc: 'Pause before the draw begins, in seconds. Default 0.2.' },
            { name: 'replayInView',  type: 'boolean',         desc: 'Replay the draw each time it scrolls into view. Default false.' },
            { name: 'className',     type: 'string',          desc: 'Tailwind classes for font size, weight, and tracking.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
