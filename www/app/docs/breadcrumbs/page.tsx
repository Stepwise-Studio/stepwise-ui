import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { BreadcrumbsSlashPreview, BreadcrumbsChevronPreview } from '@/components/stepwise/docs/breadcrumbs-preview'

const basicCode = `import { Breadcrumbs } from '@/components/stepwise/breadcrumbs'

<Breadcrumbs
  items={[
    { label: 'Home',       href: '/' },
    { label: 'Docs',       href: '/docs' },
    { label: 'Components', href: '/docs/components' },
    { label: 'Breadcrumbs' },
  ]}
/>`

const chevronCode = `<Breadcrumbs
  separator="chevron"
  items={[
    { label: 'Dashboard', href: '#' },
    { label: 'Settings',  href: '#' },
    { label: 'Profile' },
  ]}
/>`

const toc = [
  { id: 'slash',   label: 'Slash',   child: false },
  { id: 'chevron', label: 'Chevron', child: false },
  { id: 'props',   label: 'Props',   child: false },
]

export default function BreadcrumbsPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Breadcrumbs</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Accessible navigation trail. The last item is always the current page (non-link).
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

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'items',     type: 'BreadcrumbItem[]',    desc: 'Ordered path items. Last item is the current page.' },
            { name: 'separator', type: '"slash" | "chevron"', desc: 'Separator style. Default "slash".' },
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
