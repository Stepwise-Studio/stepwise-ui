import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { ArcCarouselPreview } from '@/components/stepwise/docs/arc-carousel-preview'

const basicCode = `import { ArcCarousel } from '@/components/stepwise/arc-carousel'

<ArcCarousel items={photos} />`

const toc = [
  { id: 'default', label: 'Default', child: false },
  { id: 'props',   label: 'Props',   child: false },
]

export default function ArcCarouselPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Arc Carousel</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Photographs riding a shallow arc. Every card follows one shared path, offset
            per card so the set spreads evenly along the curve — no per-frame work, and
            the strip lands in the right place on the first paint. Hovering halts it.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add arc-carousel" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Cards tilt tangentially to the curve, so the ends of the strip lean away
            from the middle.
          </Text>
          <PreviewCode
            minHeight={380}
            preview={<ArcCarouselPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable
            cols="150px 210px 1fr"
            rows={[
              { name: 'items',        type: 'ArcCarouselItem[]', desc: 'Images to loop. { src, alt? }.' },
              { name: 'arc',          type: 'number',  desc: 'Total sweep of the arc in degrees. 0 is flat. Default 29.' },
              { name: 'lift',         type: 'number',  desc: 'How far a card falls below the peak, px. Negative bows it the other way. Default 49.' },
              { name: 'spread',       type: 'number',  desc: 'Card-widths from the peak at which the full angle is reached. Higher is gentler. Default 4.5.' },
              { name: 'duration',     type: 'number',  desc: 'Seconds for one full pass. Default 38.' },
              { name: 'itemWidth',    type: 'number',  desc: 'Card width in px. Default 128.' },
              { name: 'ratio',        type: 'number',  desc: 'Card height ÷ width. Default 1.3.' },
              { name: 'gap',          type: 'number',  desc: 'Space between cards, px. Default 10.' },
              { name: 'radius',       type: 'number',  desc: 'Card corner radius. Default 18.' },
              { name: 'reverse',      type: 'boolean', desc: 'Travel left-to-right instead.' },
              { name: 'pauseOnHover', type: 'boolean', desc: 'Halt travel while hovered. Default true.' },
              { name: 'className',    type: 'string',  desc: 'Merged onto the root.' },
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
