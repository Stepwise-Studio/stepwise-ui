import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  ProgressLivePreview,
  ProgressIndeterminatePreview,
  ProgressLabelPreview,
} from '@/components/stepwise/docs/progress-preview'

const liveCode = `import { Progress } from '@/components/stepwise/progress'

// animates the fill on value change - pass aria-label (or label) when
// nothing else on the page already says what's loading
<Progress value={progress} aria-label="Loading" />`

const indeterminateCode = `// omit value for a looping loader bar
<Progress aria-label="Loading" />`

const labelCode = `<Progress label="Uploading" showValue value={progress} />

// color isn't fixed - derive it from the value for a storage-warning look
const color = pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : 'success'
<Progress label="Storage used" showValue value={pct} color={color}
          formatValue={n => \`\${n}%\`} />`

const toc = [
  { id: 'live',          label: 'Live',           child: false },
  { id: 'indeterminate', label: 'Indeterminate',  child: false },
  { id: 'label',         label: 'Label & value',  child: false },
  { id: 'props',         label: 'Props',          child: false },
]

export default function ProgressPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Progress</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A linear progress bar. Pass a{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">value</code>{' '}
            0–100 for determinate progress, or omit it for an indeterminate loading loop. An
            optional label/value caption row, and a full accessible name wired straight into the
            native <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">progressbar</code> role.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add progress" />
        </section>

        <section id="live" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Live</Text>
          <PreviewCode minHeight={100} preview={<ProgressLivePreview />} code={<CodeBlock code={liveCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="indeterminate" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Indeterminate</Text>
          <PreviewCode minHeight={100} preview={<ProgressIndeterminatePreview />} code={<CodeBlock code={indeterminateCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="label" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Label &amp; value</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">label</code> and{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">showValue</code>{' '}
            add a caption row above the track, matching Slider's own label row. Color isn't stuck
            to one prop value either - the storage bar below derives its own color from how full it
            is, the classic "turns yellow, then red" warning.
          </Text>
          <PreviewCode minHeight={140} preview={<ProgressLabelPreview />} code={<CodeBlock code={labelCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'value',       type: 'number | undefined',                         desc: '0–100. Omit for indeterminate.' },
            { name: 'color',       type: "'brand' | 'success' | 'warning' | 'danger'",  desc: 'Bar color. Default brand.' },
            { name: 'size',        type: 'number',                                     desc: 'Track thickness in px. Default 6.' },
            { name: 'label',       type: 'string',                                     desc: 'Caption shown above the track, on the left.' },
            { name: 'showValue',   type: 'boolean',                                    desc: 'Show the value on the right. Never shown while indeterminate. Default false.' },
            { name: 'formatValue', type: '(v: number) => string',                      desc: 'Format the displayed value. Default `${n}%`.' },
            { name: 'className',   type: 'string',                                     desc: 'Merged onto the track.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
