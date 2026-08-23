import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { FlowerBasicPreview, FlowerVariantsPreview } from '@/components/stepwise/docs/flower-loader-preview'

const basicCode = `import { FlowerLoader } from '@/components/stepwise/flower-loader'

<FlowerLoader size={120} />`

const variantsCode = `<FlowerLoader petals={8} petalColor="#a78bfa" centerColor="#f9a8d4" />
<FlowerLoader petals={5} petalColor="#38bdf8" centerColor="#fde047" />`

const toc = [
  { id: 'default',    label: 'Default',    child: false },
  { id: 'variants', label: 'Variants', child: false },
  { id: 'props',    label: 'Props',    child: false },
]

export default function FlowerLoaderPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Flower Loader</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A cute little flower that spins slowly while its petals pulse in a wave — each petal
            blooms and eases back a beat after the one before it, so the wait reads as a flower
            gently opening and closing. Petal count and colours are all yours.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add flower-loader" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={220}
            preview={<FlowerBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="variants" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Colours & petals</Text>
          <PreviewCode
            minHeight={220}
            preview={<FlowerVariantsPreview />}
            code={<CodeBlock code={variantsCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'size',        type: 'number', desc: 'Size in px. Default 96.' },
            { name: 'petals',      type: 'number', desc: 'Number of petals. Default 6.' },
            { name: 'petalColor',  type: 'string', desc: 'Petal colour. Default a soft rose.' },
            { name: 'centerColor', type: 'string', desc: 'Centre colour. Default a warm amber.' },
            { name: 'duration',    type: 'number', desc: 'Seconds for one full rotation. Default 6.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
