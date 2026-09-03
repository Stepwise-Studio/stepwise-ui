import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { PopoverBasicPreview, PopoverSidePreview } from '@/components/stepwise/docs/popover-preview'

const basicCode = `import { Popover } from '@/components/stepwise/popover'

<Popover trigger={<Button>Open popover</Button>}>
  <div className="flex flex-col gap-3">
    <Input label="" aria-label="Project name" placeholder="stepwise-ui" />
    <Button size="sm" fullWidth>Save</Button>
  </div>
</Popover>`

const sideCode = `<Popover side="top" trigger={…}>…</Popover>
<Popover align="start" trigger={…}>…</Popover>`

const toc = [
  { id: 'default', label: 'Default',           child: false },
  { id: 'side',  label: 'Side & align',     child: false },
  { id: 'props', label: 'Props',            child: false },
]

export default function PopoverPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Popover</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A generic floating panel anchored to a trigger - put any content inside. Origin-aware
            open animation, closes on outside click or Escape. Controlled or uncontrolled.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add popover" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode minHeight={420} allowOverflow preview={<PopoverBasicPreview />} code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="side" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Side &amp; align</Text>
          <PreviewCode minHeight={200} allowOverflow preview={<PopoverSidePreview />} code={<CodeBlock code={sideCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'trigger',      type: 'ReactNode', desc: 'Element that toggles the panel.' },
            { name: 'children',     type: 'ReactNode', desc: 'Panel content.' },
            { name: 'side',         type: "'bottom' | 'top'", desc: 'Which side to open on. Default bottom.' },
            { name: 'align',        type: "'start' | 'center' | 'end'", desc: 'Horizontal alignment. Default center.' },
            { name: 'open',         type: 'boolean', desc: 'Controlled open state.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', desc: 'Fires on open/close.' },
            { name: 'className',    type: 'string', desc: 'Merged onto the wrapper.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
