import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  DeckCarouselPreview,
  DeckCarouselShapePreview,
  DeckCarouselPlainPreview,
} from '@/components/stepwise/docs/deck-carousel-preview'

const basicCode = `import { DeckCarousel } from '@/components/stepwise/deck-carousel'

const routes = [
  { src: '/mirror-lake.jpg', title: 'Mirror Lake', subtitle: 'Alpine · 3 day route', badge: '4.9' },
  // …
]

<DeckCarousel items={routes} />`

const shapeCode = `// shelf
<DeckCarousel items={routes} spread={84} tilt={7} lift={18} scaleStep={0.07} />

// held hand
<DeckCarousel items={routes} spread={50} tilt={12} lift={9} scaleStep={0.09} />`

const plainCode = `// omit title / subtitle / badge and the cards stay bare
<DeckCarousel items={photos} itemWidth={170} ratio={1} radius={26} />`

const toc = [
  { id: 'default', label: 'Default', child: false },
  { id: 'fan',     label: 'Shape of the fan', child: false },
  { id: 'plain',   label: 'Without labels', child: false },
  { id: 'props',   label: 'Props', child: false },
]

export default function DeckCarouselPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Deck Carousel</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A fanned hand of cards — the front one square on, its neighbours falling away
            to either side. Drag it, swipe it, click a card in the fan, or use the arrow
            keys. It's always the index that moves, settling every card on one shared
            spring — never the deck itself getting dragged around.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add deck-carousel" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Each item can carry a{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">title</code>,{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">subtitle</code>,{' '}
            and a{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">badge</code>.
          </Text>
          <PreviewCode
            minHeight={460}
            preview={<DeckCarouselPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="fan" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Shape of the fan</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">spread</code>,{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">tilt</code>,{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">lift</code>{' '}
            and{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">scaleStep</code>{' '}
            each apply per step out from the front card, so a tighter spread with more
            tilt reads as a held hand rather than a shelf.
          </Text>
          <PreviewCode
            minHeight={460}
            preview={<DeckCarouselShapePreview />}
            code={<CodeBlock code={shapeCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="plain" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Without labels</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Leave the text fields off and the scrim goes with them.
          </Text>
          <PreviewCode
            minHeight={380}
            preview={<DeckCarouselPlainPreview />}
            code={<CodeBlock code={plainCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable
            cols="150px 210px 1fr"
            rows={[
              { name: 'items',         type: 'DeckCarouselItem[]', desc: 'Cards. { src, alt?, title?, subtitle?, badge? }.' },
              { name: 'swipeable',     type: 'boolean', desc: 'Drag with a pointer or swipe on touch. Default true.' },
              { name: 'loop',          type: 'boolean', desc: 'Wrap around at the ends. Default true.' },
              { name: 'itemWidth',     type: 'number',  desc: 'Card width in px. Default 190.' },
              { name: 'ratio',         type: 'number',  desc: 'Card height ÷ width. Default 1.32.' },
              { name: 'spread',        type: 'number',  desc: 'Horizontal step between neighbours, px. Default 84.' },
              { name: 'tilt',          type: 'number',  desc: 'Rotation per step out from the front, deg. Default 7.' },
              { name: 'lift',          type: 'number',  desc: 'Drop per step out from the front, px. Default 18.' },
              { name: 'scaleStep',     type: 'number',  desc: 'Scale removed per step out. Default 0.07.' },
              { name: 'visible',       type: 'number',  desc: 'Cards rendered either side of the front. Default 2.' },
              { name: 'radius',        type: 'number',  desc: 'Card corner radius. Default 22.' },
              { name: 'defaultIndex',  type: 'number',  desc: 'Card to open on. Default 0.' },
              { name: 'onIndexChange', type: '(i: number) => void', desc: 'Fires when the front card changes.' },
              { name: 'className',     type: 'string',  desc: 'Merged onto the root.' },
            ]}
          />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
