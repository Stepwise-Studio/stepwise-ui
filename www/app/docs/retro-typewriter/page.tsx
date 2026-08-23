import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { RetroTypewriterPreview } from '@/components/stepwise/docs/retro-typewriter-preview'

const usageCode = `import { RetroTypewriter } from '@/components/stepwise/retro-typewriter'

// Click it, then type on your keyboard — characters land on the
// paper, the matching key depresses, a type-bar flicks, and each
// stroke plays a synthesized clack. The margin bell rings near the
// edge and the carriage wraps like the real thing.
<RetroTypewriter initialText="hello, world\\n" />`

const tocItems = [
  { id: 'preview',      label: 'Preview',      child: false },
  { id: 'installation', label: 'Installation', child: false },
  { id: 'usage',        label: 'Usage',        child: false },
  { id: 'behavior',     label: 'Behavior',     child: false },
  { id: 'props',        label: 'Props',        child: false },
]

export default function RetroTypewriterPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Retro Typewriter</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A vintage typewriter you actually type on. Focus it and every keystroke on your
            physical keyboard strikes the paper — the matching key depresses, a type-bar flicks
            up, and a synthesized clack plays. It rings a margin bell near the edge and returns
            the carriage on Enter. Set in the classic Special Elite typeface.
          </Text>
        </div>

        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            minHeight={620}
            preview={<RetroTypewriterPreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="installation" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add retro-typewriter" />
          <Text variant="body-soft" className="text-zinc-500 dark:text-zinc-400">
            Loads the{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">Special Elite</code>{' '}
            typewriter font via <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">next/font</code>.
            Sounds are synthesized with the Web Audio API — no audio files.
          </Text>
        </section>

        <section id="usage" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Usage</Text>
          <CodeBlock code={usageCode} lang="tsx" />
        </section>

        <section id="behavior" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Behavior</Text>
          <ul className="flex flex-col gap-2 text-[15px] text-zinc-600 dark:text-zinc-300 list-disc pl-5">
            <li>Click the machine (or the on-screen keys) to focus, then type on your keyboard.</li>
            <li>Printable characters land on the paper; <b>Backspace</b> erases; <b>Enter</b> returns the carriage.</li>
            <li>The margin bell rings a few columns before the edge; the carriage wraps at the column limit.</li>
            <li>On-screen keys are clickable too, so it works on touch devices.</li>
            <li>Mute the clack with the speaker button; all motion respects <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">prefers-reduced-motion</code>.</li>
          </ul>
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'initialText', type: 'string',  desc: 'Text already on the page when it mounts.' },
            { name: 'columns',     type: 'number',  desc: 'Characters per line before the carriage wraps. Default 34.' },
            { name: 'muted',       type: 'boolean', desc: 'Start with sound off. Default false.' },
            { name: 'className',   type: 'string',  desc: 'Extra classes on the outer scope.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
