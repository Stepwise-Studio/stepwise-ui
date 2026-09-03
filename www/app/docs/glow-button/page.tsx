import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { GlowButtonBasicPreview, GlowButtonSizesPreview } from '@/components/stepwise/docs/glow-button-preview'

const basicCode = `import { GlowButton } from '@/components/stepwise/glow-button'

<GlowButton>Install on Figma</GlowButton>`

const sizesCode = `<GlowButton size="default">Default</GlowButton>
<GlowButton size="lg">Large</GlowButton>`

const toc = [
  { id: 'default', label: 'Default', child: false },
  { id: 'sizes', label: 'Sizes', child: false },
  { id: 'props', label: 'Props', child: false },
]

export default function GlowButtonPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Glow Button</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A CTA button with a rainbow glow drifting along the inside of its bottom edge. The
            colour field sits inside the pill, never as an outside shadow, and its hues loop
            smoothly. Same two
            sizes and type scale as <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">Button</code>&apos;s
            own default/lg steps, with a very subtle edge. The fill follows the page&apos;s own theme
            (light surface in light mode, dark in dark mode) rather than staying fixed, and the drift
            freezes under{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">prefers-reduced-motion</code>.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add glow-button" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode minHeight={160} preview={<GlowButtonBasicPreview />} code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="sizes" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Sizes</Text>
          <PreviewCode minHeight={160} preview={<GlowButtonSizesPreview />} code={<CodeBlock code={sizesCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'size',     type: '"default" | "lg"', desc: 'Matches Button\'s own default/lg sizing. Default: "default".' },
            { name: 'className', type: 'string',           desc: 'Merged onto the inner <button>.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
