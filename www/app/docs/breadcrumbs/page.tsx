import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  BreadcrumbsSlashPreview,
  BreadcrumbsChevronPreview,
  BreadcrumbsOverflowPreview,
} from '@/components/stepwise/docs/breadcrumbs-preview'

const basicCode = `import { Breadcrumbs } from '@/components/stepwise/breadcrumbs'

// \`onNavigate\` intercepts the click and prevents the href navigation -
// drive the trail from state (or your router) instead of a page load.
<Breadcrumbs
  items={trail}
  onNavigate={(item, i) => setDepth(i + 1)}
/>`

const chevronCode = `<Breadcrumbs
  separator="chevron"
  items={[
    { label: 'Dashboard', href: '#' },
    { label: 'Settings',  href: '#' },
    { label: 'Profile' },
  ]}
/>`

const overflowCode = `// Past \`maxItems\` the middle collapses to a "…" menu
<Breadcrumbs
  maxItems={4}      // default
  itemsBefore={1}   // crumbs kept at the head
  itemsAfter={2}    // crumbs kept at the tail
  items={[
    { label: 'Home',        href: '#' },
    { label: 'Workspace',   href: '#' },
    { label: 'Projects',    href: '#' },
    { label: 'Stepwise UI', href: '#' },
    { label: 'Components',  href: '#' },
    { label: 'Navigation',  href: '#' },
    { label: 'Breadcrumbs' },
  ]}
/>`

const toc = [
  { id: 'slash',    label: 'Slash',    child: false },
  { id: 'chevron',  label: 'Chevron',  child: false },
  { id: 'overflow', label: 'Overflow', child: false },
  { id: 'props',    label: 'Props',    child: false },
]

export default function BreadcrumbsPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Breadcrumbs</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A navigation trail that collapses its middle into a menu once the path gets deep. The last item is always the current page (non-link).
            Choose between a slash or chevron separator.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add breadcrumbs" />
        </section>

        <section id="slash" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Slash separator</Text>
          <PreviewCode
            minHeight={120}
            preview={<BreadcrumbsSlashPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="chevron" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Chevron separator</Text>
          <PreviewCode
            minHeight={120}
            preview={<BreadcrumbsChevronPreview />}
            code={<CodeBlock code={chevronCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="overflow" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Overflow</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Past <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">maxItems</code> the
            middle collapses to a <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">…</code> that
            opens a menu of the hidden crumbs - picking one jumps straight there, the row
            itself never expands. The head and the current page always survive.
          </Text>
          <PreviewCode
            minHeight={140}
            preview={<BreadcrumbsOverflowPreview />}
            code={<CodeBlock code={overflowCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'items',       type: 'BreadcrumbItem[]',    desc: 'Ordered path items. Last item is the current page.' },
            { name: 'separator',   type: '"slash" | "chevron"', desc: 'Separator style. Default "slash".' },
            { name: 'maxItems',    type: 'number',              desc: 'Collapse the middle past this many crumbs. 0 never collapses. Default 4.' },
            { name: 'itemsBefore', type: 'number',              desc: 'Crumbs kept at the head when collapsed. Default 1.' },
            { name: 'itemsAfter',  type: 'number',              desc: 'Crumbs kept at the tail when collapsed. Default 2.' },
            { name: 'onNavigate',  type: '(item, index) => void', desc: 'Called on crumb click; prevents the default href navigation.' },
          ]} />

          <Text variant="h3" className="text-zinc-900 dark:text-white mt-6">BreadcrumbItem</Text>
          <PropsTable rows={[
            { name: 'label', type: 'string', desc: 'Visible text.' },
            { name: 'href',  type: 'string', desc: 'Link target. Omit on the last (current) item.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
