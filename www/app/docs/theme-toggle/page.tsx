import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { ThemeToggleShowcase } from '@/components/stepwise/docs/theme-toggle-showcase'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'

/* ─── code snippets ─────────────────────────────────────────────────────── */

const usageCode = `import { ThemeToggle } from '@/components/stepwise/theme-toggle'

export default function MyLayout({ children }) {
  return (
    <header className="flex items-center justify-between px-4 h-14">
      <Logo />
      <ThemeToggle />
    </header>
  )
}`

/* ─── page sections ─────────────────────────────────────────────────────── */

const tocItems = [
  { id: 'preview', label: 'Preview', child: false },
  { id: 'usage',   label: 'Usage',   child: false },
  { id: 'api',     label: 'API',     child: false },
]

/* ─── page ──────────────────────────────────────────────────────────────── */

export default async function ThemeTogglePage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">
            Theme Toggle
          </Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A button that switches between light and dark mode with a circular expand
            view-transition animation and cross-fading icon swap.
          </Text>
        </div>

        {/* Installation */}
        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add theme-toggle" />
        </section>

        {/* Preview + Code */}
        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            minHeight={440}
            preview={
              <div className="flex flex-col items-center gap-5">
                <ThemeToggleShowcase />
                <Text variant="caption-soft" className="text-zinc-400 dark:text-zinc-600">
                  Click the above icon to toggle theme
                </Text>
              </div>
            }
            code={
              <CodeBlock code={usageCode} className="rounded-none" flat />
            }
          />
        </section>

        {/* Usage */}
        <section id="usage" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Usage</Text>
          <CodeBlock code={usageCode} lang="tsx" />
        </section>

        {/* API */}
        <section id="api" className="scroll-mt-20 flex flex-col gap-6">
          <Text variant="h3" className="text-zinc-900 dark:text-white">API</Text>

          <div className="flex flex-col gap-3">
            <Text variant="h5" className="text-zinc-700 dark:text-zinc-300">ThemeToggle</Text>
            <Text variant="body-soft" className="text-zinc-500 dark:text-zinc-400">
              No props. Reads and writes theme state via{' '}
              <code className="text-[13px] font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">useTheme()</code>{' '}
              internally. Place it anywhere inside{' '}
              <code className="text-[13px] font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">ThemeProvider</code>.
            </Text>
          </div>

          <div className="flex flex-col gap-3">
            <Text variant="h5" className="text-zinc-700 dark:text-zinc-300">useTheme()</Text>
            <PropsTable
              headers={['Name', 'Type', 'Description']}
              rows={[
                { name: 'theme',  type: '"dark" | "light"',        desc: 'The current active theme.' },
                { name: 'toggle', type: '(e: MouseEvent) => void', desc: 'Switches theme and triggers the circular view-transition from the click origin.' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Text variant="h5" className="text-zinc-700 dark:text-zinc-300">ThemeProvider</Text>
            <Text variant="body-soft" className="text-zinc-500 dark:text-zinc-400">
              Wrap your root layout with{' '}
              <code className="text-[13px] font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">ThemeProvider</code>{' '}
              to enable theme context. It reads{' '}
              <code className="text-[13px] font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">localStorage</code>{' '}
              on mount and syncs the{' '}
              <code className="text-[13px] font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">dark</code>{' '}
              class on{' '}
              <code className="text-[13px] font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">&lt;html&gt;</code>.
            </Text>
          </div>
        </section>

      </div>

      {/* On this page - hidden until xl breakpoint */}
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
