import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { TablePreview, TablePaginatedPreview } from '@/components/stepwise/docs/table-preview'

const basicCode = `import { Table, type TableColumn } from '@/components/stepwise/table'

type User = { name: string; role: string; status: string }

const columns: TableColumn<User>[] = [
  { key: 'name',   header: 'Name',   width: '1fr' },
  { key: 'role',   header: 'Role',   width: '120px' },
  {
    key: 'status', header: 'Status', width: '120px',
    render: (v) => <StatusBadge status={v} />,
  },
]

<Table columns={columns} rows={data} getKey={r => r.name} />`

const paginatedCode = `// pageSize turns on the footer: "Page x of y" + prev/next arrows.
<Table columns={columns} rows={rows} pageSize={5} />

// Customise the read-out, or control the page yourself:
<Table
  columns={columns}
  rows={rows}
  pageSize={5}
  page={page}
  onPageChange={setPage}
  pageLabel={(p, total) => \`\${p} / \${total}\`}
/>`

const toc = [
  { id: 'default',      label: 'Default',      child: false },
  { id: 'pagination', label: 'Pagination', child: false },
  { id: 'props',      label: 'Props',      child: false },
]

export default function TablePage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Table</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A typed, column-driven data table with alternating rows, a dark header, and
            horizontal scroll on overflow. Columns accept a{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">render</code>{' '}
            function for custom cell content — badges, avatars, actions, anything.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add table" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={360}
            preview={<TablePreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="pagination" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Pagination</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Set{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">pageSize</code>{' '}
            and the table pages itself: rows cross-fade between pages, and a footer appears with
            the page read-out and prev/next arrows. Control it externally with{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">page</code>{' '}
            +{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">onPageChange</code>.
          </Text>
          <PreviewCode
            minHeight={420}
            preview={<TablePaginatedPreview />}
            code={<CodeBlock code={paginatedCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props — Table</Text>
          <PropsTable rows={[
            { name: 'columns',      type: 'TableColumn<T>[]',                 desc: 'Column definitions.' },
            { name: 'rows',         type: 'T[]',                              desc: 'Data rows.' },
            { name: 'getKey',       type: '(row: T, i: number) => string | number', desc: 'Stable key for each row.' },
            { name: 'pageSize',     type: 'number',                           desc: 'Rows per page. Omit for no pagination.' },
            { name: 'page',         type: 'number',                           desc: 'Controlled page (1-indexed).' },
            { name: 'onPageChange', type: '(page: number) => void',           desc: 'Fires when the user pages.' },
            { name: 'pageLabel',    type: '(page, pages) => ReactNode',       desc: 'Customise the footer read-out.' },
            { name: 'gridCols',     type: 'string',                           desc: 'Override the auto grid-template-columns.' },
            { name: 'minWidth',     type: 'string',                           desc: 'Min width before horizontal scroll. Default "480px".' },
          ]} />

          <Text variant="h3" className="text-zinc-900 dark:text-white mt-6">Props — TableColumn</Text>
          <PropsTable rows={[
            { name: 'key',       type: 'keyof T | string',                 desc: 'Row object key to read.' },
            { name: 'header',    type: 'string',                           desc: 'Column heading.' },
            { name: 'width',     type: 'string',                           desc: 'CSS track size (e.g. "1fr", "120px"). Default "1fr".' },
            { name: 'render',    type: '(value, row, index) => ReactNode', desc: 'Custom cell renderer.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
