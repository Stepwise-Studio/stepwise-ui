import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  DrawerRightPreview,
  DrawerBottomPreview,
} from '@/components/stepwise/docs/drawer-otp-preview'

const basicCode = `import { Drawer } from '@/components/stepwise/drawer'

const [open, setOpen] = useState(false)

<Drawer open={open} onClose={() => setOpen(false)} side="right" title="Settings">
  <p>Drawer content here.</p>
</Drawer>`

const bottomCode = `import { Drawer } from '@/components/stepwise/drawer'

const [open, setOpen] = useState(false)

<Drawer open={open} onClose={() => setOpen(false)} side="bottom" title="Action sheet">
  <p>Drawer content here.</p>
</Drawer>`

const toc = [
  { id: 'side',   label: 'Side drawer',   child: false },
  { id: 'bottom', label: 'Bottom drawer', child: false },
  { id: 'props',  label: 'Props',         child: false },
]

export default function DrawerPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Drawer</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A panel that slides in from any edge of the screen. Left, right, and bottom
            variants - each with spring-eased entry, backdrop blur, scroll-lock, and
            Escape to close. The bottom drawer includes a drag handle and works great
            for action sheets and verification flows.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add drawer" />
        </section>

        <section id="side" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Side drawer</Text>
          <PreviewCode
            minHeight={220}
            preview={<DrawerRightPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="bottom" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Bottom drawer</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Slides up from the bottom edge - a natural fit for action sheets, filters, or
            (paired with <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">OtpInput</code>) verification flows.
          </Text>
          <PreviewCode
            minHeight={220}
            preview={<DrawerBottomPreview />}
            code={<CodeBlock code={bottomCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'open',      type: 'boolean',                      desc: 'Controls visibility.' },
            { name: 'onClose',   type: '() => void',                   desc: 'Called on backdrop click or Escape.' },
            { name: 'side',      type: '"left" | "right" | "bottom"',  desc: 'Which edge the panel slides from. Default "right".' },
            { name: 'title',     type: 'string',                       desc: 'Header title. Omit to hide the header.' },
            { name: 'width',     type: 'number',                       desc: 'Width for left/right drawers (px). Default 360.' },
            { name: 'height',    type: 'number | "auto"',              desc: 'Height for bottom drawer. Default "auto" (max 100dvh − 40px).' },
            { name: 'children',  type: 'ReactNode',                    desc: 'Content inside the drawer.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
