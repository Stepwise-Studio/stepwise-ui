import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { KbdBasicPreview, KbdInlinePreview } from '@/components/stepwise/docs/kbd-preview'

const basicCode = `import { Kbd } from '@/components/stepwise/kbd'

<Kbd keys={['⌘', 'K']} />
<Kbd keys={['⌘', '⇧', 'P']} />
<Kbd>Esc</Kbd>`

const inlineCode = `Press <Kbd keys={['⌘', 'K']} /> to open the command palette.`

const toc = [
  { id: 'default',  label: 'Default',  child: false },
  { id: 'inline', label: 'Inline', child: false },
  { id: 'props',  label: 'Props',  child: false },
]

export default function KbdPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Kbd</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A keyboard key cap. Pass a single child, or a{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">keys</code>{' '}
            array to render a multi-key chord.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add kbd" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode minHeight={120} preview={<KbdBasicPreview />} code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="inline" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Inline</Text>
          <PreviewCode minHeight={100} preview={<KbdInlinePreview />} code={<CodeBlock code={inlineCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'keys',      type: 'string[]', desc: 'Render each key in its own cap with a thin gap.' },
            { name: 'children',  type: 'ReactNode', desc: 'A single key - used when keys is omitted.' },
            { name: 'className', type: 'string',   desc: 'Merged onto the cap (or wrapper for keys).' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
