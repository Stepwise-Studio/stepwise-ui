import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { TooltipPreview } from '@/components/stepwise/docs/tooltip-preview'
import { PropsTable } from '@/components/stepwise/docs/props-table'

const componentCode = `'use client'

import { useState, useRef, useLayoutEffect, useCallback, useId } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils/cn'

type Side = 'top' | 'bottom' | 'left' | 'right'

const GAP = 8, MARGIN = 10

function computePlacement(trigger, tooltip, preferred) {
  const vw = window.innerWidth, vh = window.innerHeight
  const room = {
    top: trigger.top - MARGIN, bottom: vh - trigger.bottom - MARGIN,
    left: trigger.left - MARGIN, right: vw - trigger.right - MARGIN,
  }
  const need = s => (s === 'top' || s === 'bottom') ? tooltip.height : tooltip.width
  const fits = s => room[s] >= need(s) + GAP
  const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

  let side = preferred
  if (!fits(side)) {
    side = fits(opposite[preferred]) ? opposite[preferred]
      : Object.keys(room).reduce((a, b) => room[a] >= room[b] ? a : b)
  }
  let top = 0, left = 0
  if (side === 'top')         { top = trigger.top - tooltip.height - GAP; left = trigger.left + trigger.width / 2 - tooltip.width / 2 }
  else if (side === 'bottom') { top = trigger.bottom + GAP;               left = trigger.left + trigger.width / 2 - tooltip.width / 2 }
  else if (side === 'left')   { top = trigger.top + trigger.height / 2 - tooltip.height / 2; left = trigger.left - tooltip.width - GAP }
  else                        { top = trigger.top + trigger.height / 2 - tooltip.height / 2; left = trigger.right + GAP }

  return {
    top:  Math.max(MARGIN, Math.min(top,  vh - tooltip.height - MARGIN)),
    left: Math.max(MARGIN, Math.min(left, vw - tooltip.width  - MARGIN)),
    side,
  }
}

export function Tooltip({ content, children, side: preferred = 'top', className }) {
  const id = useId()
  const [phase, setPhase] = useState('closed')
  const [pos,   setPos]   = useState({ top: -9999, left: -9999 })
  const [actualSide, setSide] = useState(preferred)
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)
  const closeTimer = useRef(null)

  useLayoutEffect(() => {
    if (phase !== 'measuring') return
    const trig = triggerRef.current?.getBoundingClientRect()
    const tip  = tooltipRef.current?.getBoundingClientRect()
    if (!trig || !tip) return
    const { top, left, side } = computePlacement(trig, tip, preferred)
    setPos({ top, left })
    setSide(side)
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase('open')))
  }, [phase, preferred])

  const show = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setPhase('measuring') }
  const hide = () => {
    setPhase('closing')
    closeTimer.current = setTimeout(() => setPhase('closed'), 80)
  }

  const isOpen = phase === 'open'
  const offsets = { top: '4px', bottom: '-4px', left: '4px', right: '-4px' }

  return (
    <>
      {React.cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: (e) => { show(); children.props.onMouseEnter?.(e) },
        onMouseLeave: (e) => { hide(); children.props.onMouseLeave?.(e) },
        onFocus:      (e) => { show(); children.props.onFocus?.(e) },
        onBlur:       (e) => { hide(); children.props.onBlur?.(e) },
        'aria-describedby': isOpen ? id : undefined,
      })}
      {phase !== 'closed' && createPortal(
        <div id={id} ref={tooltipRef} role="tooltip" style={{
          position: 'fixed',
          top:  phase === 'measuring' ? -9999 : pos.top,
          left: phase === 'measuring' ? -9999 : pos.left,
          visibility: phase === 'measuring' ? 'hidden' : 'visible',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1) translate(0,0)' : \`scale(0.97) translateY(\${offsets[actualSide]})\`,
          transition: isOpen ? 'opacity 150ms ease-out 80ms, transform 150ms ease-out 80ms'
                              : 'opacity 60ms ease-out, transform 60ms ease-out',
          pointerEvents: 'none', zIndex: 9999,
        }}
        className="max-w-[220px] rounded-xl px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 text-[12px] font-medium leading-snug shadow-lg"
        >{content}</div>,
        document.body,
      )}
    </>
  )
}`

const usageCode = `import { Tooltip } from '@/components/stepwise/tooltip'

// Basic — top by default
<Tooltip content="Save to cloud">
  <button>Save</button>
</Tooltip>

// Explicit side
<Tooltip content="Opens settings panel" side="right">
  <IconButton icon={<Settings />} />
</Tooltip>

// Flips automatically near viewport edges
<Tooltip content="Left-aligned but flips right near the edge" side="left">
  <button>Hover me</button>
</Tooltip>

// Rich content
<Tooltip content={<span>Press <kbd>⌘K</kbd> to open</span>} side="bottom">
  <button>Keyboard shortcut</button>
</Tooltip>`

const tocItems = [
  { id: 'preview', label: 'Preview', child: false },
  { id: 'usage',   label: 'Usage',   child: false },
  { id: 'props',   label: 'Props',   child: false },
]

export default async function TooltipPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Tooltip</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A lightweight, edge-aware tooltip that flips placement automatically when
            it would clip against the viewport. Delayed enter, instant exit — no
            library dependencies.
          </Text>
        </div>

        {/* Installation */}
        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add tooltip" />
        </section>

        {/* Preview + Code */}
        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            minHeight={400}
            preview={<TooltipPreview />}
            code={<CodeBlock code={componentCode} className="rounded-none" flat />}
          />
        </section>

        {/* Usage — distinct from the Preview's code tab, which shows the
            component's own source rather than practical call sites */}
        <section id="usage" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Usage</Text>
          <CodeBlock code={usageCode} lang="tsx" />
        </section>

        {/* Props */}
        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>

          <PropsTable rows={[
            { name: 'content',   type: 'ReactNode',                        desc: 'The text or rich content displayed inside the tooltip bubble.' },
            { name: 'children',  type: 'ReactElement',                     desc: 'The trigger element. Must be a single element — the tooltip injects its own ref and event listeners via cloneElement.' },
            { name: 'side',      type: '"top" | "bottom" | "left" | "right"', desc: 'Preferred placement. The tooltip automatically flips to the opposite or roomiest side when the preferred side does not have enough space. Default: "top".' },
            { name: 'className', type: 'string',                           desc: 'Extra classes applied to the tooltip bubble itself — useful for overriding max-width or styling.' },
          ]} />
        </section>

      </div>

      {/* On this page */}
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
