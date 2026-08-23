import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  ConversationTimelinePreview,
  ConversationTimelineLeftPreview,
} from '@/components/stepwise/docs/conversation-timeline-preview'

const basicCode = `import { ConversationTimeline } from '@/components/stepwise/conversation-timeline'

const checkpoints = [
  { id: '1', role: 'system',    label: 'System prompt' },
  { id: '2', role: 'user',      label: 'Can you help me set up auth?' },
  { id: '3', role: 'assistant', label: 'Of course — let me walk you through it' },
]

const [activeId, setActiveId] = useState('2')

<ConversationTimeline
  checkpoints={checkpoints}
  activeId={activeId}
  onSelect={setActiveId}
/>`

const leftCode = `<ConversationTimeline
  checkpoints={checkpoints}
  side="left"
  accent="#8b5cf6"
/>`

const toc = [
  { id: 'default', label: 'Default',      child: false },
  { id: 'left',  label: 'Left side',  child: false },
  { id: 'props', label: 'Props',      child: false },
  { id: 'types', label: 'Checkpoint', child: false },
]

export default function ConversationTimelinePage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Conversation Timeline</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            At rest, a dense rail of thin marks — one per message, tightly packed. Hover or
            keyboard-focus the rail and it expands: every row grows and its label fades in. The row
            under the cursor gets extra emphasis on top — its mark brightens, its label bolds and
            nudges out. Click any mark to select it.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add conversation-timeline" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Hover the rail (or Tab into it) to expand every row at once. Then hover a specific row
            for its extra emphasis.
          </Text>
          <PreviewCode
            minHeight={360}
            preview={<ConversationTimelinePreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="left" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Left side</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Flip the labels to the left of the marks and recolour the active line with{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">accent</code>.
          </Text>
          <PreviewCode
            minHeight={300}
            preview={<ConversationTimelineLeftPreview />}
            code={<CodeBlock code={leftCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'checkpoints', type: 'TimelineCheckpoint[]', desc: 'Array of checkpoint objects.' },
            { name: 'activeId',    type: 'string',               desc: 'The currently selected checkpoint id.' },
            { name: 'onSelect',    type: '(id: string) => void', desc: 'Called when a mark is clicked.' },
            { name: 'side',        type: '"left" | "right"',     desc: 'Which side labels appear on. Default "right".' },
            { name: 'rowHeight',   type: 'number',               desc: 'Per-row height once expanded (px). Default 24.' },
            { name: 'collapsedRowHeight', type: 'number',         desc: 'Per-row height at rest (px). Default 8.' },
            { name: 'accent',      type: 'string',               desc: "Active line colour. Default '#0ea5e9'." },
          ]} />
        </section>

        <section id="types" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">TimelineCheckpoint</Text>
          <PropsTable rows={[
            { name: 'id',       type: 'string',                          desc: 'Unique identifier.' },
            { name: 'label',    type: 'string',                          desc: 'The chat label revealed on hover.' },
            { name: 'sublabel', type: 'string',                          desc: 'Optional — reserved for richer labels.' },
            { name: 'role',     type: '"user" | "assistant" | "system"', desc: 'Optional role tag for your own styling.' },
          ]} />
        </section>

      </div>

      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
