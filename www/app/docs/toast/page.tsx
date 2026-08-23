import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  ToastTypesPreview,
  ToastWithActionPreview,
  ToastSoundPreview,
  ToastDismissPreview,
} from '@/components/stepwise/docs/toast-preview'

const setupCode = `// Add <Toaster /> once at your app root (e.g. layout.tsx)
import { Toaster } from '@/components/stepwise/toast'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}`

const typesCode = `import { toast } from '@/components/stepwise/toast'

toast.success('Changes saved', { description: 'Your profile has been updated.' })
toast.warning('Storage almost full', { description: 'You have used 90% of your storage.' })
toast.error('Upload failed', { description: 'The file could not be uploaded.' })
toast.info('New update available', { description: 'Version 2.4.0 is ready to install.' })`

const actionCode = `// With an action button (replaces the dismiss ×)
toast.show({
  type: 'success',
  title: 'Message sent',
  description: 'Your message was delivered.',
  action: {
    label: 'Undo',
    onClick: () => { /* undo logic */ },
  },
})`

const soundCode = `// Opt in to a toaster "pop + ding" when the toast appears.
// Synthesized with the Web Audio API — no audio files.
toast.success('Toast is ready!', {
  description: 'Pops up with a toaster ding.',
  sound: true,
})`

const dismissCode = `// Default: shows a × dismiss button
toast.info('Notification', { description: 'Click × to dismiss.' })

// Programmatic dismiss
const id = toast.show({ type: 'info', title: 'Loading…', duration: 99999 })
// later…
toast.dismiss(id)`

const tocItems = [
  { id: 'setup',    label: 'Setup',       child: false },
  { id: 'types',    label: 'Types',       child: false },
  { id: 'action',   label: 'With action', child: false },
  { id: 'sound',    label: 'Sound',       child: false },
  { id: 'dismiss',  label: 'Dismiss',     child: false },
  { id: 'props',    label: 'Props',       child: false },
]

export default function ToastPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Toast</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Global notification toasts in four types — success, warning, error, and info.
            Slides up from the bottom center, auto-dismisses after 5 seconds, and renders
            via a portal so it sits above everything else.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add toast" />
        </section>

        <section id="setup" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Setup</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Add{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">{'<Toaster />'}</code>{' '}
            once in your app root. Then call{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">toast.*</code>{' '}
            anywhere — no context provider needed.
          </Text>
          <CodeBlock code={setupCode} lang="tsx" />
        </section>

        <section id="types" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Types</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Click the buttons to see each toast type.
          </Text>
          <PreviewCode
            minHeight={120}
            preview={<ToastTypesPreview />}
            code={<CodeBlock code={typesCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="action" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">With action</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Pass an{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">action</code>{' '}
            object to replace the dismiss × with a labeled button. Clicking it runs{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">onClick</code>{' '}
            and auto-dismisses the toast.
          </Text>
          <PreviewCode
            minHeight={120}
            preview={<ToastWithActionPreview />}
            code={<CodeBlock code={actionCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="sound" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Sound</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Set{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">sound: true</code>{' '}
            to play a toaster "pop + ding" when the toast appears — synthesized with the Web Audio
            API, so there are no audio files to ship. It is off by default; toggle it per toast.
          </Text>
          <PreviewCode
            minHeight={100}
            preview={<ToastSoundPreview />}
            code={<CodeBlock code={soundCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="dismiss" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Dismiss</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Toasts auto-dismiss after 5 seconds (configurable via{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">duration</code>
            ).{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">toast.show()</code>{' '}
            returns an id for programmatic dismissal.
          </Text>
          <PreviewCode
            minHeight={100}
            preview={<ToastDismissPreview />}
            code={<CodeBlock code={dismissCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 mb-2">
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">toast.show()</code> accepts:
          </Text>
          <PropsTable rows={[
            { name: 'type',        type: '"success" | "warning" | "error" | "info"', desc: 'Icon and color scheme.' },
            { name: 'title',       type: 'string',                                   desc: 'Main message.' },
            { name: 'description', type: 'string',                                   desc: 'Optional secondary line.' },
            { name: 'action',      type: '{ label: string; onClick: () => void }',   desc: 'Adds an action button. Replaces the dismiss ×.' },
            { name: 'sound',       type: 'boolean',                                  desc: 'Play a toaster pop + ding on appear. Default: false.' },
            { name: 'duration',    type: 'number',                                   desc: 'Auto-dismiss delay in ms. Default: 5000.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
