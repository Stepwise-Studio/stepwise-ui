import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  CarouselDeckPreview,
  CarouselHelixPreview,
  CarouselMarqueePreview,
  CarouselPlayground,
} from '@/components/stepwise/docs/carousel-preview'

const playgroundCode = `import { Carousel } from '@/components/stepwise/carousel'

<Carousel items={photos} pattern="helix">
  <h2>A climbing strand</h2>
</Carousel>

// patterns: helix | deck | marquee
// omit children and the centre stays empty`

const helixCode = `<Carousel items={photos} pattern="helix">
  <h2>A climbing strand</h2>
</Carousel>`

const deckCode = `<Carousel items={photos} pattern="deck">
  <h2>Hover to spread</h2>
</Carousel>`

const marqueeCode = `<Carousel items={photos} pattern="marquee">
  <h2>An endless strip</h2>
</Carousel>`

const toc = [
  { id: 'patterns', label: 'Patterns', child: false },
  { id: 'helix',    label: 'Helix',    child: false },
  { id: 'deck',     label: 'Deck',     child: false },
  { id: 'marquee',  label: 'Marquee',  child: false },
  { id: 'props',    label: 'Props',    child: false },
]

export default function CarouselPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Carousel</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Three patterns. Helix climbs. Deck peels, then fans on hover. Marquee drifts
            in one lane — copy floats in the centre. Hover pauses the helix and the strip.
            Reduced motion starts paused.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add carousel" />
        </section>

        <section id="patterns" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Patterns</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Switch between them. Toggle the centre copy.
          </Text>
          <PreviewCode
            minHeight={560}
            preview={<CarouselPlayground />}
            code={<CodeBlock code={playgroundCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="helix" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Helix</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Ten frames on a 400° strand. Copy sits in the column of air.
          </Text>
          <PreviewCode
            minHeight={520}
            preview={<CarouselHelixPreview />}
            code={<CodeBlock code={helixCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="deck" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Deck</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A stack that peels itself. Hover and it spreads into a fan; leave and it
            gathers again.
          </Text>
          <PreviewCode
            minHeight={480}
            preview={<CarouselDeckPreview />}
            code={<CodeBlock code={deckCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="marquee" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Marquee</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Tilted portraits drift in one lane. Centre copy sits over a soft radial veil.
          </Text>
          <PreviewCode
            minHeight={480}
            preview={<CarouselMarqueePreview />}
            code={<CodeBlock code={marqueeCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable
            cols="140px 220px 1fr"
            rows={[
              { name: 'items',        type: 'CarouselItem[]', desc: 'Images to loop. { src, alt? }.' },
              { name: 'pattern',      type: "'helix' | 'deck' | 'marquee'", desc: 'Travel path. Default helix.' },
              { name: 'children',     type: 'ReactNode', desc: 'Optional centre copy over a radial veil.' },
              { name: 'duration',     type: 'number', desc: 'Seconds per cycle (deck: seconds per card).' },
              { name: 'reverse',      type: 'boolean', desc: 'Travel the other way.' },
              { name: 'pauseOnHover', type: 'boolean', desc: 'Pause helix / marquee on hover. Deck fans instead.' },
              { name: 'itemSize',     type: 'number', desc: 'Tile width in px.' },
              { name: 'gap',          type: 'number', desc: 'Space between marquee tiles, px.' },
              { name: 'radius',       type: 'number', desc: 'Helix radius, px.' },
              { name: 'className',    type: 'string', desc: 'Merged onto the root.' },
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
