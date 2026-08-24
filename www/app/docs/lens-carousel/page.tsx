import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { LensCarouselPreview } from '@/components/stepwise/docs/lens-carousel-preview'

const basicCode = `import { LensCarousel } from '@/components/stepwise/lens-carousel'

<LensCarousel items={photos} />`

const toc = [
  { id: 'default', label: 'Default', child: false },
  { id: 'props',   label: 'Props',   child: false },
]

export default function LensCarouselPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Lens Carousel</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Photographs sized as if bounded by an ellipse laid over the row — tallest at
            the centre, tapering toward a shared height at either rim, rather than moving
            up or down. Every card follows one shared path, so the set spreads evenly
            along the row with no per-frame work. Hovering halts it.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add lens-carousel" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={280}
            preview={<LensCarouselPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable
            cols="150px 200px 1fr"
            rows={[
              { name: 'items',        type: 'LensCarouselItem[]', desc: 'Images to loop. { src, alt? }.' },
              { name: 'maxRatio',     type: 'number',  desc: 'Tallest card\'s height ÷ width, at the centre. Default 1.5.' },
              { name: 'minRatio',     type: 'number',  desc: 'Shortest card\'s height ÷ width, at the rim. Default 0.85.' },
              { name: 'spread',       type: 'number',  desc: 'Card-widths from the peak at which a card reaches its shortest. Default 4.' },
              { name: 'duration',     type: 'number',  desc: 'Seconds for one full pass. Default 34.' },
              { name: 'itemWidth',    type: 'number',  desc: 'Card width in px — constant across the row. Default 116.' },
              { name: 'gap',          type: 'number',  desc: 'Space between cards, px. Default 10.' },
              { name: 'radius',       type: 'number',  desc: 'Card corner radius. Default 16.' },
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
