import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { CirclePreview } from '@/components/stepwise/docs/text-effects-preview'

const usageCode = `import { CircleAnnotation } from '@/components/stepwise/circle-annotation'

// Scribbles a hand-drawn circle around the text when in view
Every detail is <CircleAnnotation color="#e11d48">intentional</CircleAnnotation>.

// More breathing room + slower draw
<CircleAnnotation color="#0284c7" padding={18} duration={1.4} delay={0.3}>
  reviewed
</CircleAnnotation>`

const tocItems = [
  { id: 'preview', label: 'Preview', child: false },
  { id: 'props',   label: 'Props',   child: false },
]

export default function CircleAnnotationPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Circle Annotation</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A hand-drawn circle scribbled around the text with generous inner padding,
            drawn on when scrolled into view. Built on{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">rough.js</code>{' '}
            so the loop is an authentic sketchy ellipse — never a perfect SVG oval.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add circle-annotation" />
          <Text variant="body-soft" className="text-zinc-500 dark:text-zinc-400">
            Depends on <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded mx-1">roughjs</code>
            for the hand-drawn geometry.
          </Text>
        </section>

        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            preview={<CirclePreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'children',      type: 'React.ReactNode', desc: 'The text (or nodes) to circle.' },
            { name: 'color',         type: 'string',          desc: 'Tints text and stroke when set. Default currentColor.' },
            { name: 'thickness',     type: 'number',          desc: 'Stroke width in px. Scales from font size when omitted.' },
            { name: 'roughness',     type: 'number',          desc: 'Sketchiness (rough.js roughness). Default 1.6.' },
            { name: 'padding',       type: 'number',          desc: 'Gap between text and the loop, px. Scales from font size when omitted (min 14).' },
            { name: 'duration',      type: 'number',          desc: 'Draw-on duration in seconds. Default 1.25.' },
            { name: 'delay',         type: 'number',          desc: 'Pause before the draw begins, in seconds. Default 0.25.' },
            { name: 'stagger',       type: 'number',          desc: 'Delay between loops when doubleStroke is on. Default 0.2.' },
            { name: 'doubleStroke',  type: 'boolean',         desc: 'Draw a second loop for the classic double-circled look. Default true.' },
            { name: 'replayInView',  type: 'boolean',         desc: 'Replay the draw each time it scrolls into view. Default false.' },
            { name: 'className',     type: 'string',          desc: 'Tailwind classes for font size, weight, and tracking.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
