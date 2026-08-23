import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { TestButtonPreview } from '@/components/stepwise/docs/test-button-preview'

const basicCode = `import { TestButton } from '@/components/stepwise/test-button'

<TestButton>Explore components</TestButton>`

const toc = [
  { id: 'default', label: 'Default', child: false },
  { id: 'props', label: 'Props', child: false },
]

export default function TestButtonPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Test Button</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A fully rounded pill with a subtle rainbow inner glow along the bottom edge.
            The fill follows the page theme — light in light mode, dark in dark mode.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add test-button" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={140}
            preview={<TestButtonPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'disabled',  type: 'boolean', desc: '45% opacity, removes glow, blocks interaction.' },
            { name: 'className', type: 'string',  desc: 'Merged onto the inner <button>.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
