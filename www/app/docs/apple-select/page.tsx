import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  AppleSelectBasicPreview,
  AppleSelectAccentsPreview,
} from '@/components/stepwise/docs/apple-select-preview'

const basicCode = `import { AppleSelect } from '@/components/stepwise/apple-select'

// the author picks the highlighted range - it's fixed, not draggable
<AppleSelect
  text="Introduced with iOS 3 in June 2009 was the ability to select…"
  selection={[43, 60]}
/>`

const accentCode = `import { AppleSelect, APPLE_ACCENTS } from '@/components/stepwise/apple-select'

<AppleSelect text={text} selection={[2, 22]} accent={APPLE_ACCENTS.purple} />
<AppleSelect text={text} selection={[2, 22]} accent="#ff2d55" />   // any hex works`

const tocItems = [
  { id: 'default',   label: 'Default',   child: false },
  { id: 'accents', label: 'Accents', child: false },
  { id: 'props',   label: 'Props',   child: false },
]

export default function AppleSelectPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Apple Select</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            An iOS-style text highlight with a translucent band and a lollipop handle at each end.
            The span is fixed by the author rather than dragged. It's a presentational highlight, not a draggable
            control, so it always reads the way you set it.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add apple-select" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Pass the highlighted range as{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">[start, end]</code>{' '}
            character offsets. The band and handles get a little edge padding so they never sit on the glyphs.
          </Text>
          <PreviewCode
            minHeight={280}
            preview={<AppleSelectBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="accents" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Accents</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            The handles and highlight both follow{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">accent</code>{' '}
            - one of the bundled system tints or any hex value. Pick one with the ColorSwatch below.
          </Text>
          <PreviewCode
            minHeight={280}
            preview={<AppleSelectAccentsPreview />}
            code={<CodeBlock code={accentCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'text',        type: 'string',           desc: 'The full text.' },
            { name: 'selection',   type: '[number, number]', desc: 'The highlighted range as [start, end] offsets. Defaults to a word mid-text.' },
            { name: 'accent',      type: 'string',           desc: 'Handle + highlight colour. Default iOS blue.' },
            { name: 'edgePadding', type: 'number',           desc: 'Breathing room (px) on each edge of the highlight. Default 3.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
