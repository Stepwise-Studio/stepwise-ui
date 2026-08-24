import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { SpinnerPreview, SpinnerDotsPreview, SpinnerStatusPreview } from '@/components/stepwise/docs/loaders-preview'

const spinnerCode = `import { Spinner } from '@/components/stepwise/spinner'

// "arc" is the default — a general-purpose spinner for any surface
<Spinner size="sm" />
<Spinner size="default" />
<Spinner size="lg" />`

const dotsCode = `<Spinner variant="dots" size="sm" />
<Spinner variant="dots" size="default" />
<Spinner variant="dots" size="lg" />`

const statusCode = `// Drive it straight from your async state — the ring resolves and the
// tick draws itself on, so the resolve reads as one gesture.
<Spinner status={saving ? 'loading' : saved ? 'success' : 'error'} />`

const toc = [
  { id: 'spinner', label: 'Spinner',     child: false },
  { id: 'dots',    label: 'Dots',        child: false },
  { id: 'status',  label: 'Status',      child: false },
  { id: 'props',   label: 'Props',       child: false },
]

export default function LoadersPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Spinner</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            An honest circular spinner that resolves into its own answer. Two variants — a sweeping
            arc for general use, and a dotted activity-indicator style for a lighter touch. Looking for the{' '}
            <a href="/docs/dot-grid-loader" className="underline decoration-zinc-300 underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-200">dot grid</a>{' '}
            loader? It has its own page now.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add spinner" />
        </section>

        <section id="spinner" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Spinner</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Three sizes —{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">sm</code>{' '}
            (16px),{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">default</code>{' '}
            (24px), and{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">lg</code>{' '}
            (32px) — or pass an exact pixel diameter.
          </Text>
          <PreviewCode
            preview={<SpinnerPreview />}
            code={<CodeBlock code={spinnerCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="dots" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Dots</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Eight fading dots sweep around the center — the same activity-indicator language as
            iOS/macOS. Pass{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">variant=&quot;dots&quot;</code>.
          </Text>
          <PreviewCode
            preview={<SpinnerDotsPreview />}
            code={<CodeBlock code={dotsCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="status" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Status</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            One component for the whole lifecycle. Pass a{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">status</code>{' '}
            and the ring closes into a filled disc, then the tick (or cross) draws on with a
            spring — the end state grows out of the spinner instead of replacing it.
          </Text>
          <PreviewCode
            preview={<SpinnerStatusPreview />}
            code={<CodeBlock code={statusCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'status',  type: '"loading" | "success" | "error"', desc: 'Drives the whole lifecycle. Default "loading".' },
            { name: 'size',    type: '"sm" | "default" | "lg" | number', desc: 'Named preset or exact px diameter. Default "default".' },
            { name: 'variant', type: '"arc" | "dots"', desc: 'A sweeping stroke, or eight fading dots. Default "arc".' },
          ]} />
        </section>

      </div>

      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
