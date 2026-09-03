'use client'

import { useRef } from 'react'
import { Tooltip } from '@/components/stepwise/tooltip'
import { cn } from '@/lib/utils/cn'

function PreviewButton({ children, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn(
        'h-9 px-4 rounded-2xl text-[13px] font-semibold tracking-[-0.02em]',
        'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200',
        'border border-zinc-200 dark:border-zinc-700',
        'transition-[background-color,transform] duration-[120ms]',
        'active:scale-[0.96] cursor-pointer whitespace-nowrap',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function TooltipPreview() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    // All tooltips use this container as their collision boundary. Normal
    // document flow (stacked rows, not absolute-positioned anchor points) -
    // the previous version placed Top/Bottom at fixed pixel offsets and the
    // middle row at fixed 30/50/70% points, none of which accounted for the
    // buttons' actual widths, so anything narrower than desktop overlapped.
    // Flow + flex-wrap holds up at any width by construction.
    <div ref={containerRef} className="flex w-full flex-col items-center justify-center gap-6 py-16">
      <Tooltip content="Appears above" side="top" boundary={containerRef}>
        <PreviewButton>Top</PreviewButton>
      </Tooltip>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Tooltip content="On the left" side="left" boundary={containerRef}>
          <PreviewButton>Left</PreviewButton>
        </Tooltip>
        <Tooltip
          side="bottom"
          boundary={containerRef}
          content={
            <span className="inline-flex items-center gap-1.5">
              Shortcut
              <kbd className="px-1.5 py-[3px] rounded-md bg-zinc-700 dark:bg-zinc-200 text-zinc-100 dark:text-zinc-800 font-mono text-[11px] leading-none">
                ⌘K
              </kbd>
            </span>
          }
        >
          <PreviewButton>Rich content</PreviewButton>
        </Tooltip>
        <Tooltip content="On the right" side="right" boundary={containerRef}>
          <PreviewButton>Right</PreviewButton>
        </Tooltip>
      </div>

      <Tooltip content="Appears below" side="bottom" boundary={containerRef}>
        <PreviewButton>Bottom</PreviewButton>
      </Tooltip>
    </div>
  )
}
