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
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Photographs pinched by a lens across the row: full size at either rim, smallest
            through the middle. The strip's top and bottom edges each trace an ellipse arc.
            Rather than drifting, the row rests on a card then slides
            smoothly to the next one - and you can take over any time with the chevrons
            or by dragging the strip, which settles back onto whole cards when you let
            go. Hovering halts the auto-advance.
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
            bleed
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
              { name: 'ratio',        type: 'number',  desc: 'Card height ÷ width. Default 1.5.' },
              { name: 'minScale',     type: 'number',  desc: 'Scale at the centre of the row - the pinch. Default 0.6.' },
              { name: 'maxScale',     type: 'number',  desc: 'Scale at either rim - the largest cards get on screen. Default 1.' },
              { name: 'autoplay',     type: 'boolean', desc: 'Advance on its own. Default true.' },
              { name: 'interval',     type: 'number',  desc: 'Seconds a card rests before the row advances. Default 2.4.' },
              { name: 'transition',   type: 'number',  desc: 'Seconds one slide takes. Default 0.85.' },
              { name: 'controls',     type: 'boolean', desc: 'Show the prev / next chevrons. Default true.' },
              { name: 'draggable',    type: 'boolean', desc: 'Allow dragging the row left and right. Default true.' },
              { name: 'itemWidth',    type: 'number',  desc: 'Card width at full size, px. Default 124.' },
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
