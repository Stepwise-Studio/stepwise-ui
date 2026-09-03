import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  ChipSoftPreview,
  ChipSolidPreview,
  ChipColorsPreview,
  ChipWithIconPreview,
  ChipDotPreview,
  ChipSizesPreview,
  ChipUsagePreview,
} from '@/components/stepwise/docs/chip-preview'

const softCode = `<Chip color="danger"  variant="soft">Danger</Chip>
<Chip color="warning" variant="soft">Warning</Chip>
<Chip color="success" variant="soft">Success</Chip>
<Chip color="info"    variant="soft">Info</Chip>
<Chip color="magical" variant="soft">Magical</Chip>
<Chip color="idle"    variant="soft">Idle</Chip>`

const solidCode = `<Chip color="danger"  variant="solid">Danger</Chip>
<Chip color="warning" variant="solid">Warning</Chip>
<Chip color="success" variant="solid">Success</Chip>
<Chip color="info"    variant="solid">Info</Chip>
<Chip color="magical" variant="solid">Magical</Chip>
<Chip color="idle"    variant="solid">Idle</Chip>`

const outlineCode = `<Chip color="danger">Danger</Chip>
<Chip color="warning">Warning</Chip>
<Chip color="success">Success</Chip>
<Chip color="info">Info</Chip>
<Chip color="magical">Magical</Chip>
<Chip color="idle">Idle</Chip>`

const iconCode = `<Chip color="success" variant="soft"    icon={<CloudSunny />}>Clear</Chip>
<Chip color="danger"  variant="outline" icon={<Warning2   />}>Blocked</Chip>`

const dotCode = `// only the dot is colored - body always uses neutral styling
<Chip color="success" variant="soft"    dot>Live</Chip>
<Chip color="info"    variant="outline" dot>Syncing</Chip>
<Chip color="warning" variant="soft"    dot>Pending</Chip>
<Chip color="danger"  variant="outline" dot>Error</Chip>`

const sizesCode = `<Chip size="sm"      color="success">Success</Chip>
<Chip size="default" color="success">Success</Chip>
<Chip size="lg"      color="success">Success</Chip>`

const usageCode = `// Status indicators in a list
<Chip color="success" dot>Paid</Chip>
<Chip color="warning" dot>Degraded</Chip>
<Chip color="danger"  dot>Failed</Chip>
<Chip color="info"    dot>In progress</Chip>`

const tocItems = [
  { id: 'soft',    label: 'Soft',      child: false },
  { id: 'solid',   label: 'Solid',     child: false },
  { id: 'outline', label: 'Outline',   child: false },
  { id: 'icon',    label: 'With icon', child: false },
  { id: 'dot',     label: 'Dot',       child: false },
  { id: 'usage',   label: 'Usage',     child: false },
  { id: 'sizes',   label: 'Sizes',     child: false },
  { id: 'props',   label: 'Props',     child: false },
]

export default function ChipPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Chip</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Pill-shaped label in six semantic colors and three variants - soft, solid, and outline.
            Add a leading <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">dot</code>{' '}
            for Live / Pending / Error-style statuses, or an{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">icon</code>{' '}
            for contextual labels.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add chip" />
        </section>

        <section id="soft" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Soft</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Tinted fill with coloured text - the default choice for inline status labels.
          </Text>
          <PreviewCode
            minHeight={100}
            preview={<ChipSoftPreview />}
            code={<CodeBlock code={softCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="solid" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Solid</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Saturated fill with white text - use for high-emphasis labels that need to stand out.
          </Text>
          <PreviewCode
            minHeight={100}
            preview={<ChipSolidPreview />}
            code={<CodeBlock code={solidCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="outline" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Outline</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Transparent fill with a subtle hue-matched border - the lightest option.
          </Text>
          <PreviewCode
            minHeight={100}
            preview={<ChipColorsPreview />}
            code={<CodeBlock code={outlineCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="icon" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">With icon</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            The{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">icon</code>{' '}
            prop accepts any React node and renders it to the left of the label.
          </Text>
          <PreviewCode
            minHeight={140}
            preview={<ChipWithIconPreview />}
            code={<CodeBlock code={iconCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="dot" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Dot</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Pass <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">dot</code> for a leading status dot.
            Only the dot carries the semantic color - the chip body stays neutral so the dot reads as a pure signal.
          </Text>
          <PreviewCode
            minHeight={100}
            preview={<ChipDotPreview />}
            code={<CodeBlock code={dotCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="usage" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Usage</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Common use case: status indicators in a list or table row.
          </Text>
          <PreviewCode
            minHeight={260}
            preview={<ChipUsagePreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="sizes" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Sizes</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Three sizes: sm, default, and lg.
          </Text>
          <PreviewCode
            minHeight={220}
            preview={<ChipSizesPreview />}
            code={<CodeBlock code={sizesCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'color',   type: '"danger" | "warning" | "success" | "info" | "magical" | "idle"', desc: 'Semantic color. Default: "idle".' },
            { name: 'variant', type: '"soft" | "solid" | "outline"',         desc: 'Visual style. Default: "outline".' },
            { name: 'size',    type: '"sm" | "default" | "lg"',              desc: '20 / 24 / 28 px. Default: "default".' },
            { name: 'dot',     type: 'boolean',                              desc: 'Leading status dot in the chip\'s color.' },
            { name: 'icon',    type: 'React.ReactNode',                      desc: 'Optional left icon element.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
