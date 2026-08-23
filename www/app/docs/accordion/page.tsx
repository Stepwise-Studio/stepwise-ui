import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { AccordionBasicPreview, AccordionMultiplePreview } from '@/components/stepwise/docs/accordion-preview'

const basicCode = `import { Accordion } from '@/components/stepwise/accordion'

const items = [
  { id: 'q1', title: 'What is Stepwise UI?', content: 'A collection of…' },
  { id: 'q2', title: 'How do I install?', content: 'Run npx stepwise-ui add…' },
]

<Accordion items={items} />`

const multipleCode = `<Accordion items={items} multiple />`

const toc = [
  { id: 'default',    label: 'Default',    child: false },
  { id: 'multiple', label: 'Multiple', child: false },
  { id: 'props',    label: 'Props',    child: false },
]

export default function AccordionPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Accordion</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Collapsible panels with spring-eased height animation and a rotating chevron.
            Single-open by default; pass{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">multiple</code>{' '}
            to allow several panels open at once.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add accordion" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={280}
            preview={<AccordionBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="multiple" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Multiple open</Text>
          <PreviewCode
            minHeight={240}
            preview={<AccordionMultiplePreview />}
            code={<CodeBlock code={multipleCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props — Accordion</Text>
          <PropsTable rows={[
            { name: 'items',    type: 'AccordionItem[]', desc: 'Array of panel definitions.' },
            { name: 'multiple', type: 'boolean',         desc: 'Allow multiple panels open simultaneously. Default false.' },
          ]} />

          <Text variant="h3" className="text-zinc-900 dark:text-white mt-6">Props — AccordionItem</Text>
          <PropsTable rows={[
            { name: 'id',      type: 'string',    desc: 'Unique key for this panel.' },
            { name: 'title',   type: 'string',    desc: 'Header text.' },
            { name: 'content', type: 'ReactNode', desc: 'Body content, revealed on open.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
