'use client'

import { Table, type TableColumn } from '@/components/stepwise/table'

export interface PropRow {
  name: string
  type: string
  desc: string
}

interface PropsTableProps {
  rows: PropRow[]
  /** Grid template for [name, type, desc] columns. Default: '150px 210px 1fr' */
  cols?: string
  minWidth?: string
  headers?: [string, string, string]
}

const MONO = '[font-family:var(--font-geist-mono,monospace)] tracking-[-0.03em]'

export function PropsTable({
  rows,
  cols = '150px 210px 1fr',
  minWidth = '520px',
  headers = ['Prop', 'Type', 'Description'],
}: PropsTableProps) {
  // Every column wraps. Table truncates by default, which is fine for data but
  // wrong for a reference: a clipped type signature like
  // `(files: File[]) => void...` hides the exact thing the reader came for.
  const columns: TableColumn<PropRow>[] = [
    {
      key: 'name', header: headers[0], wrap: true,
      render: v => <code className={`${MONO} break-all text-zinc-700 dark:text-zinc-300`}>{String(v)}</code>,
    },
    {
      key: 'type', header: headers[1], wrap: true,
      render: v => <code className={`${MONO} break-words pr-3`}>{String(v)}</code>,
    },
    { key: 'desc', header: headers[2], wrap: true },
  ]

  return <Table columns={columns} rows={rows} gridCols={cols} minWidth={minWidth} />
}
