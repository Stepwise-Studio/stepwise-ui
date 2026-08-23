import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { ScrollAreaVerticalPreview, ScrollAreaHorizontalPreview } from '@/components/stepwise/docs/scroll-area-preview'

const vCode = `import { ScrollArea } from '@/components/stepwise/scroll-area'

<ScrollArea maxHeight={220} showScrollbar className="w-[240px] …">
  {items.map(item => <Row key={item} />)}
</ScrollArea>`

const hCode = `<ScrollArea axis="x" showScrollbar className="w-[320px] …">
  <div className="flex gap-3">{cards}</div>
</ScrollArea>`

const toc = [
  { id: 'vertical',   label: 'Vertical',   child: false },
  { id: 'horizontal', label: 'Horizontal', child: false },
  { id: 'props',      label: 'Props',      child: false },
]

export default function ScrollAreaPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Scroll Area</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Scrolls with no visible scrollbar by default. Pass{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">showScrollbar</code>{' '}
            for Stepwise&apos;s minimal scrollbar instead — a fully transparent track with a slim
            rounded thumb that darkens when you hover or drag it. Theme-aware and self-contained;
            it&apos;s what powers the scroll region inside Command Palette.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add scroll-area" />
        </section>

        <section id="vertical" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Vertical</Text>
          <PreviewCode minHeight={280} preview={<ScrollAreaVerticalPreview />} code={<CodeBlock code={vCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="horizontal" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Horizontal</Text>
          <PreviewCode minHeight={200} preview={<ScrollAreaHorizontalPreview />} code={<CodeBlock code={hCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'maxHeight',     type: 'number | string', desc: 'Cap the height and scroll vertically past it.' },
            { name: 'maxWidth',      type: 'number | string', desc: 'Cap the width and scroll horizontally past it — for axis="x" or "both".' },
            { name: 'axis',          type: "'y' | 'x' | 'both'", desc: 'Scroll axis. Default y.' },
            { name: 'showScrollbar', type: 'boolean', desc: 'Show the thumb instead of scrolling invisibly. Default false.' },
            { name: 'className',     type: 'string', desc: 'Merged onto the scroll container.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
