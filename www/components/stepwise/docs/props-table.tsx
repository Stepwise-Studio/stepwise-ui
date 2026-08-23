'use client'

import { Table, type TableColumn } from '@/components/stepwise/table'

export interface PropRow {
  name: string
  type: string
  desc: string
}

interface PropsTableProps {
  rows: PropRow[]
  /** Grid template for [name, type, desc] columns. Default: '140px 180px 1fr' */
  cols?: string
  minWidth?: string
  headers?: [string, string, string]
}

const MONO = '[font-family:var(--font-geist-mono,monospace)] tracking-[-0.03em]'

export function PropsTable({
  rows,
  cols = '140px 180px 1fr',
  minWidth = '520px',
  headers = ['Prop', 'Type', 'Description'],
}: PropsTableProps) {
  const columns: TableColumn<PropRow>[] = [
    {
      key: 'name', header: headers[0],
      render: v => <code className={`${MONO} shrink-0 break-all text-zinc-700 dark:text-zinc-300`}>{String(v)}</code>,
    },
    {
      key: 'type', header: headers[1],
      render: v => <code className={`${MONO} break-words pr-3`}>{String(v)}</code>,
    },
    { key: 'desc', header: headers[2], wrap: true },
  ]

  return <Table columns={columns} rows={rows} gridCols={cols} minWidth={minWidth} />
}
