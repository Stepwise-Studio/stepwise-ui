import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { FrameBasicPreview } from '@/components/stepwise/docs/frame-preview'

const basicCode = `import { Frame } from '@/components/stepwise/frame'

// raw building block — reach for it when nothing else fits: settings rows,
// list items, one-off content blocks. For a pre-built shape, use Profile
// Card, Product Card, Pricing Card, or Stat Card instead.
<Frame className="p-5">
  Whatever you want goes here.
</Frame>`

const toc = [
  { id: 'default', label: 'Default', child: false },
  { id: 'props',   label: 'Props',   child: false },
]

export default function FramePage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Frame</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            The raw, unopinionated content container — the base every other card builds on. Default
            corner radius and squircle smoothing, a theme-aware border, and a quiet resting shadow
            out of the box. Nothing else — put whatever you want inside and style it yourself.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add frame" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={200}
            preview={<FrameBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props — Frame</Text>
          <PropsTable rows={[
            { name: 'radius',        type: 'number',  desc: 'Corner radius in px. Default 20.' },
            { name: 'borderWidth',   type: 'number',  desc: 'Border stroke width in px. Default 1.' },
            { name: 'borderColor',   type: 'string',  desc: 'Border color. Default the theme-aware --ui-border token.' },
            { name: 'borderOpacity', type: 'number',  desc: 'Border opacity, 0–1. Default 0.7.' },
            { name: 'className',     type: 'string',  desc: 'Merged onto the surface.' },
          ]} />
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 mt-2">
            FrameHeader, FrameTitle, FrameDescription, FrameContent, and FrameFooter are optional
            composition helpers — each accepts standard div/heading/paragraph props plus className.
          </Text>
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
