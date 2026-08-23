'use client'

import { cn } from '@/lib/utils/cn'

export interface BreadcrumbItem {
  label : string
  href? : string
}

export interface BreadcrumbsProps {
  items      : BreadcrumbItem[]
  /** 'slash' renders "/", 'chevron' renders ›. Default 'slash'. */
  separator? : 'slash' | 'chevron'
  className? : string
}

export function Breadcrumbs({ items, separator = 'slash', className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, i) => {
          const isCurrent = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <span
                  className="select-none text-zinc-300 dark:text-zinc-600"
                  aria-hidden
                >
                  {separator === 'slash' ? (
                    <span className="text-[14px]">/</span>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M4.5 2.5L7.5 6l-3 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
              )}
              {isCurrent || !item.href ? (
                <span
                  className={cn(
                    'text-[13px] tracking-[-0.01em]',
                    isCurrent
                      ? 'text-zinc-900 dark:text-white font-medium'
                      : 'text-zinc-500 dark:text-zinc-400'
                  )}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="text-[13px] tracking-[-0.01em] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-150"
                >
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
