import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { LogoRevealBasicPreview } from '@/components/stepwise/docs/logo-reveal-preview'

const basicCode = `import { LogoReveal } from '@/components/stepwise/logo-reveal'

// Mount it at the app root when the site first loads,
// then remove it from state on onFinish.
const [loading, setLoading] = useState(true)

{loading && (
  <LogoReveal
    path="M256 40 L318 190 L480 202 …Z"
    viewBox="0 0 512 512"
    preset="white"          // "white" | "black" | "blueprint"
    onFinish={() => setLoading(false)}
  />
)}`

const presetCode = `<LogoReveal path={LOGO} preset="white" />      // paper + grain
<LogoReveal path={LOGO} preset="black" />      // ink on night
<LogoReveal path={LOGO} preset="blueprint" />  // drafting sheet with grid

// or override any preset colour directly
<LogoReveal path={LOGO} preset="black" fillColor="#38bdf8" />`

const onceCode = `// Play only on the visitor's first load this session.
<LogoReveal
  path={LOGO}
  once
  onceKey="my-site-intro"
  onFinish={() => setLoading(false)}
/>`

const tocItems = [
  { id: 'default',   label: 'Default',            child: false },
  { id: 'presets', label: 'Presets',          child: false },
  { id: 'once',    label: 'Once per session', child: false },
  { id: 'props',   label: 'Props',            child: false },
]

export default function LogoRevealPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Logo Reveal</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            An opening sequence off a drafting table. Hairline construction guides — anchored to
            your logo&apos;s real geometry and overshooting its edges — draw themselves first, the
            mark is traced over them, then the bold fill lands as the scaffolding fades. Grain on
            the ground, three sheets to draw on: white paper, black, and engineering blueprint.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add logo-reveal" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Hit play — the reveal takes over the whole window, not just the preview. Pick a
            style, a mark, and toggle the construction guides and grain.
          </Text>
          <PreviewCode
            minHeight={460}
            preview={<LogoRevealBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="presets" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Presets</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Each preset sets the ground, ink, and guide colours as one considered sheet —{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">blueprint</code>{' '}
            adds the fine drafting grid. Individual colours can still be overridden.
          </Text>
          <CodeBlock code={presetCode} lang="tsx" />
        </section>

        <section id="once" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Once per session</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Set{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">once</code>{' '}
            so returning visitors skip the intro — it&apos;s remembered in{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">sessionStorage</code>{' '}
            under{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">onceKey</code>.
          </Text>
          <CodeBlock code={onceCode} lang="tsx" />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'path',        type: 'string | string[]', desc: "Your logo's path d. An array traces each part in turn." },
            { name: 'viewBox',     type: 'string',            desc: 'The source SVG viewBox. Default "0 0 512 512".' },
            { name: 'size',        type: 'number',            desc: 'Logo size in px. Default 180.' },
            { name: 'preset',      type: '"white" | "black" | "blueprint"', desc: 'Ground + ink + guides as one sheet. Default "white".' },
            { name: 'bgColor',     type: 'string',            desc: "Override the preset's background." },
            { name: 'strokeColor', type: 'string',            desc: "Override the preset's trace colour." },
            { name: 'fillColor',   type: 'string',            desc: 'Override the final fill. Defaults to strokeColor.' },
            { name: 'strokeWidth', type: 'number',            desc: 'Trace width in viewBox units. Default 3.' },
            { name: 'showGuides',  type: 'boolean',           desc: 'Draw the construction guides. Default true.' },
            { name: 'texture',     type: 'boolean',           desc: 'Grain over the ground. Default true.' },
            { name: 'hold',        type: 'number',            desc: 'How long the finished logo holds before fading (ms). Default 700.' },
            { name: 'speed',       type: 'number',            desc: 'Timing multiplier — higher is faster. Default 1.' },
            { name: 'once',        type: 'boolean',           desc: 'Play only once per session.' },
            { name: 'onceKey',     type: 'string',            desc: 'sessionStorage key for the once flag.' },
            { name: 'onFinish',    type: '() => void',        desc: 'Fires after the overlay fully fades. Unmount from here.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
