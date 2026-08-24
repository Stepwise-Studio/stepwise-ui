import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { ScramblePreview } from '@/components/stepwise/docs/text-effects-preview'

const usageCode = `import { ScrambleText } from '@/components/stepwise/scramble-text'

// Default — a softer letter decode (intensity 0.45)
<ScrambleText>Stepwise Interface Kit</ScrambleText>

// Dial up the chaos, or slow the resolve
<ScrambleText intensity={0.9} speed={42}>
  Stepwise Interface Kit
</ScrambleText>

// Binary glyph pool + replay each time it re-enters the viewport
<ScrambleText charset="01" intensity={0.7} replayInView>
  10110101
</ScrambleText>`

const tocItems = [
  { id: 'preview', label: 'Preview', child: false },
  { id: 'props',   label: 'Props',   child: false },
]

export default function ScrambleTextPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Scramble Text</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Each character scrambles together first, then letters lock in one-by-one
            from left to right while the rest keep churning until the last one settles.
            Fires when it scrolls into view.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add scramble-text" />
        </section>

        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            preview={<ScramblePreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'children',     type: 'string',  desc: 'Final resolved text.' },
            { name: 'charset',      type: 'string',  desc: 'Glyph pool cycled before each character locks.' },
            { name: 'speed',        type: 'number',  desc: 'Baseline frame budget per character. Default 72. Higher = longer resolve.' },
            { name: 'intensity',    type: 'number',  desc: 'Chaos level, 0–1. 0 = subtle letter decode, 1 = aggressive symbol storm. Default 0.45.' },
            { name: 'replayInView', type: 'boolean', desc: 'Replay every time it re-enters the viewport. Default false (once).' },
            { name: 'className',    type: 'string',  desc: 'Extra classes on the root — font size, weight, color, tracking, etc. Inherited by the scramble layer.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
