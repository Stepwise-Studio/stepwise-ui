import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { PaginationBasicPreview, PaginationSiblingsPreview, PaginationFewPagesPreview } from '@/components/stepwise/docs/pagination-preview'

const basicCode = `import { Pagination } from '@/components/stepwise/pagination'

const [page, setPage] = useState(1)

<Pagination page={page} totalPages={12} onChange={setPage} />`

const siblingsCode = `<Pagination page={page} totalPages={20} onChange={setPage} siblings={2} />`

const fewPagesCode = `// Nothing to configure - the ellipsis only ever appears once there's
// actually a gap wide enough to need one.
<Pagination page={page} totalPages={3} onChange={setPage} />`

const toc = [
  { id: 'default',    label: 'Default',    child: false },
  { id: 'siblings', label: 'Siblings', child: false },
  { id: 'few-pages', label: 'Few pages', child: false },
  { id: 'props',    label: 'Props',    child: false },
]

export default function PaginationPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Pagination</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Page number navigation with smart ellipsis, prev/next arrows, and an
            active-page squircle pill. Fully controlled - manage{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">page</code>{' '}
            state yourself.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add pagination" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={140}
            preview={<PaginationBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="siblings" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">More siblings</Text>
          <PreviewCode
            minHeight={140}
            preview={<PaginationSiblingsPreview />}
            code={<CodeBlock code={siblingsCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="few-pages" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Few pages</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            The same component, not a separate mode - once every page fits without a gap,
            the row is just the page numbers and the arrows.
          </Text>
          <PreviewCode
            minHeight={140}
            preview={<PaginationFewPagesPreview />}
            code={<CodeBlock code={fewPagesCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'page',       type: 'number',                desc: 'Current active page (1-indexed).' },
            { name: 'totalPages', type: 'number',                desc: 'Total number of pages.' },
            { name: 'onChange',   type: '(page: number) => void', desc: 'Called when the user navigates to a new page.' },
            { name: 'siblings',   type: 'number',                desc: 'Pages to show either side of active. Default 1.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
