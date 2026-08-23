'use client'

import { useState } from 'react'
import { Pagination } from '@/components/stepwise/pagination'

export function PaginationBasicPreview() {
  const [page, setPage] = useState(5)
  return (
    <div className="flex flex-col items-center gap-3">
      <Pagination page={page} totalPages={12} onChange={setPage} />
      <span className="text-[12px] text-zinc-400 tabular-nums">Page {page} of 12</span>
    </div>
  )
}

export function PaginationSiblingsPreview() {
  const [page, setPage] = useState(1)
  return (
    <div className="flex flex-col items-center gap-3">
      <Pagination page={page} totalPages={20} onChange={setPage} siblings={2} />
      <span className="text-[12px] text-zinc-400 tabular-nums">Page {page} of 20</span>
    </div>
  )
}
