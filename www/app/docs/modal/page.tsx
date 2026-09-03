import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { ModalDefaultPreview, ModalLeftAlignPreview, ModalDestructivePreview } from '@/components/stepwise/docs/modal-preview'

const basicCode = `import { Modal } from '@/components/stepwise/modal'

const [open, setOpen] = useState(false)

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Save changes?"
  description="Saving will update your published content immediately."
  confirmLabel="Save changes"
  onConfirm={() => { /* ... */ setOpen(false) }}
/>`

const leftAlignCode = `<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Invite teammates"
  description="They'll get an email with a link to join this workspace."
  confirmLabel="Send invites"
  align="left"
  onConfirm={() => { /* ... */ setOpen(false) }}
/>`

const destructiveCode = `<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete your account?"
  description="This action cannot be undone."
  confirmLabel="Yes, delete account"
  variant="destructive"
  onConfirm={handleDelete}
  loading={deleting}
/>`

const toc = [
  { id: 'default',     label: 'Default',      child: false },
  { id: 'left-align',  label: 'Left aligned',  child: false },
  { id: 'destructive', label: 'Destructive',   child: false },
  { id: 'props',       label: 'Props',         child: false },
]

export default function ModalPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Modal</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A confirmation dialog that blocks the page until the user makes a choice.
            Scales up from center on open (250ms) and closes faster (150ms), with content
            staggering in after the panel lands. Renders in a portal, traps focus, and
            closes on Escape or backdrop click.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add modal" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={220}
            preview={<ModalDefaultPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="left-align" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Left aligned</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Pass{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">align="left"</code>{' '}
            to left-align the icon, title, and description, and move the actions to the trailing edge as
            auto-width buttons instead of a centered, evenly-split row.
          </Text>
          <PreviewCode
            minHeight={220}
            preview={<ModalLeftAlignPreview />}
            code={<CodeBlock code={leftAlignCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="destructive" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Destructive</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Red accent bar and confirm button. Pass{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">loading</code>{' '}
            to show a spinner while the action processes.
          </Text>
          <PreviewCode
            minHeight={220}
            preview={<ModalDestructivePreview />}
            code={<CodeBlock code={destructiveCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'open',         type: 'boolean',            desc: 'Controls visibility.' },
            { name: 'onClose',      type: '() => void',         desc: 'Called on backdrop click or Escape.' },
            { name: 'title',        type: 'string',             desc: 'Dialog heading.' },
            { name: 'description',  type: 'string',             desc: 'Supporting copy below the title.' },
            { name: 'confirmLabel', type: 'string',             desc: 'Confirm button label. Default "Confirm".' },
            { name: 'variant',      type: '"default" | "destructive"', desc: 'Visual style. Default "default".' },
            { name: 'align',        type: '"center" | "left"',  desc: 'Content alignment. Default "center".' },
            { name: 'onConfirm',    type: '() => void',         desc: 'Called when the confirm button is clicked.' },
            { name: 'loading',      type: 'boolean',            desc: 'Shows a spinner in the confirm button.' },
            { name: 'children',     type: 'ReactNode',          desc: 'Optional content between description and actions.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
